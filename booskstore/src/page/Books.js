import React, { useEffect, useState } from 'react';
import { getAllBooks, getBooksWithCategory } from '../api/bookApi'; 

function BooksPage() {
  const [books, setBooks] = useState([]);
  const [booksWithCategory, setBooksWithCategory] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const allBooks = await getAllBooks();
      setBooks(allBooks);

      const booksCategory = await getBooksWithCategory();
      setBooksWithCategory(booksCategory);
    };

    fetchBooks();
  }, []);

  return (
    <div className="books-page">
      <section className="all-books">
        <h2>All Books</h2>
        <ul>
          {books.map((book) => (
            <li key={book.id}>{book.title}</li>
          ))}
        </ul>
      </section>

      <section className="books-by-category">
        <h2>Books by Category</h2>
        <ul>
          {booksWithCategory.map((book) => (
            <li key={book.id}>
              {book.title} - {book.genre}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default BooksPage;
