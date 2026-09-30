import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    api("/orders/mine", { token: user.token }).then(setOrders).catch((e) => setError(e.message));
  }, [user]);

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="panel">
      <h2>My Orders</h2>
      {error && <p className="error">{error}</p>}
      {orders.length === 0 && !error && <p className="muted">No orders yet.</p>}
      {orders.map((o) => (
        <div className="order" key={o._id}>
          <div className="row">
            <strong>#{o._id.slice(-6)}</strong>
            <span className="badge">{o.status}</span>
          </div>
          <div className="muted">{new Date(o.createdAt).toLocaleString()}</div>
          <ul>
            {o.items.map((i) => (
              <li key={i.product}>{i.name} × {i.qty} — ${(i.price * i.qty).toFixed(2)}</li>
            ))}
          </ul>
          <strong>Total: ${o.total.toFixed(2)}</strong>
        </div>
      ))}
    </div>
  );
}
