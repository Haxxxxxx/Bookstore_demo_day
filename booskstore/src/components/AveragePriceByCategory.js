import React, { useEffect, useState } from 'react';
import { getAveragePriceByCategory } from '../api/bookApi';

const AveragePriceByCategory = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAveragePriceByCategory();
      setCategories(data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>Average Price by Category</h2>
      <ul>
        {categories.map((category, index) => (
          <li key={index}>
            {category.genre} / {category.sub_genre} - $
            {/* Check if average_price is a valid number before formatting */}
            {category.average_price ? parseFloat(category.average_price).toFixed(2) : 'N/A'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AveragePriceByCategory;
