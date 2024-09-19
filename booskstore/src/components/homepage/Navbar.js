import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Navbar.css'; // Create this file for styling

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Bookstore</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/books">Books</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/cart">Cart</Link></li>
        <li><Link to="/admin">Admin</Link></li>

      </ul>
    </nav>
  );
};

export default Navbar;
