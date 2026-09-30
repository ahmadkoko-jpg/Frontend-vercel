import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { items, changeQty, removeFromCart, clearCart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const checkout = async () => {
    if (!user) return navigate("/login");
    if (!address.trim()) return setError("Please enter a delivery address");
    setBusy(true);
    setError("");
    try {
      await api("/orders", {
        method: "POST",
        token: user.token,
        body: { address, items: items.map((i) => ({ productId: i._id, qty: i.qty })) },
      });
      clearCart();
      navigate("/orders");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (items.length === 0) {
    return (
      <p className="muted">
        Your cart is empty. <Link to="/">Go shopping</Link>
      </p>
    );
  }

  return (
    <div className="panel">
      <h2>Your Cart</h2>
      {items.map((i) => (
        <div className="cart-row" key={i._id}>
          <img src={i.image} alt={i.name} />
          <div className="grow">
            <strong>{i.name}</strong>
            <div className="muted">${i.price}</div>
          </div>
          <input
            type="number"
            min="1"
            max={i.stock}
            value={i.qty}
            onChange={(e) => changeQty(i._id, Number(e.target.value))}
          />
          <button className="btn danger small" onClick={() => removeFromCart(i._id)}>✕</button>
        </div>
      ))}
      <h3>Total: ${total.toFixed(2)}</h3>
      <textarea
        placeholder="Delivery address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      {error && <p className="error">{error}</p>}
      <button className="btn" disabled={busy} onClick={checkout}>
        {busy ? "Placing order..." : user ? "Place order" : "Login to checkout"}
      </button>
    </div>
  );
}
