import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FeatureGrid from '../components/FeatureGrid';
import { fetchFeaturedProduct } from '../services/api';

const features = [
  {
    title: 'Curated catalog',
    description: 'Structured collections and thoughtful descriptions keep shoppers focused on making a single, confident choice.',
  },
  {
    title: 'Clear incentives',
    description: 'Highlight social proof, limited stock, and value propositions before visitors reach the checkout page.',
  },
  {
    title: 'Customer-first checkout',
    description: 'Keep form fields brief, pre-populate reusable text, and celebrate the outcome before redirecting to the cart view.',
  },
];

const HomePage = () => {
  const [featured, setFeatured] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeaturedProduct()
      .then(setFeatured)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="home-page">
      <div className="hero">
        <div>
          <p className="eyebrow">Curated goods · fast checkout</p>
          <h1>Design-forward commerce experiences with laser focus.</h1>
          <p className="hero-copy">
            Showcase hero stories, highlight product details, and transition customers into the catalog without forcing
            them to open new tabs. The landing page keeps people inspired while the store keeps things actionable.
          </p>
          <div className="hero-actions">
            <Link to="/catalog" className="primary-btn">
              Browse catalog
            </Link>
          </div>
        </div>
        <div className="hero-detail">
          <p className="eyebrow">Need inspiration?</p>
          <h2>Launch in minutes, delight for weeks.</h2>
          <p className="hero-subcopy">
            The home/product detail blend walks shoppers through why the item matters before sending them into the cart funnel.
          </p>
        </div>
      </div>
      <FeatureGrid features={features} />
      <section className="featured-panel">
        <div className="featured-visual">
          {loading && <p>Loading featured product…</p>}
          {error && <p className="alert error">{error}</p>}
          {featured && (
            <img src={featured.image} alt={featured.name} />
          )}
        </div>
        <div className="featured-detail">
          <p className="eyebrow">Featured detail</p>
          {featured ? (
            <>
              <h3>{featured.name}</h3>
              <p>{featured.description}</p>
              <ul className="tag-list">
                {featured.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              <div className="price-row">
                <strong>${featured.price.toFixed(2)}</strong>
                <span>{featured.rating}★ customer score</span>
              </div>
              <Link to="/catalog" className="primary-btn">
                Add it to your cart
              </Link>
            </>
          ) : (
            <p className="muted">A featured product will appear here once the catalog initializes.</p>
          )}
        </div>
      </section>
    </section>
  );
};

export default HomePage;
