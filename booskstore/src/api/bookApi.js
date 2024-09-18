import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Fetch all books
export const getAllBooks = async () => {
    const response = await axios.get(`${API_URL}/books`);
    return response.data;
};

// Fetch a single book by ID
export const getBookById = async (id) => {
    const response = await axios.get(`${API_URL}/books/${id}`);
    return response.data;
};

// Add a new book
export const addBook = async (bookData) => {
    const response = await axios.post(`${API_URL}/books`, bookData);
    return response.data;
};

// Update a book
export const updateBook = async (id, bookData) => {
    const response = await axios.put(`${API_URL}/books/${id}`, bookData);
    return response.data;
};

// Delete a book
export const deleteBook = async (id) => {
    const response = await axios.delete(`${API_URL}/books/${id}`);
    return response.data;
};

// Fetch all books with their associated categories
export const getBooksWithCategory = async () => {
    const response = await axios.get(`${API_URL}/books-with-category`);
    return response.data;
};

// Fetch authors for a specific book
export const getAuthorsForBook = async (bookId) => {
    const response = await axios.get(`${API_URL}/book/${bookId}/authors`);
    return response.data;
};

// Fetch authors who have written more than 3 books
export const getAuthorsMoreThan3Books = async () => {
    const response = await axios.get(`${API_URL}/authors/more-than-3-books`);
    return response.data;
};

// Fetch average book price by category
export const getAveragePriceByCategory = async () => {
    const response = await axios.get(`${API_URL}/average-price-by-category`);
    return response.data;
};

// Fetch the most recent book in each category
export const getMostRecentBookInCategory = async () => {
    const response = await axios.get(`${API_URL}/most-recent-book-in-category`);
    return response.data;
};

// Fetch all products in a customer’s cart by user ID
export const getCartItemsByUserId = async (userId) => {
    const response = await axios.get(`${API_URL}/cart/${userId}`);
    return response.data;
};

// Add item to cart (create pending order if not exist)
export const addToCart = async (userId, bookId, quantity, format) => {
    const response = await axios.post(`${API_URL}/cart/${userId}`, { bookId, quantity, format });
    return response.data;
};

// Fetch cart items for a user
export const getCartItems = async (userId) => {
    const response = await axios.get(`${API_URL}/cart/${userId}`);
    return response.data;
};

// Update cart item quantity
export const updateCartItem = async (userId, bookId, quantity) => {
    const response = await axios.put(`${API_URL}/cart/${userId}/${bookId}`, { quantity });
    return response.data;
};

// Confirm cart (turn into an order)
export const confirmOrder = async (userId) => {
    const response = await axios.put(`${API_URL}/cart/confirm/${userId}`);
    return response.data;
};

// Fetch all orders placed by a customer by user ID
export const getOrdersByUserId = async (userId) => {
    const response = await axios.get(`${API_URL}/orders/${userId}`);
    return response.data;
};

// Fetch all products in an order by order ID
export const getOrderProducts = async (orderId) => {
    const response = await axios.get(`${API_URL}/orders/${orderId}/products`);
    return response.data;
};

// Fetch all customers with their wishlists
export const getCustomersWithWishlists = async () => {
    const response = await axios.get(`${API_URL}/customers-with-wishlists`);
    return response.data;
};

// Fetch the top 5 customers who have spent the most money
export const getTopCustomers = async () => {
    const response = await axios.get(`${API_URL}/top-customers`);
    return response.data;
};

// Fetch total quantity of books sold by category
export const getBooksSoldByCategory = async () => {
    const response = await axios.get(`${API_URL}/books-sold-by-category`);
    return response.data;
};

// Fetch the most popular product in terms of times added to carts
export const getMostPopularProduct = async () => {
    const response = await axios.get(`${API_URL}/most-popular-product`);
    return response.data;
};

// Fetch inactive customers (no orders in last 6 months)
export const getInactiveCustomers = async () => {
    const response = await axios.get(`${API_URL}/inactive-customers`);
    return response.data;
};

// Fetch top 3 books that appear in most wishlists
export const getTopWishlistBooks = async () => {
    const response = await axios.get(`${API_URL}/top-wishlist-books`);
    return response.data;
};

// Fetch total revenue for each month
export const getRevenueByMonth = async () => {
    const response = await axios.get(`${API_URL}/revenue-by-month`);
    return response.data;
};

// Fetch products not purchased in the last 6 months
export const getProductsNotPurchased6Months = async () => {
    const response = await axios.get(`${API_URL}/products-not-purchased-6-months`);
    return response.data;
};

// Fetch customers who made their first purchase in the last 30 days
export const getCustomersFirstPurchase30Days = async () => {
    const response = await axios.get(`${API_URL}/customers-first-purchase-30-days`);
    return response.data;
};

// Fetch running total of sales revenue over time
export const getRunningTotalSales = async () => {
    const response = await axios.get(`${API_URL}/running-total-sales`);
    return response.data;
};
