import { useState } from 'react';

const initialState = {
  name: '',
  email: '',
  address: '',
  shipping_method: 'Standard (3-5 days)',
};

const CheckoutForm = ({ onCheckout, disabled }) => {
  const [values, setValues] = useState(initialState);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onCheckout(values);
  };

  const isEmpty = !values.name || !values.email || !values.address;

  return (
    <form className="checkout-form" onSubmit={handleSubmit}>
      <label>Full name</label>
      <input name="name" value={values.name} onChange={handleChange} placeholder="Alex Rivera" />
      <label>Email</label>
      <input name="email" type="email" value={values.email} onChange={handleChange} placeholder="you@example.com" />
      <label>Shipping address</label>
      <textarea name="address" value={values.address} onChange={handleChange} placeholder="123 Maple Lane" />
      <label>Shipping method</label>
      <select name="shipping_method" value={values.shipping_method} onChange={handleChange}>
        <option>Standard (3-5 days)</option>
        <option>Express (1-2 days)</option>
        <option>Overnight</option>
      </select>
      <button type="submit" className="primary-btn" disabled={disabled || isEmpty}>
        Place order
      </button>
    </form>
  );
};

export default CheckoutForm;
