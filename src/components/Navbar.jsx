import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  return (
    <nav className="nav">
      <Link to="/" className="brand">MERN Shop</Link>
      <div className="nav-links">
        <Link to="/cart">Cart ({count})</Link>
        {user ? (
          <>
            <Link to="/orders">My Orders</Link>
            <span className="muted">Hi, {user.name}</span>
            <button
              className="btn small"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}
