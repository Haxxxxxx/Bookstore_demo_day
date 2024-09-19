import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { CartContext } from '../../context/CartContext';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const { getTotalPrice } = useContext(CartContext);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const userId = 1; // Replace with actual logged-in user ID
        const response = await axios.get(`http://localhost:5000/api/cart/${userId}`);
        setCartItems(response.data.items);
      } catch (err) {
        console.error('Error fetching cart items:', err);
      }
    };

    fetchCartItems();
  }, []);

  const confirmOrder = async () => {
    try {
      const userId = 1; // Replace with actual logged-in user ID
      const paymentMethod = 'Credit Card';  // Example payment method

      await axios.put(`http://localhost:5000/api/cart/confirm/${userId}`, { paymentMethod });
      alert('Order confirmed!');
    } catch (err) {
      console.error('Error confirming order:', err);
    }
  };

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      <ul>
        {cartItems.map(item => (
          <li key={item.id}>
            {item.title} - ${item.price} x {item.quantity} = ${item.total_item_price}
          </li>
        ))}
      </ul>
      <h3>Total Price: ${getTotalPrice()}</h3>
      <button onClick={confirmOrder}>Confirm Order</button>
    </div>
  );
};

export default CartPage;
