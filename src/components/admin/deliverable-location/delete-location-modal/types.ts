import { Location } from "@/lib/types/location";

export interface DeleteLocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    details?: Location;
}