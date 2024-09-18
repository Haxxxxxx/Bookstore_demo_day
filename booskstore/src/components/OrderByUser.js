import React, { useState, useEffect } from 'react';
import { getOrdersByUserId } from '../api/bookApi';

const OrdersByUser = ({ userId }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrdersByUserId(userId)
      .then((res) => setOrders(res))
      .catch((err) => console.error(err));
  }, [userId]);

  return (
    <div>
      <h2>Orders by User</h2>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            Order ID: {order.id} - Total Price: ${order.total_price} - Date: {order.created_at}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrdersByUser;
