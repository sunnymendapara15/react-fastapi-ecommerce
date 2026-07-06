import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import CartSummary from '../components/CartSummary';
import CheckoutForm from '../components/CheckoutForm';
import { fetchProducts, fetchCart, addCartItem, checkoutCart } from '../services/api';

const CatalogPage = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(null);
  const [addingId, setAddingId] = useState(null);
  const [checkoutStatus, setCheckoutStatus] = useState(null);
  const [error, setError] = useState(null);

  const loadProducts = async () => {
    try {
      setError(null);
      const results = await fetchProducts();
      setProducts(results);
    } catch (err) {
      setError(err.message);
    }
  };

  const loadCart = async () => {
    try {
      setError(null);
      const latestCart = await fetchCart();
      setCart(latestCart);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadProducts();
    loadCart();
  }, []);

  const handleAddToCart = async (productId) => {
    setAddingId(productId);
    try {
      setError(null);
      const updatedCart = await addCartItem({ product_id: productId, quantity: 1 });
      setCart(updatedCart);
    } catch (err) {
      setError(err.message);
    } finally {
      setAddingId(null);
    }
  };

  const handleCheckout = async (payload) => {
    try {
      setError(null);
      const response = await checkoutCart(payload);
      setCheckoutStatus({ type: 'success', message: response.message });
      loadCart();
    } catch (err) {
      setCheckoutStatus({ type: 'error', message: err.message });
    }
  };

  return (
    <section className="catalog-page">
      <div className="catalog-content">
        <h2>Shop convergence</h2>
        <p className="muted">Pick a product, feel the detail, and use the cart summary to make the purchase predictable.</p>
        {error && <div className="alert error">{error}</div>}
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={() => handleAddToCart(product.id)}
              loading={addingId === product.id}
            />
          ))}
        </div>
        {!products.length && <p className="muted">Loading catalog…</p>}
      </div>
      <aside className="cart-panel">
        <CartSummary cart={cart} />
        <CheckoutForm onCheckout={handleCheckout} disabled={!cart?.items?.length} />
        {checkoutStatus && (
          <div className={`alert ${checkoutStatus.type}`}>{checkoutStatus.message}</div>
        )}
      </aside>
    </section>
  );
};

export default CatalogPage;
