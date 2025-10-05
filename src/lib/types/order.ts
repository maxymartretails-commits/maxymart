export interface RazorpayOrder {
  amount: number;
  amount_due: number;
  amount_paid: number;
  attempts: number;
  created_at: number;
  currency: string;
  entity: string;
  id: string;
  notes: any[]; // You can replace this with a more specific type if needed
  offer_id: string | null;
  receipt: string;
  status: string;
}

export interface PaymentsRecord {
  id: string;
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string | null;
  signature: string | null;
  amount: number;
  currency: string;
  status: string;
  method: string | null;
  captured: boolean;
  email: string | null;
  contact: string | null;
  createdAt: string; // or `Date` if you parse it
  updatedAt: string; // or `Date` if you parse it
}

export interface PlaceOrderResult {
  success: boolean;
  order: RazorpayOrder;
}

export interface PlaceOrderResponse {
  placeOrder: {
    placeOrder: PlaceOrderResult;
    paymentsRecord: PaymentsRecord;
  };
}

export interface RazorpayOrderResponse {
  placeOrder: {
    placeOrder: {
      success: boolean;
      order: {
        id: string;
        entity: string;
        amount: number;
        amount_paid: number;
        amount_due: number;
        currency: string;
        receipt: string | null;
        offer_id: string | null;
        status: "created" | "paid" | "attempted";
        attempts: number;
        notes: any[]; // Razorpay allows arbitrary key-value here
        created_at: number; // Unix timestamp
      };
    };
  };
}


export type Order = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  userId: string;
  total: number;
  subTotal: number;
  gstTotal: number;
  deliveryFee: number;
  paymentStatus: "pending" | "paid" | "failed"; // tweak as per your app
  status: "pending" | "confirmed" | "dispatched" | "delivered" | "cancelled";
  addressId: string;
  offerId: string | null;
  invoice: string;
  invoiceId: string | null;
  isIGST: boolean;
  user: User;
  items: OrderItems[];
  address: Address;
  payments: [
    {
      method: string
    }
  ]
};

export type User = {
  id: string;
  name: string;
  email: string;
  password: string | null;
  phoneNumber: string | null;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  profileImage: string | null;
  latitude: string | null;
  longitude: string | null;
  emailVerified: string | null;
  roleId: string;
};

export type OrderItems = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  productVariantId: string;
  product: { name: string }
};

type Address = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  userId: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
};

export type Orders = {
  orders: Order[],
  totalCount: number,
  totalSales: number[]
}

export type Product = {
  id: string;
  name: string;
  description: string;
  images: string[];
};

export type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  product: Product;
};

export type recentOrders = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  userId: string;
  total: number;
  paymentStatus: string;
  status: string;
  addressId: string;
  items: OrderItem[];
};


export type CartItemWithGST = {
  basePrice: number;
  deliveryFee: number;
  discountedPrice: number;
  cgstRate: number;
  igstRate: number;
  sgstRate: number;
  totalPrice: number;
};

export type CartWithGSTResponse = {
  cartWithGSTbreakup: CartItemWithGST[];
  finalAmount: number;
};