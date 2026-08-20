import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  const {
    id,
    name,
    price,
    oldPrice,
    discount,
    rating,
    image,
    stock,
  } = product;

  function handleAddToCart(e) {
    e.preventDefault();
    e.stopPropagation();

    dispatch(
      addToCart({
        id,
        name,
        price,
        image,
        stock,
        quantity: 1,
      })
    );

    alert(`${name} added to cart!`);
  }

  return (
    <div className="product-card">
      <Link to={`/products/${id}`} className="product-card-link">
        <div className="product-card-image">
          <img src={image} alt={name} loading="lazy" />

          {discount > 0 && (
            <span className="discount-badge">-{discount}%</span>
          )}
        </div>

        <div className="product-card-body">
          <h3 className="product-card-name">{name}</h3>

          <div className="product-card-rating">
            {"★".repeat(Math.round(rating))}
            {"☆".repeat(5 - Math.round(rating))}
            <span>({rating})</span>
          </div>

          <div className="product-card-price">
            <span className="price">${price.toFixed(2)}</span>

            {oldPrice && oldPrice > price && (
              <span className="old-price">
                ${oldPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>

      <button
        type="button"
        className="btn btn-primary btn-add-cart"
        onClick={handleAddToCart}
        disabled={stock === 0}
      >
        {stock === 0 ? "Out of Stock" : "Add to Cart"}
      </button>
    </div>
  );
}