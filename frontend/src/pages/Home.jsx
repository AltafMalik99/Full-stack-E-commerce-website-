import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProducts } from "../redux/productSlice";
import Hero from "../components/Hero";
import ProductGrid from "../components/ProductGrid";
import CategoryCard from "../components/CategoryCard";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

const CATEGORIES = [
  {
    name: "Men",
    slug: "men",
    image: `${import.meta.env.BASE_URL}men.png`,
  },
  {
    name: "Women",
    slug: "women",
    image: `${import.meta.env.BASE_URL}women.png`,
  },
  {
    name: "Shoes",
    slug: "shoes",
    image: `${import.meta.env.BASE_URL}shoes.png`,
  },
  {
    name: "Accessories",
    slug: "accessories",
    image: `${import.meta.env.BASE_URL}accessories.png`,
  },
];

export default function Home() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const newArrivals = items.slice(0, 4);
  const popular = [...items].sort((a, b) => b.rating - a.rating).slice(0, 4);

  return (
    <>
      <Hero />

      <section className="section">
        <h2 className="section-title">Shop by Category</h2>
        <div className="category-grid">
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat.slug} {...cat} />
          ))}
        </div>
      </section>

      {status === "loading" && <Loading label="Loading products..." />}
      {status === "failed" && (
        <ErrorMessage
          message={error || "Could not load products."}
          onRetry={() => dispatch(fetchProducts())}
        />
      )}

      {status === "succeeded" && (
        <>
          <section className="section">
            <div className="section-header">
              <h2 className="section-title">New Arrivals</h2>
              <Link to="/categories/all" className="section-link">
                View All
              </Link>
            </div>
            <ProductGrid products={newArrivals} />
          </section>

          <section className="section promo-section">
            <h2>Up to 30% Off Selected Styles</h2>
            <p>Refresh your wardrobe with our latest seasonal picks.</p>
            <Link to="/categories/all" className="btn btn-primary btn-large">
              Shop the Sale
            </Link>
          </section>

          <section className="section">
            <div className="section-header">
              <h2 className="section-title">Popular Products</h2>
              <Link to="/categories/all" className="section-link">
                View All
              </Link>
            </div>
            <ProductGrid products={popular} />
          </section>
        </>
      )}
    </>
  );
}
