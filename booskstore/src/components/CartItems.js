import React, { useState, useEffect } from 'react';
import { getCartItemsByUserId } from '../api/bookApi';

const CartItems = ({ userId }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    getCartItemsByUserId(userId)
      .then((res) => setCartItems(res))
      .catch((err) => console.error(err));
  }, [userId]);

  return (
    <div>
      <h2>Cart Items</h2>
      <ul>
        {cartItems.map((item) => (
          <li key={item.id}>
            {item.title} - Quantity: {item.quantity} - Price: ${item.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CartItems;
