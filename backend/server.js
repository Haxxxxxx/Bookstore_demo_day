const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

// Create express app
const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// MySQL connection
const db = mysql.createConnection({
    host: 'mysql-projet1sql.alwaysdata.net',  // For local, it might be 'localhost'
    user: '376569',  // The username you use to log into phpMyAdmin
    password: 'ZwNm3hJe52dE!wh',  // The password you use to log into phpMyAdmin
    database: 'projet1sql_groupe3',  // The name of your database
    port: '3306'  // Default MySQL port, unless changed
});


db.connect((err) => {
    if (err) {
        console.error('MySQL connection failed:', err.message);  // Detailed error message
    } else {
        console.log('Connected to MySQL database');
    }
});

// Endpoints

// Get all books
app.get('/api/books', (req, res) => {
    db.query('SELECT * FROM book', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Retrieve all products (books) with their associated category
app.get('/api/books-with-category', (req, res) => {
    const query = `
      SELECT book.id, book.title, category.genre AS genre, category.sub_genre AS sub_genre
      FROM book
      JOIN category ON book.category_id = category.id;
    `;

    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Get all authors for a particular book
app.get('/api/book/:id/authors', (req, res) => {
    const { id } = req.params;

    const query = `
      SELECT author.name, author.surname
      FROM author
      JOIN book ON book.author_id = author.id
      WHERE book.id = ?;
    `;

    db.query(query, [id], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Find authors who have written more than 3 books in the store
app.get('/api/authors/more-than-3-books', (req, res) => {
    const query = `
      SELECT author.name, author.surname, COUNT(book.id) AS book_count
      FROM author
      JOIN book ON book.author_id = author.id
      GROUP BY author.id
      HAVING COUNT(book.id) > 3;
    `;

    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});


// Get a single book by ID
app.get('/api/books/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM book WHERE id = ?', [id], (err, results) => {
        if (err) throw err;
        res.json(results[0]);
    });
});

// Add a new book
app.post('/api/books', (req, res) => {
    const { title, description, format, price, author_id, category_id } = req.body;
    db.query('INSERT INTO book (title, description, format, price, author_id, category_id) VALUES (?, ?, ?, ?, ?, ?)', [title, description, format, price, author_id, category_id], (err, results) => {
        if (err) throw err;
        res.json({ message: 'Book added successfully', id: results.insertId });
    });
});

// Update a book by ID
app.put('/api/books/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, format, price } = req.body;
    db.query('UPDATE book SET title = ?, description = ?, format = ?, price = ? WHERE id = ?', [title, description, format, price, id], (err, results) => {
        if (err) throw err;
        res.json({ message: 'Book updated successfully' });
    });
});

// Calculate the average price of books in each category
app.get('/api/average-price-by-category', (req, res) => {
    const query = `
      SELECT category.genre, category.sub_genre, AVG(book.price) AS average_price
      FROM book
      JOIN category ON book.category_id = category.id
      GROUP BY category.genre, category.sub_genre;
    `;

    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Find the most recently added book in each category
app.get('/api/most-recent-book-in-category', (req, res) => {
    const query = `
      SELECT book.title, book.edition_year, category.genre, category.sub_genre
      FROM book
      JOIN category ON book.category_id = category.id
      WHERE book.edition_year = (
        SELECT MAX(b.edition_year)
        FROM book b
        WHERE b.category_id = book.category_id
      );
    `;

    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});


// Delete a book by ID
app.delete('/api/books/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM book WHERE id = ?', [id], (err, results) => {
        if (err) throw err;
        res.json({ message: 'Book deleted successfully' });
    });
});

// Add a book to the cart (create pending order if it doesn't exist)
app.post('/api/cart/:userId', (req, res) => {
    const { userId } = req.params;
    const { bookId, quantity, format } = req.body;

    // Check if a pending order already exists
    db.query('SELECT id FROM `order` WHERE user_id = ? AND state = "pending"', [userId], (err, results) => {
        if (err) throw err;

        let orderId;
        if (results.length === 0) {
            // If no pending order exists, create one
            db.query('INSERT INTO `order` (user_id, total_price, state, created_at) VALUES (?, 0, "pending", NOW())', [userId], (err, results) => {
                if (err) throw err;
                orderId = results.insertId;
                addOrderItem(orderId);
            });
        } else {
            // Use the existing pending order
            orderId = results[0].id;
            addOrderItem(orderId);
        }

        function addOrderItem(orderId) {
            db.query('INSERT INTO order_item (order_id, book_id, quantity, format) VALUES (?, ?, ?, ?)', [orderId, bookId, quantity, format], (err, results) => {
                if (err) throw err;
                res.json({ message: 'Item added to cart', orderId });
            });
        }
    });
});

// Get items in the cart for a user
app.get('/api/cart/:userId', (req, res) => {
    const { userId } = req.params;
    
    const query = `
        SELECT book.id, book.title, order_item.quantity, order_item.format
        FROM book
        JOIN order_item ON book.id = order_item.book_id
        JOIN \`order\` ON order_item.order_id = \`order\`.id
        WHERE \`order\`.user_id = ? AND \`order\`.state = "pending";
    `;
    
    db.query(query, [userId], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Update cart item quantity
app.put('/api/cart/:userId/:bookId', (req, res) => {
    const { userId, bookId } = req.params;
    const { quantity } = req.body;

    const query = `
        UPDATE order_item 
        JOIN \`order\` ON order_item.order_id = \`order\`.id
        SET order_item.quantity = ?
        WHERE \`order\`.user_id = ? AND order_item.book_id = ? AND \`order\`.state = "pending";
    `;

    db.query(query, [quantity, userId, bookId], (err, results) => {
        if (err) throw err;
        res.json({ message: 'Cart item updated' });
    });
});

// Confirm order (update from pending to confirmed)
app.put('/api/cart/confirm/:userId', (req, res) => {
    const { userId } = req.params;

    const query = `
        UPDATE \`order\`
        SET state = "confirmed"
        WHERE user_id = ? AND state = "pending";
    `;

    db.query(query, [userId], (err, results) => {
        if (err) throw err;
        res.json({ message: 'Order confirmed' });
    });
});
  // Get all orders placed by a customer by user ID
app.get('/api/orders/:userId', (req, res) => {
    const { userId } = req.params;
  
    const query = `
      SELECT order.id, order.total_price, order.created_at
      FROM \`order\`
      WHERE order.user_id = ?;
    `;
    
    db.query(query, [userId], (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  });
  
  // Get all products in an order by order ID
app.get('/api/orders/:orderId/products', (req, res) => {
    const { orderId } = req.params;
  
    const query = `
      SELECT book.id, book.title, order_item.quantity
      FROM order_item
      JOIN book ON book.id = order_item.book_id
      WHERE order_item.order_id = ?;
    `;
    
    db.query(query, [orderId], (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  });

// Get all customers with their wishlists
app.get('/api/customers-with-wishlists', (req, res) => {
    const query = `
      SELECT user.id, user.full_name, book.title AS wishlist_item
      FROM user
      JOIN wishlist ON user.id = wishlist.user_id
      JOIN wishlist_item ON wishlist.wishlist_item_id = wishlist_item.id
      JOIN book ON wishlist_item.book_id = book.id;
    `;
    
    db.query(query, (err, results) => {
      if (err) throw err;
      res.json(results);
    });
});

  // Get top 5 customers who have spent the most money
app.get('/api/top-customers', (req, res) => {
    const query = `
      SELECT user.id, user.full_name, SUM(order.total_price) AS total_spent
      FROM user
      JOIN \`order\` ON user.id = order.user_id
      GROUP BY user.id
      ORDER BY total_spent DESC
      LIMIT 5;
    `;
    
    db.query(query, (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  });

  // Get total quantity of books sold by category
app.get('/api/books-sold-by-category', (req, res) => {
    const query = `
      SELECT category.genre, category.sub_genre, SUM(order_item.quantity) AS total_sold
      FROM book
      JOIN category ON book.category_id = category.id
      JOIN order_item ON book.id = order_item.book_id
      GROUP BY category.genre, category.sub_genre;
    `;
    
    db.query(query, (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  });

  // Get the most popular product in terms of the number of times it has been added to customers' carts
app.get('/api/most-popular-product', (req, res) => {
    const query = `
      SELECT book.title, COUNT(order_item.book_id) AS times_added
      FROM book
      JOIN order_item ON book.id = order_item.book_id
      JOIN \`order\` ON order_item.order_id = \`order\`.id
      WHERE \`order\`.state IN ('pending', 'confirmed')
      GROUP BY order_item.book_id
      ORDER BY times_added DESC
      LIMIT 1;
    `;
    
    db.query(query, (err, results) => {
      if (err) throw err;
      res.json(results[0]);
    });
});

  app.get('/api/inactive-customers', (req, res) => {
    const query = `
      SELECT user.id, user.full_name
      FROM user
      LEFT JOIN \`order\` ON user.id = order.user_id
      WHERE order.created_at < NOW() - INTERVAL 6 MONTH OR order.id IS NULL;
    `;
    
    db.query(query, (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  });
// List the top 3 books that appear in the most wishlists
app.get('/api/top-wishlist-books', (req, res) => {
    const query = `
      SELECT book.id, book.title, COUNT(wishlist_item.book_id) AS wishlist_count
      FROM book
      JOIN wishlist_item ON book.id = wishlist_item.book_id
      GROUP BY wishlist_item.book_id
      ORDER BY wishlist_count DESC
      LIMIT 3;
    `;
    
    db.query(query, (err, results) => {
      if (err) throw err;
      res.json(results);
    });
});

  //List the top 3 books that appear in the most wishlists
  app.get('/api/revenue-by-month', (req, res) => {
    const query = `
      SELECT DATE_FORMAT(order.created_at, '%Y-%m') AS month, SUM(order.total_price) AS total_revenue
      FROM \`order\`
      GROUP BY month
      ORDER BY month;
    `;
    
    db.query(query, (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  });
  //Calculate the total revenue for each month
  app.get('/api/revenue-by-month', (req, res) => {
    const query = `
      SELECT DATE_FORMAT(order.created_at, '%Y-%m') AS month, SUM(order.total_price) AS total_revenue
      FROM \`order\`
      GROUP BY month
      ORDER BY month;
    `;
    
    db.query(query, (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  });
  //Retrieve the total sales for each product and display only products that have been sold more than 100 times
  app.get('/api/top-selling-products', (req, res) => {
    const query = `
      SELECT book.id, book.title, SUM(order_item.quantity) AS total_sold
      FROM book
      JOIN order_item ON book.id = order_item.book_id
      GROUP BY book.id
      HAVING total_sold > 100;
    `;
    
    db.query(query, (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  });
  // Find the customers who have purchased books from every category in the store
  app.get('/api/customers-all-categories', (req, res) => {
    const query = `
      SELECT user.id, user.full_name
      FROM user
      JOIN \`order\` ON user.id = order.user_id
      JOIN order_item ON order.id = order_item.order_id
      JOIN book ON order_item.book_id = book.id
      JOIN category ON book.category_id = category.id
      GROUP BY user.id
      HAVING COUNT(DISTINCT category.id) = (SELECT COUNT(*) FROM category);
    `;
    
    db.query(query, (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  });
  //Find the longest-time customers (customer with the earliest signup)
  app.get('/api/longest-time-customers', (req, res) => {
    const query = `
      SELECT user.id, user.full_name, MIN(user.created_at) AS signup_date
      FROM user
      GROUP BY user.id
      ORDER BY signup_date ASC
      LIMIT 1;
    `;
    
    db.query(query, (err, results) => {
      if (err) throw err;
      res.json(results[0]);
    });
  });
  //Get the total quantity of products ordered by each customer
  app.get('/api/total-quantity-by-customer', (req, res) => {
    const query = `
      SELECT user.id, user.full_name, SUM(order_item.quantity) AS total_quantity
      FROM user
      JOIN \`order\` ON user.id = order.user_id
      JOIN order_item ON order.id = order_item.order_id
      GROUP BY user.id;
    `;
    
    db.query(query, (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  });
//Find the average price of products in orders with more than 5 items
  app.get('/api/average-price-orders-more-than-5', (req, res) => {
    const query = `
      SELECT AVG(book.price) AS average_price
      FROM book
      JOIN order_item ON book.id = order_item.book_id
      GROUP BY order_item.order_id
      HAVING COUNT(order_item.id) > 5;
    `;
    
    db.query(query, (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  });
  //Find the category with the most books sold
  app.get('/api/category-most-books-sold', (req, res) => {
    const query = `
      SELECT category.genre, category.sub_genre, SUM(order_item.quantity) AS total_sold
      FROM book
      JOIN category ON book.category_id = category.id
      JOIN order_item ON book.id = order_item.book_id
      GROUP BY category.id
      ORDER BY total_sold DESC
      LIMIT 1;
    `;
    
    db.query(query, (err, results) => {
      if (err) throw err;
      res.json(results[0]);
    });
  });
  //Retrieve all customers who have purchased all products in a specific category
  app.get('/api/customers-all-products-category/:categoryId', (req, res) => {
    const { categoryId } = req.params;
  
    const query = `
      SELECT user.id, user.full_name
      FROM user
      JOIN \`order\` ON user.id = order.user_id
      JOIN order_item ON order.id = order_item.order_id
      JOIN book ON order_item.book_id = book.id
      WHERE book.category_id = ?
      GROUP BY user.id
      HAVING COUNT(DISTINCT book.id) = (SELECT COUNT(*) FROM book WHERE category_id = ?);
    `;
    
    db.query(query, [categoryId, categoryId], (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  });
//Get the most expensive product purchased in each order
  app.get('/api/most-expensive-product-per-order', (req, res) => {
    const query = `
      SELECT order.id, book.title, MAX(book.price) AS max_price
      FROM \`order\`
      JOIN order_item ON order.id = order_item.order_id
      JOIN book ON order_item.book_id = book.id
      GROUP BY order.id;
    `;
    
    db.query(query, (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  });
//Calculate the running total of sales revenue over time
  app.get('/api/running-total-sales', (req, res) => {
    const query = `
      SELECT created_at, SUM(total_price) OVER (ORDER BY created_at ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total
      FROM \`order\`
      ORDER BY created_at;
    `;
    
    db.query(query, (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  });
//List customers who made their first purchase in the last 30 days
  app.get('/api/customers-first-purchase-30-days', (req, res) => {
    const query = `
      SELECT user.id, user.full_name, MIN(order.created_at) AS first_purchase_date
      FROM user
      JOIN \`order\` ON user.id = order.user_id
      GROUP BY user.id
      HAVING first_purchase_date >= NOW() - INTERVAL 30 DAY;
    `;
    
    db.query(query, (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  });
//Get products not purchased in the last 6 months
  app.get('/api/products-not-purchased-6-months', (req, res) => {
    const query = `
      SELECT book.id, book.title
      FROM book
      LEFT JOIN order_item ON book.id = order_item.book_id
      LEFT JOIN \`order\` ON order_item.order_id = order.id
      WHERE order.created_at < NOW() - INTERVAL 6 MONTH OR order_item.book_id IS NULL;
    `;
    
    db.query(query, (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  });
  
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
