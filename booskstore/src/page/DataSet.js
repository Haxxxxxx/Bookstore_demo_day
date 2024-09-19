import React from "react";
import BookList from '../components/BookList';
import AddBook from '../components/AddBook';
import BooksWithCategory from '../components/BooksWithCategory';
import AuthorsForBook from '../components/AuthorsForBooks';
import AuthorsMoreThan3Books from '../components/AuthorsMoreThan3Books';
import AveragePriceByCategory from '../components/AveragePriceByCategory';
import MostRecentBookInCategory from '../components/MostRecentBookInCategory';
// Import newly created components for other queries
import CartItems from '../components/CartItems';
import OrdersByUser from '../components/OrderByUser';
import OrderProducts from '../components/OrderProducts';
import CustomersWithWishlists from '../components/CustomersWithWishlists';
import TopCustomers from '../components/TopCustomers';
import BooksSoldByCategory from '../components/BookSoldByCategory';
import MostPopularProduct from '../components/MostPopularProduct';
import InactiveCustomers from '../components/InactiveCustomers';
import TopWishlistBooks from '../components/TopWishlistBooks';
import RevenueByMonth from '../components/RevenueByMonth';
import ProductsNotPurchased6Months from '../components/ProductsNotPurchased6Months.js';
import CustomersFirstPurchase30Days from '../components/CustomersFirstPurchase30Days';
import RunningTotalSales from '../components/RunningTotalSales';
import AddToCart from '../components/AddToCart';
import Cart from '../components/Cart';


function DataSet () {
    const userId = 1; // Example user ID

    return(
        <>
        <header className="app-header">
        <h1>Online Bookstore</h1>
      </header>

      {/* Books Section */}
      <section className="section books-section">
        <h2>Books & Categories</h2>
        <div className="book-actions">
          <AddBook />
        </div>
        <BookList />
        <BooksWithCategory />
        <MostRecentBookInCategory />
        <AveragePriceByCategory />
        <BooksSoldByCategory />
        <MostPopularProduct />
        <ProductsNotPurchased6Months />
        <TopWishlistBooks />
      </section>

      {/* Authors Section */}
      <section className="section authors-section">
        <h2>Authors</h2>
        <AuthorsForBook bookId={1} /> {/* Example for Book ID 1 */}
        <AuthorsMoreThan3Books />
      </section>

      {/* Orders and Cart Section */}
      <section className="section orders-section">
        <h2>Orders & Cart</h2>
        <CartItems userId={userId} /> {/* User's cart items */}
        <OrdersByUser userId={userId} /> {/* Orders placed by user */}
        <OrderProducts orderId={1} /> {/* Products in a specific order */}
        <AddToCart userId={userId} bookId={1} /> {/* Example to add bookId 1 to cart */}
        <Cart userId={userId} /> {/* Display the cart */}
        <RunningTotalSales /> {/* Running total of sales */}
      </section>

      {/* Customers Section */}
      <section className="section customers-section">
        <h2>Customers & Users</h2>
        <CustomersWithWishlists />
        <TopCustomers />
        <InactiveCustomers />
        <CustomersFirstPurchase30Days />
      </section>

      {/* Revenue Section */}
      <section className="section revenue-section">
        <h2>Revenue</h2>
        <RevenueByMonth />
      </section>

      <footer className="app-footer">
        <p>&copy; 2024 Online Bookstore. All rights reserved.</p>
      </footer>
      </>
    )
}
export default DataSet;
