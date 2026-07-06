const FeatureGrid = ({ features }) => (
  <section className="feature-grid">
    {features.map((feature) => (
      <article key={feature.title}>
        <h4>{feature.title}</h4>
        <p>{feature.description}</p>
      </article>
    ))}
  </section>
);

export default FeatureGrid;
