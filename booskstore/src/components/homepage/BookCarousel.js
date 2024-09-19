import React, { useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import axios from 'axios';
import '../css/BookCarousel.css'

const BookCarousel = ({ books }) => {
  const { cartItems, setCartItems } = useContext(CartContext);

  const addToCart = async (book) => {
    try {
      const userId = JSON.parse(localStorage.getItem('user'))?.id; // Get user ID from localStorage
      if (!userId) {
        alert('Please log in to add items to your cart.');
        return;
      }

      const response = await axios.post(`http://localhost:5000/api/cart/${userId}`, {
        bookId: book.id,
        quantity: 1, // Default quantity
        format: book.format // Assuming the book has a 'format' property
      });

      // Add the book to the global cart state
      setCartItems([...cartItems, { ...book, quantity: 1 }]);
      alert('Book added to cart!');
    } catch (err) {
      console.error(err);
      alert('Failed to add book to cart');
    }
  };

  return (
    <div className="book-carousel">
      {books.map((book) => (
        <div key={book.id} className="carousel-item">
          <img src={book.coverImageUrl} alt={book.title} />
          <h3>{book.title}</h3>
          <p><strong>${book.price}</strong></p>
          <button onClick={() => addToCart(book)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
};

export default BookCarousel;
