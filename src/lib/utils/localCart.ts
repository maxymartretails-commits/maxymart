import { CartItem } from "../slices/cartSlice";


export const saveCartToLocal = (cart: CartItem[]) => {
  localStorage.setItem("cart_items", JSON.stringify(cart));
};

export const loadCartFromLocal = (): CartItem[] => {
  const cart = localStorage.getItem("cart_items");
  return cart ? JSON.parse(cart) : [];
};

export const clearLocalCart = () => {
  localStorage.removeItem("cart_items");
};