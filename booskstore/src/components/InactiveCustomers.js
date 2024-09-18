import React, { useState, useEffect } from 'react';
import { getInactiveCustomers }from '../api/bookApi';

const InactiveCustomers = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    getInactiveCustomers()
      .then((res) => setCustomers(res))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Inactive Customers</h2>
      <ul>
        {customers.map((customer) => (
          <li key={customer.id}>
            {customer.full_name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InactiveCustomers;
