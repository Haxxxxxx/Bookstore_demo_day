import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../components/homepage/Homepage.css'; // Assuming you want to style the page

// Import components like Navbar, BookCarousel, and others
import BookCarousel from '../components/homepage/BookCarousel';
import TestimonialsCarousel from '../components/homepage/TestimonialsCarousel';
import BookList from '../components/homepage/BookList';
import MostPopularProduct from '../components/MostPopularProduct';

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [filter, setFilter] = useState('');
  const [user, setUser] = useState(null);

  // Fetch all books from your API on component mount
  useEffect(() => {
    const fetchBooks = async () => {
      const res = await axios.get('http://localhost:5000/api/books');
      setBooks(res.data);
      setFilteredBooks(res.data);
    };
    fetchBooks();

    // Check if user is logged in (exists in localStorage)
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  // Handle filtering books by genre, category, etc.
  const handleFilterChange = (e) => {
    const filterValue = e.target.value;
    setFilter(filterValue);

    if (filterValue === '') {
      setFilteredBooks(books); // Show all books when no filter
    } else {
      const filtered = books.filter(book => book.genre.includes(filterValue));
      setFilteredBooks(filtered);
    }
  };

  return (
    <div className="home-page">
      {/* Header with focus on best-selling book */}
      <header className="header-section">
        <div className="header-content">
          {/* Conditionally show welcome message with user's name */}
          {user ? (
            <h1>Welcome, {user.full_name}!</h1>
          ) : (
            <h1>Welcome to Our Online Bookstore</h1>
          )}
          <p>Discover the most popular book</p>
          <MostPopularProduct />
          <button>Buy Now</button>
        </div>
        <div className="header-image">
          <img src="path/to/most-sold-book.jpg" alt="Best Seller" />
        </div>
      </header>

      {/* Books Carousel (Most Sold Books) */}
      <section className="book-carousel-section">
        <h2>Most Sold Books</h2>
        <BookCarousel books={books} />
      </section>

      {/* Testimonials Carousel */}
      <section className="testimonials-section">
        <h2>What Our Customers Say</h2>
        <TestimonialsCarousel />
      </section>

      {/* Book Filter and List */}
      <section className="book-list-section">
        <h2>Browse Our Collection</h2>

        {/* Filter */}
        <div className="book-filter">
          <label htmlFor="genre-filter">Filter by Genre:</label>
          <select id="genre-filter" value={filter} onChange={handleFilterChange}>
            <option value="">All Genres</option>
            <option value="Fiction">Fiction</option>
            <option value="Non-Fiction">Non-Fiction</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Romance">Romance</option>
            {/* Add more genre options as needed */}
          </select>
        </div>

        {/* Book List */}
        <BookList books={filteredBooks} />
      </section>
    </div>
  );
};

export default HomePage;
