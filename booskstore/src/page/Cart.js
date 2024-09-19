import React, { useContext, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { getCartItems } from '../api/bookApi';

const CartPage = ({ userId }) => {
  const { cartItems, setCartItems } = useContext(CartContext);



  return (
    <div>
      <h2>Your Cart</h2>
      {cartItems.length > 0 ? (
        <ul>
          {cartItems.map(item => (
            <li key={item.id}>
              {item.title} - {item.quantity} x {item.format}
            </li>
          ))}
        </ul>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default CartPage;
