import React, { useEffect, useState } from 'react';
import { getAuthorsMoreThan3Books } from '../api/bookApi';

const AuthorsMoreThan3Books = () => {
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAuthorsMoreThan3Books();
      setAuthors(data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>Authors with More Than 3 Books</h2>
      <ul>
        {authors.map((author, index) => (
          <li key={index}>
            {author.name} {author.surname} - {author.book_count} books
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AuthorsMoreThan3Books;
