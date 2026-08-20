import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectCartCount } from "../redux/cartSlice";
import { logoutUser } from "../redux/authSlice";
import { useAuth } from "../context/AuthContext";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = useSelector(selectCartCount);
  const { user, isAuthenticated } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

function handleLogout() {
  const confirmed = window.confirm(
    "Are you sure you want to logout?"
  );

  if (!confirmed) return;

  dispatch(logoutUser());
  setMobileOpen(false);
  navigate("/");
}
  return (
    <header className="navbar">
      <div className="navbar-top">
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        <Link to="/" className="logo">
          SHOP.CO
        </Link>

        <nav className={`nav-links ${mobileOpen ? "open" : ""}`}>
          <Link to="/categories/men" onClick={() => setMobileOpen(false)}>
            Men
          </Link>
          <Link to="/categories/women" onClick={() => setMobileOpen(false)}>
            Women
          </Link>
          <Link to="/categories/shoes" onClick={() => setMobileOpen(false)}>
            Shoes
          </Link>
          <Link to="/categories/accessories" onClick={() => setMobileOpen(false)}>
            Accessories
          </Link>
        </nav>

        <div className="navbar-search">
          <SearchBar />
        </div>

        <div className="navbar-actions">
          <Link to="/cart" className="cart-icon" aria-label="Cart">
            🛒
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-name">Hi, {user?.name?.split(" ")[0]}</span>
              <button className="btn btn-link" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-link">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
