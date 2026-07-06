const ProductCard = ({ product, onAdd, loading }) => (
  <article className="product-card">
    <div className="product-image">
      <img src={product.image} alt={product.name} loading="lazy" />
    </div>
    <div className="product-body">
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <div className="product-meta">
        <span>${product.price.toFixed(2)}</span>
        <span>{product.rating.toFixed(1)}★</span>
      </div>
      <p className="product-inventory">{product.inventory} in stock</p>
      <button className="primary-btn" onClick={onAdd} disabled={loading || product.inventory === 0}>
        {loading ? 'Adding…' : 'Add to cart'}
      </button>
    </div>
  </article>
);

export default ProductCard;
