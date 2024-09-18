import React, { useState, useEffect } from 'react';
import { getOrderProducts } from '../api/bookApi';

const OrderProducts = ({ orderId }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getOrderProducts(orderId)
      .then((res) => setProducts(res))
      .catch((err) => console.error(err));
  }, [orderId]);

  return (
    <div>
      <h2>Order Products</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.title} - Quantity: {product.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderProducts;
