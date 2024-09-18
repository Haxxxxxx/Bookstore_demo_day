import React, { useState, useEffect } from 'react';
import { getRevenueByMonth } from '../api/bookApi';

const RevenueByMonth = () => {
  const [revenue, setRevenue] = useState([]);

  useEffect(() => {
    getRevenueByMonth()
      .then((res) => setRevenue(res))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Revenue by Month</h2>
      <ul>
        {revenue.map((rev) => (
          <li key={rev.month}>
            {rev.month} - ${rev.total_revenue}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RevenueByMonth;
