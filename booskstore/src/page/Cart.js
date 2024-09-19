import React, { useEffect, useState } from 'react';
import { getCartItemsByUserId, addToCart, confirmOrder, updateCartItem } from '../api/bookApi'; 

function CartPage({ userId }) {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      const items = await getCartItemsByUserId(userId);
      setCartItems(items);
    };

    fetchCartItems();
  }, [userId]);

  const handleAddToCart = async (bookId, quantity, format) => {
    await addToCart(userId, bookId, quantity, format);
    const updatedItems = await getCartItemsByUserId(userId);
    setCartItems(updatedItems);
  };

  const handleUpdateCartItem = async (bookId, quantity) => {
    await updateCartItem(userId, bookId, quantity);
    const updatedItems = await getCartItemsByUserId(userId);
    setCartItems(updatedItems);
  };

  const handleConfirmOrder = async () => {
    await confirmOrder(userId);
    alert('Order confirmed!');
  };

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      <ul>
        {cartItems.map((item) => (
          <li key={item.id}>
            {item.title} - {item.quantity} pcs
            <button onClick={() => handleUpdateCartItem(item.id, item.quantity + 1)}>+</button>
            <button onClick={() => handleUpdateCartItem(item.id, item.quantity - 1)}>-</button>
          </li>
        ))}
      </ul>
      <button onClick={handleConfirmOrder}>Confirm Order</button>
    </div>
  );
}

export default CartPage;
