import React, { useState, useEffect } from 'react';
import { getCartItems, confirmOrder } from '../api/bookApi';

const Cart = ({ userId }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isConfirming, setIsConfirming] = useState(false);

    useEffect(() => {
        const fetchCartItems = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const items = await getCartItems(userId);
                setCartItems(items);
            } catch (err) {
                setError('Failed to fetch cart items.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCartItems();
    }, [userId]);

    const handleConfirmOrder = async () => {
        setIsConfirming(true);
        setError(null);
        try {
            await confirmOrder(userId);
            alert('Order confirmed!');
            setCartItems([]);
        } catch (err) {
            setError('Failed to confirm order.');
            console.error(err);
        } finally {
            setIsConfirming(false);
        }
    };

    if (isLoading) {
        return <p>Loading your cart...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h2>Your Cart</h2>
            {cartItems.length > 0 ? (
                <>
                    <ul>
                        {cartItems.map(item => (
                            <li key={item.id}>
                                {item.title} - {item.quantity} x {item.format}
                            </li>
                        ))}
                    </ul>
                    <button onClick={handleConfirmOrder} disabled={isConfirming}>
                        {isConfirming ? 'Confirming...' : 'Confirm Order'}
                    </button>
                </>
            ) : (
                <p>Your cart is empty.</p>
            )}
        </div>
    );
};

export default Cart;
