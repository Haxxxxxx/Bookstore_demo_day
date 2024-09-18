import React, { useState, useEffect } from 'react';
import { getRunningTotalSales } from '../api/bookApi';

const RunningTotalSales = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    getRunningTotalSales()
      .then((res) => setSales(res))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Running Total of Sales</h2>
      <ul>
        {sales.map((sale, index) => (
          <li key={index}>
            Date: {sale.created_at} - Running Total: ${sale.running_total}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RunningTotalSales;
