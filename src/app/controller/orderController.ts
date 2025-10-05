// import { prisma } from "@/lib/prisma";
// import { getUserById } from "../services/userService";
// import { createAddressRecord } from "../services/addressService";
// import { Prisma } from "@prisma/client";
// import { createOrderRecord } from "../services/OrdersService";
// import { createOrderItemsRecord } from "../services/OrderItemsService";
// import { updatedProductVariant } from "../services/ProductsService";
// import { createRazorpayOrder } from "../lib/createRazorpayOrder";
// import { createPaymentsRecord } from "../services/paymentsService";

// export const placeOrderController = async (body: any, userId: string) => {
//   try {
//     const user = await getUserById(userId);

//     const result = await prisma.$transaction(
//       async (tx: Prisma.TransactionClient) => {
//         const adressObj = {
//           userId: user.id,
//           street: body.street,
//           city: body.city,
//           country: body.country,
//           zipCode: body.zipCode,
//           state: body.state,
//         };

//         const userAdress = await createAddressRecord(tx, adressObj);
//         let total = 0;
//         const orderItemsData = [];

//         for (const item of body.products) {
//           const variant = await prisma.productVariant.findUnique({
//             where: { id: item.productVariantId },
//           });

//           if (!variant) {
//             throw new Error(
//               `invalid variant for variant ID: ${item.productVariantId}`
//             );
//           }

//           if (variant && variant.stock < item.quantity) {
//             throw new Error(`Insufficient stock`);
//           }

//           total += variant.price * item.quantity;

//           orderItemsData.push({
//             productId: item.productId,
//             quantity: item.quantity,
//             price: variant.price,
//             productVariantId: item.productVariantId,
//           });
//         }

//         const orderObj = {
//           userId,
//           addressId: userAdress.id,
//           total,
//           status: "pending",
//         };

//         const order = await createOrderRecord(tx, orderObj);

//         const orderItemPromises = orderItemsData.map(async (item) => {
//           const orderItemObj = {
//             orderId: order.id,
//             productId: item.productId,
//             productVariantId: item.productVariantId,
//             quantity: item.quantity,
//             price: item.price,
//           };

//           const orderItems = await createOrderItemsRecord(tx, orderItemObj);

//           const updatedProduct = await updatedProductVariant(
//             tx,
//             item.productVariantId,
//             item.quantity
//           );
//         });
//         await Promise.all(orderItemPromises);
//         return order;
//       },
//       { timeout: 200000 }
//     );

//     const placeOrder = await createRazorpayOrder(result);
//     const paymentsObj: any = {
//       razorpayOrderId: placeOrder?.order.id,
//       orderId: result.id,
//       status: "pending",
//       amount: placeOrder?.order.amount,
//     };

//     const paymentsRecord = await createPaymentsRecord(paymentsObj);
//     return { placeOrder, paymentsRecord };
//   } catch (error) {
//     console.log("Error in placeOrderController", error);
//     throw error;
//   }
// };

import { prisma } from "@/lib/prisma";
import { getUserById } from "../services/userService";
import { updateAddressRecord } from "../services/addressService";
import { Prisma } from "@prisma/client";
import {
  applyOffer,
  calculateGSTBreakup,
  createOrderRecord,
  ProductWithTaxRates,
} from "../services/OrdersService";
import { createOrderItemsRecord } from "../services/OrderItemsService";
import { updatedProductVariant } from "../services/ProductsService";
import { createRazorpayOrder } from "../lib/createRazorpayOrder";
import { createPaymentsRecord } from "../services/paymentsService";
import {
  findNearestStoreInZone,
  isUserWithinRadius,
} from "../services/locationService";
import { lockRowForUpdate } from "../lib/lockRow";
import { getOfferByCouponCode } from "../services/offerService";

