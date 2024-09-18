import React, { useState, useEffect } from 'react';
import { getProductsNotPurchased6Months } from '../api/bookApi';

const ProductsNotPurchased6Months = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProductsNotPurchased6Months()
      .then((res) => setProducts(res))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Products Not Purchased in 6 Months</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductsNotPurchased6Months;
