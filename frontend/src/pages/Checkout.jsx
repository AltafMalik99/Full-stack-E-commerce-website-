import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectCartItems, selectCartTotal, clearCart } from "../redux/cartSlice";
import { createOrder, clearLastOrder } from "../redux/orderSlice";

export default function Checkout() {
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const { status, error, lastOrder } = useSelector((state) => state.orders);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    city: "",
    phone: "",
  });
  const [formErrors, setFormErrors] = useState({});

  function handleChange(e) {
    setShippingInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function validate() {
    const errors = {};
    if (!shippingInfo.name.trim()) errors.name = "Name is required.";
    if (!shippingInfo.address.trim()) errors.address = "Address is required.";
    if (!shippingInfo.city.trim()) errors.city = "City is required.";
    if (!shippingInfo.phone.trim()) errors.phone = "Phone is required.";
    return errors;
  }

  async function handlePlaceOrder(e) {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const orderData = {
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      shippingInfo,
      total,
    };

    const result = await dispatch(createOrder(orderData));
    if (createOrder.fulfilled.match(result)) {
      dispatch(clearCart());
    }
  }

  if (lastOrder) {
  const orderDate = lastOrder.createdAt
    ? new Date(lastOrder.createdAt).toLocaleString()
    : new Date().toLocaleString();

  return (
    <div className="invoice-page">
      <div className="invoice">
        <div className="invoice-header">
          <div>
            <h1>SHOP.CO</h1>
            <p>Order Invoice</p>
          </div>

          <div className="invoice-order-info">
            <p>
              <strong>Order ID:</strong> #{lastOrder.id}
            </p>
            <p>
              <strong>Date:</strong> {orderDate}
            </p>
          </div>
        </div>

        <div className="invoice-status">
          <h2>🎉 Order Placed Successfully!</h2>
          <p>Thank you for your purchase.</p>
        </div>

        <div className="invoice-customer">
          <h3>Customer Information</h3>

          <p>
            <strong>Name:</strong>{" "}
            {lastOrder.shippingInfo?.name}
          </p>

          <p>
            <strong>Address:</strong>{" "}
            {lastOrder.shippingInfo?.address}
          </p>

          <p>
            <strong>City:</strong>{" "}
            {lastOrder.shippingInfo?.city}
          </p>

          <p>
            <strong>Phone:</strong>{" "}
            {lastOrder.shippingInfo?.phone}
          </p>
        </div>

        <table className="invoice-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {lastOrder.items?.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>${Number(item.price).toFixed(2)}</td>
                <td>{item.quantity}</td>
                <td>
                  ${(item.price * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="invoice-total">
          <p>
            <span>Subtotal</span>
            <strong>${Number(lastOrder.total).toFixed(2)}</strong>
          </p>

          <p>
            <span>Shipping</span>
            <strong>Free</strong>
          </p>

          <p className="grand-total">
            <span>Grand Total</span>
            <strong>
              ${Number(lastOrder.total).toFixed(2)}
            </strong>
          </p>
        </div>

        <div className="invoice-actions">
          <button
            className="btn btn-primary"
            onClick={() => window.print()}
          >
            🖨️ Print Bill
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => {
              dispatch(clearLastOrder());
              navigate("/");
            }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <h2>Your cart is empty</h2>
        <p>Add some products before checking out.</p>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handlePlaceOrder} noValidate>
          <h2>Shipping Information</h2>

          {typeof error === "string" && <p className="form-error-banner">{error}</p>}

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={shippingInfo.name}
              onChange={handleChange}
            />
            {formErrors.name && <span className="field-error">{formErrors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              type="text"
              name="address"
              value={shippingInfo.address}
              onChange={handleChange}
            />
            {formErrors.address && <span className="field-error">{formErrors.address}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              id="city"
              type="text"
              name="city"
              value={shippingInfo.city}
              onChange={handleChange}
            />
            {formErrors.city && <span className="field-error">{formErrors.city}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={shippingInfo.phone}
              onChange={handleChange}
            />
            {formErrors.phone && <span className="field-error">{formErrors.phone}</span>}
          </div>

          <button
            className="btn btn-primary btn-large"
            type="submit"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Placing Order..." : "Place Order"}
          </button>
        </form>

        <div className="order-summary">
          <h2>Order Summary</h2>
          {items.map((item) => (
            <div className="summary-row" key={item.id}>
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
