import React, { useState } from 'react';
import { addToCart } from '../api/bookApi';

const AddToCart = ({ userId, bookId }) => {
    const [quantity, setQuantity] = useState(1);
    const [format, setFormat] = useState('paper');

    const handleAddToCart = async () => {
        await addToCart(userId, bookId, quantity, format);
        alert('Book added to cart');
    };

    return (
        <div>
            <h2>Add to Cart</h2>
            <label>
                Quantity:
                <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                />
            </label>
            <label>
                Format:
                <select value={format} onChange={(e) => setFormat(e.target.value)}>
                    <option value="paper">Paper</option>
                    <option value="ebook">E-Book</option>
                </select>
            </label>
            <button onClick={handleAddToCart}>Add to Cart</button>
        </div>
    );
};

export default AddToCart;
