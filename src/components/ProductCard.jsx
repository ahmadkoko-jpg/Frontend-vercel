import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const outOfStock = product.stock < 1;

  return (
    <div className="product">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="muted">{product.description}</p>
      <div className="row">
        <strong>${product.price}</strong>
        <button className="btn" disabled={outOfStock} onClick={() => addToCart(product)}>
          {outOfStock ? "Out of stock" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}
