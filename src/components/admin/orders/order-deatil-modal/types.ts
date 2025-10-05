import { Order } from "@/lib/types/order";

export interface OrderDetailsModalProps {
  isOpen: boolean;
  order: Order;
  onClose: () => void;
}