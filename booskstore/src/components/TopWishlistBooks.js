import React, { useState, useEffect } from 'react';
import { getTopWishlistBooks }from '../api/bookApi';

const TopWishlistBooks = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    getTopWishlistBooks()
      .then((res) => setBooks(res))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Top Wishlist Books</h2>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            {book.title} - Added to {book.wishlist_count} wishlists
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopWishlistBooks;
