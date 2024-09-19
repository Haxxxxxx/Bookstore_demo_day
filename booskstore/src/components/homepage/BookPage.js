// src/page/BookPage.js
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBookById } from '../api/bookApi';
import { CartContext } from '../context/CartContext';

const BookPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchBook = async () => {
      const bookData = await getBookById(id);
      setBook(bookData);
    };

    fetchBook();
  }, [id]);

  if (!book) return <p>Loading...</p>;

  return (
    <div className="book-page">
      <h1>{book.title}</h1>
      <img src={book.coverImageUrl} alt={book.title} />
      <p>{book.description}</p>
      <p><strong>${book.price}</strong></p>
      <button onClick={() => addToCart(book)}>Add to Cart</button>
    </div>
  );
};

export default BookPage;
