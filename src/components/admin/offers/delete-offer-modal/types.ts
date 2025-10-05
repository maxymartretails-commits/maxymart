import { Offers } from "@/lib/types/offers";

export interface DeleteOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  details?: Offers;
}