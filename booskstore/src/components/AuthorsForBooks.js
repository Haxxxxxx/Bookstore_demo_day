import React, { useEffect, useState } from 'react';
import { getAuthorsForBook } from '../api/bookApi';

const AuthorsForBook = ({ bookId }) => {
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    const fetchAuthors = async () => {
      const data = await getAuthorsForBook(bookId);
      setAuthors(data);
    };
    fetchAuthors();
  }, [bookId]);

  return (
    <div>
      <h2>Authors for Book ID: {bookId}</h2>
      <ul>
        {authors.map((author, index) => (
          <li key={index}>
            {author.name} {author.surname}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AuthorsForBook;
