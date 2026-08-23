import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductById,
  fetchProducts,
  clearSelectedProduct,
} from "../redux/productSlice";
import { addToCart } from "../redux/cartSlice";
import ProductGrid from "../components/ProductGrid";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { selectedProduct, detailStatus, error, items } = useSelector(
    (state) => state.products
  );

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [addedMessage, setAddedMessage] = useState(false);

  useEffect(() => {
    dispatch(fetchProductById(id));

    if (items.length === 0) {
      dispatch(fetchProducts());
    }

    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [dispatch, id]);

  useEffect(() => {
    setQuantity(1);
    setAddedMessage(false);
    setSelectedColor("");
    setSelectedImage("");
  }, [id]);

//   useEffect(() => {
//   if (selectedProduct) {
//     setSelectedImage(selectedProduct.image || "");

//     if (selectedProduct.colors?.length > 0) {
//       const firstColor = selectedProduct.colors[0];

//       setSelectedColor(firstColor.name || "");
//       setSelectedImage(firstColor.image || selectedProduct.image || "");
//     }
//   }
// }, [selectedProduct]);


useEffect(() => {
  if (selectedProduct) {
    setSelectedImage(selectedProduct.image || "");
    setSelectedColor("");
  }
}, [selectedProduct]);

  if (detailStatus === "loading") {
    return <Loading label="Loading product..." />;
  }

  if (detailStatus === "failed") {
    return (
      <ErrorMessage
        message={error || "Product not found."}
        onRetry={() => dispatch(fetchProductById(id))}
      />
    );
  }

  if (!selectedProduct) return null;

  const {
    name,
    price,
    oldPrice,
    discount,
    rating,
    category,
    stock,
    description,
    colors,
  } = selectedProduct;

  const related = items
    .filter(
      (p) => p.category === category && p.id !== selectedProduct.id
    )
    .slice(0, 4);

  function handleColorChange(color) {
    setSelectedColor(color.name);
    setSelectedImage(color.image);
    setAddedMessage(false);
  }

  function handleAddToCart() {
    dispatch(
      addToCart({
        id: selectedProduct.id,
        name,
        price,
        image: selectedImage || selectedProduct.image,
        stock,
        quantity,
        color: selectedColor || null,
      })
    );

    setAddedMessage(true);
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail">

        {/* Product Image */}
        <div className="product-detail-image">
          <img
            src={selectedImage || selectedProduct.image}
            alt={name}
          />
        </div>

        {/* Product Information */}
        <div className="product-detail-info">

          <span className="category-label">{category}</span>

          <h1>{name}</h1>

          <div className="product-card-rating">
            {"★".repeat(Math.round(rating))}
            {"☆".repeat(5 - Math.round(rating))}
            <span>({rating})</span>
          </div>

          <div className="product-detail-price">
            <span className="price">${price.toFixed(2)}</span>

            {oldPrice && oldPrice > price && (
              <>
                <span className="old-price">
                  ${oldPrice.toFixed(2)}
                </span>

                <span className="discount-badge">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          <p className="product-description">
            {description}
          </p>

          <p className="stock-info">
            {stock > 0
              ? `${stock} in stock`
              : "Out of stock"}
          </p>

          {/* Colors */}
          {colors && colors.length > 0 && (
            <div className="color-selector">
              <h3>
                Color:{" "}
                <span>{selectedColor}</span>
              </h3>

              <div className="color-options">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    className={`color-option ${
                      selectedColor === color.name
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => handleColorChange(color)}
                  >
                    <img
                      src={color.image}
                      alt={color.name}
                    />

                    <span>{color.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="quantity-selector">
            <button
              onClick={() =>
                setQuantity((q) => Math.max(1, q - 1))
              }
              disabled={quantity <= 1}
            >
              -
            </button>

            <span>{quantity}</span>

            <button
              onClick={() =>
                setQuantity((q) => Math.min(stock, q + 1))
              }
              disabled={quantity >= stock}
            >
              +
            </button>
          </div>

          {/* Add To Cart */}
          <button
            className="btn btn-primary btn-large"
            onClick={handleAddToCart}
            disabled={stock === 0}
          >
            {stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>

          {/* Add To Cart Confirmation */}
          {addedMessage && (
            <div className="cart-success-box">
              <div>
                <strong>Added to Cart! ✅</strong>

                <p>
                  {name}
                  {selectedColor && ` • ${selectedColor}`}
                </p>

                <p>
                  Quantity: {quantity}
                </p>
              </div>

              <Link
                to="/cart"
                className="btn btn-primary"
              >
                View Cart
              </Link>
            </div>
          )}

        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="section">
          <h2 className="section-title">
            Related Products
          </h2>

          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}