const isServerLive = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_WEBSOCKET_URL}/api/ping`);
    console.log("Waking up socket server from deep sleep");

    return res.ok;
  } catch (error) {
    console.error("🚫 Socket server not reachable:", error);
    return false;
  }
};

export const placeOrderController = async (body: any, userId: string) => {
  try {
    const user = await getUserById(userId);

    const result = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        if (!user.Address[0].latitude && !user.Address[0].longitude) {
          throw new Error("user location not found");
        }

        const zone = await isUserWithinRadius(
          user.Address[0].latitude,
          user.Address[0].longitude
        );

        if (!zone.isWithinRadius) {
          throw new Error("Sorry, we do not deliver to your location yet.");
        }

        const { store: nearestStore, distance: storeDistance } =
          await findNearestStoreInZone(
            Number(user.Address[0].latitude),
            Number(user.Address[0].longitude),
            zone.zoneId!,
            tx
          );

        const adressObj = {
          userId: user.id,
          street: body.street,
          city: body.city,
          country: body.country,
          zipCode: body.zipCode,
          state: body.state,
        };

        const userAdress = await updateAddressRecord(
          user.Address[0].id,
          adressObj,
          tx
        );
        let total = 0;
        const orderItemsData = [];
        let gstBreakup: any;

        if (!body.products || body.products.length === 0) {
          throw new Error("No products found in order.");
        }
        let finalAmount = 0;
        for (const item of body.products) {
          const variant = await prisma.productVariant.findUnique({
            where: { id: item.productVariantId },
          });

          if (!variant) {
            throw new Error(
              `invalid variant for variant ID: ${item.productVariantId}`
            );
          }

          if (variant && variant.stock < item.quantity) {
            throw new Error(`Insufficient stock`);
          }

          const product = await prisma.product.findUnique({
            where: { id: item.productId },
          });

          if (!product) {
            throw new Error(`invalid product ID: ${item.productVariantId}`);
          }

          total += variant.price * item.quantity;
          let deliveryFee = body.deliveryFee;
          const productWithTaxRates: ProductWithTaxRates = {
            basePrice: variant.discountedPrice,
            deliveryFee: deliveryFee,
            quantity: item.quantity,
            cgstRate: product.cgst,
            igstRate: product.igst,
            sgstRate: product.sgst,
          };

          gstBreakup = await calculateGSTBreakup({
            productWithTaxRates,
            buyerState: body.state,
          });
          finalAmount += gstBreakup.totalPrice;

          console.log("gstBreakup", gstBreakup);

          orderItemsData.push({
            productId: item.productId,
            quantity: item.quantity,
            price: variant.price,
            productVariantId: item.productVariantId,
          });
        }

        gstBreakup.totalPrice = finalAmount + body.deliveryFee;
        let OfferApplied;

        if (body.couponCode && !body.offerId) {
          const offerData = await getOfferByCouponCode(body.couponCode);

          const offer = await applyOffer({
            userId: userId,
            totalOrderAmount: gstBreakup?.totalPrice,
            offerId: offerData.id,
          });

          gstBreakup.totalPrice = offer.finalAmount;
        }

        if (body.offerId && !body.couponCode) {
          OfferApplied = await applyOffer({
            offerId: body.offerId,
            totalOrderAmount: gstBreakup?.totalPrice,
            userId: userId,
          });
          gstBreakup.totalPrice = OfferApplied.finalAmount;
        }
        console.log({ OfferApplied });

        const orderObj = {
          userId,
          storeId: nearestStore.id,
          addressId: userAdress.id,
          total: gstBreakup?.totalPrice,
          status: "pending",
          isIGST: gstBreakup?.isIGST,
          subTotal: gstBreakup?.subTotal,
          gstTotal: gstBreakup?.gstAmount,
          deliveryFee: body.deliveryFee,
          offerId: body.offerId ? body.offerId : undefined,
        };

        const order = await createOrderRecord(tx, orderObj);
        console.log("order", order);

        const orderItemPromises = orderItemsData.map(async (item) => {
          const orderItemObj = {
            orderId: order.id,
            productId: item.productId,
            productVariantId: item.productVariantId,
            quantity: item.quantity,
            price: item.price,
          };

          const orderItems = await createOrderItemsRecord(tx, orderItemObj);

          await lockRowForUpdate(item.productVariantId, "ProductVariant", tx);

          const updatedProduct = await updatedProductVariant(
            tx,
            item.productVariantId,
            item.quantity
          );
        });
        await Promise.all(orderItemPromises);

        // Notify both user and admin
        if (await isServerLive()) {
          await fetch(`${process.env.NEXT_WEBSOCKET_URL}/sendNotification`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              orderId: order.id,
              userId: userId,
              userName: user.name || "user",
            }),
          });
          console.log(`server is live ${new Date()}`);
        } else {
          console.warn("⚠️ Notification server is down, skipping send.");
        }

        const placeOrder = await createRazorpayOrder(order);
        console.log("placeOrder", placeOrder);

        const paymentsObj: any = {
          razorpayOrderId: placeOrder.order.id,
          orderId: order.id,
          status: "pending",
          amount: placeOrder.order.amount,
          method: body.paymentMethod,
        };
        console.log("paymentsObj", paymentsObj);
        const paymentsRecord = await createPaymentsRecord(paymentsObj, tx);
        return { placeOrder };
      },
      { timeout: 200000 }
    );

    return { placeOrder: result.placeOrder };
  } catch (error) {
    console.log("Error in placeOrderController", error);
    throw error;
  }
};
