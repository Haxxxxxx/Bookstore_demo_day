import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DataSet from './page/DataSet';
import Login from './page/Login';
import HomePage from './page/HomePage';
import Register from './page/Register';
import './App.css';
import Navbar from './components/homepage/Navbar';
import Footer from './components/homepage/Footer';
import BooksPage from './page/Books';
import CartPage from './page/Cart';
import AdminDashboard from './page/AdminDashboard';
import { CartProvider } from './context/CartContext';  // Import the provider

function App() {
  const userId = 1; // Replace with dynamic user ID

  return (
    <CartProvider> {/* Wrap the entire app with CartProvider */}
      <div className="App">
        <Router>
          <Navbar /> {/* Navbar visible on all pages */}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dataset" element={<DataSet />} />  
            <Route path="/" element={<HomePage />} />
            <Route path='/books' element={<BooksPage />} />
            <Route path="/cart" element={<CartPage userId={userId} />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
          <Footer /> {/* Footer visible on all pages */}
        </Router>
      </div>
    </CartProvider>
  );
}

export default App;
