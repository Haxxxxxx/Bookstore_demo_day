import React, { useState, useEffect } from 'react';
import { getCartItems, confirmOrder } from '../api/bookApi';

const Cart = ({ userId }) => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const fetchCartItems = async () => {
            const items = await getCartItems(userId);
            setCartItems(items);
        };

        fetchCartItems();
    }, [userId]);

    const handleConfirmOrder = async () => {
        await confirmOrder(userId);
        alert('Order confirmed!');
        setCartItems([]);
    };

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
            {cartItems.length > 0 && (
                <button onClick={handleConfirmOrder}>Confirm Order</button>
            )}
        </div>
    );
};

export default Cart;
