import React, { useState, useEffect } from 'react';
import { getTopCustomers } from '../api/bookApi';

const TopCustomers = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    getTopCustomers()
      .then((res) => setCustomers(res))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Top 5 Customers</h2>
      <ul>
        {customers.map((customer) => (
          <li key={customer.id}>
            {customer.full_name} - Total Spent: ${customer.total_spent}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopCustomers;
