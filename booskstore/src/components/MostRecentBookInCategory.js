import React, { useEffect, useState } from 'react';
import { getMostRecentBookInCategory } from '../api/bookApi';

const MostRecentBookInCategory = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getMostRecentBookInCategory();
      setBooks(data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>Most Recent Books in Each Category</h2>
      <ul>
        {books.map((book, index) => (
          <li key={index}>
            {book.title} ({book.edition_year}) - {book.genre} / {book.sub_genre}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MostRecentBookInCategory;
