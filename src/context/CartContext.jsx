import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (product) =>
    setItems((prev) => {
      const found = prev.find((i) => i._id === product._id);
      if (found) {
        return prev.map((i) =>
          i._id === product._id ? { ...i, qty: Math.min(i.qty + 1, product.stock) } : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });

  const changeQty = (id, qty) =>
    setItems((prev) =>
      qty < 1
        ? prev.filter((i) => i._id !== id)
        : prev.map((i) => (i._id === id ? { ...i, qty: Math.min(qty, i.stock) } : i))
    );

  const removeFromCart = (id) => setItems((prev) => prev.filter((i) => i._id !== id));
  const clearCart = () => setItems([]);

  const count = items.reduce((n, i) => n + i.qty, 0);
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, changeQty, removeFromCart, clearCart, count, total }}
    >
      {children}
    </CartContext.Provider>
  );
}
