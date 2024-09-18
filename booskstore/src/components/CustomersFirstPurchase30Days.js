import React, { useState, useEffect } from 'react';
import { getCustomersFirstPurchase30Days }from '../api/bookApi';

const CustomersFirstPurchase30Days = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    getCustomersFirstPurchase30Days()
      .then((res) => setCustomers(res))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Customers with First Purchase in Last 30 Days</h2>
      <ul>
        {customers.map((customer) => (
          <li key={customer.id}>
            {customer.full_name} - First Purchase Date: {customer.first_purchase_date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomersFirstPurchase30Days;
