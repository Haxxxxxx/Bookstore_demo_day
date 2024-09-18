import React, { useEffect, useState } from 'react';
import { getBooksWithCategory } from '../api/bookApi';

const BooksWithCategory = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getBooksWithCategory();
      setBooks(data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>Books with Categories</h2>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            {book.title} - {book.genre} / {book.sub_genre}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BooksWithCategory;
