const OrderStatus = {
  Pending: "pending",
  Processing: "processing",
  Shipped: "shipped",
  Delivered: "delivered",
  Cancelled: "cancelled",
};
export enum OfferType {
  PERCENTAGE = "PERCENTAGE",
  FLAT = "FLAT",
}
export default { OrderStatus, OfferType };
