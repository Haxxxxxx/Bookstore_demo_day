import React, { useState, useEffect } from 'react';
import { getCustomersWithWishlists }from '../api/bookApi';

const CustomersWithWishlists = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    getCustomersWithWishlists()
      .then((res) => setCustomers(res))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Customers with Wishlists</h2>
      <ul>
        {customers.map((customer) => (
          <li key={customer.id}>
            {customer.full_name} - Wishlist Item: {customer.wishlist_item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomersWithWishlists;
