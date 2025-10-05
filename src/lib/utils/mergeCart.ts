import { CartItem } from "../slices/cartSlice";


export const mergeCarts = (userCart?: CartItem[], guestCart?: CartItem[]): CartItem[] => {
  const cartMap = new Map<string, CartItem>();

  if(userCart && guestCart){
    [...userCart, ...guestCart].forEach((item) => {
      if (cartMap.has(item.id)) {
        const existing = cartMap.get(item.id)!;
        cartMap.set(item.id, { ...existing, quantity: existing.quantity + item.quantity });
      } else {
        cartMap.set(item.id, { ...item });
      }
    });
  }

  return Array.from(cartMap.values());
};