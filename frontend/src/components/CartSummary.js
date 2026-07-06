const CartSummary = ({ cart }) => {
  if (!cart) {
    return <div className="cart-summary">Loading cart…</div>;
  }

  if (!cart.items.length) {
    return <div className="cart-summary">Your cart is empty.</div>;
  }

  return (
    <div className="cart-summary">
      <h3>Your cart</h3>
      <ul>
        {cart.items.map((item) => (
          <li key={item.product_id}>
            <span>{item.name} × {item.quantity}</span>
            <strong>${item.total.toFixed(2)}</strong>
          </li>
        ))}
      </ul>
      <div className="cart-meta">
        <span>Subtotal</span>
        <strong>${cart.subtotal.toFixed(2)}</strong>
      </div>
      <div className="cart-meta">
        <span>Tax</span>
        <strong>${cart.tax.toFixed(2)}</strong>
      </div>
      <div className="cart-meta">
        <span>Shipping</span>
        <strong>${cart.shipping_estimate.toFixed(2)}</strong>
      </div>
      <div className="cart-total">
        <span>Total</span>
        <strong>${cart.total.toFixed(2)}</strong>
      </div>
    </div>
  );
};

export default CartSummary;
