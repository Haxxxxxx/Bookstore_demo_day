import React, { createContext, useState } from 'react';

// Create the CartContext
export const CartContext = createContext();

// Provider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Function to calculate the total price of the cart
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, getTotalPrice }}>
      {children}
    </CartContext.Provider>
  );
};
