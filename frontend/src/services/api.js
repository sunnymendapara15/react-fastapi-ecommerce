const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const safeFetch = async (path, options = {}) => {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload.detail || payload.message || 'Unable to reach the API';
    throw new Error(message);
  }
  return payload;
};

export const fetchProducts = () => safeFetch('/products');
export const fetchFeaturedProduct = () => safeFetch('/featured');
export const fetchCart = () => safeFetch('/cart');
export const addCartItem = (payload) =>
  safeFetch('/cart', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
export const checkoutCart = (payload) =>
  safeFetch('/cart/checkout', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
