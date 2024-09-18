import React, { useState } from 'react';
import { addBook } from '../api/bookApi';

const AddBook = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    format: '',
    price: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addBook(formData);
      alert('Book added successfully!');
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="title" placeholder="Title" onChange={handleChange} />
      <input type="text" name="description" placeholder="Description" onChange={handleChange} />
      <input type="text" name="format" placeholder="Format" onChange={handleChange} />
      <input type="number" name="price" placeholder="Price" onChange={handleChange} />
      <button type="submit">Add Book</button>
    </form>
  );
};

export default AddBook;
