import React from 'react';
import '../css/BookCarousel.css';

const BookCarousel = ({ books }) => {
  return (
    <div className="book-carousel">
      {books.map(book => (
        <div key={book.id} className="carousel-item">
          <img src={book.coverImageUrl} alt={book.title} />
          <h3>{book.title}</h3>
        </div>
      ))}
    </div>
  );
};

export default BookCarousel;
