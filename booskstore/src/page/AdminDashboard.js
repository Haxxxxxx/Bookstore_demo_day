import React, { useEffect, useState } from 'react';
import { getTopCustomers, getRevenueByMonth } from '../api/bookApi'; 

function AdminDashboard() {
  const [topCustomers, setTopCustomers] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const topCustomersData = await getTopCustomers();
      setTopCustomers(topCustomersData);

      const revenueData = await getRevenueByMonth();
      setMonthlyRevenue(revenueData);
    };

    fetchData();
  }, []);

  return (
    <div className="admin-dashboard">
      <section className="top-customers">
        <h2>Top 5 Customers</h2>
        <ul>
          {topCustomers.map((customer) => (
            <li key={customer.id}>{customer.full_name} - ${customer.total_spent}</li>
          ))}
        </ul>
      </section>

      <section className="monthly-revenue">
        <h2>Monthly Revenue</h2>
        <ul>
          {monthlyRevenue.map((revenue) => (
            <li key={revenue.month}>{revenue.month}: ${revenue.total_revenue}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default AdminDashboard;
