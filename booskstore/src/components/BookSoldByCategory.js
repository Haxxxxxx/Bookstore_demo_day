import React, { useState, useEffect } from 'react';
import { getBooksSoldByCategory } from '../api/bookApi';

const BooksSoldByCategory = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getBooksSoldByCategory()
      .then((res) => setCategories(res))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Books Sold by Category</h2>
      <ul>
        {categories.map((category) => (
          <li key={category.genre}>
            {category.genre} ({category.sub_genre}) - Total Sold: {category.total_sold}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BooksSoldByCategory;
