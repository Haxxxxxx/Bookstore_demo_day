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
// Simplified Registration (No bcrypt, no hashed password)
app.post('/api/register', (req, res) => {
  const { email, password, full_name, phone, payment_id = null, role_id = 2 } = req.body; // Set payment_id to null by default

  const userQuery = 'INSERT INTO user (email, password, full_name, phone, payment_id, created_at) VALUES (?, ?, ?, ?, ?, CURDATE())';
  db.query(userQuery, [email, password, full_name, phone, payment_id], (err, userResult) => {
    if (err) {
      console.error('Error registering user:', err);
      return res.status(500).json({ message: 'Error registering user', error: err });
    }

    const userId = userResult.insertId;

    const roleQuery = 'INSERT INTO user_role (user_id, role_id) VALUES (?, ?)';
    db.query(roleQuery, [userId, role_id], (err, roleResult) => {
      if (err) {
        console.error('Error assigning role:', err);
        return res.status(500).json({ message: 'Error assigning role', error: err });
      }

      res.json({
        message: 'User registered successfully',
        user: {
          id: userId,
          email,
          full_name,
          phone,
        },
      });
    });
  });
});


// Login endpoint without security
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  // Query to find user by email
  const query = 'SELECT * FROM user WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      const user = results[0];

      // Compare plain text password
      if (user.password === password) {
        // Success, send back user details (no JWT, no hashed passwords)
        res.json({
          message: 'Login successful',
          user: {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            role: 'user', // For simplicity, we'll just assign the role as 'user'
          }
        });
      } else {
        // Incorrect password
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      // User not found
      res.status(404).json({ message: 'User not found' });
    }
  });
});


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
// Example: Get all items in a user's pending order (cart)
app.get('/api/cart/:userId', (req, res) => {
    const { userId } = req.params;

    const query = `
      SELECT book.id, book.title, book.price, order_item.quantity, order_item.format, 
             (book.price * order_item.quantity) AS total_item_price
      FROM book
      JOIN order_item ON book.id = order_item.book_id
      JOIN \`order\` ON \`order\`.id = (SELECT o.id FROM \`order\` o WHERE o.user_id = ? AND o.state = 'pending' LIMIT 1)
      WHERE order_item.book_id = book.id;
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        res.json(results);
    });
});


// Add an item to the user's cart
app.post('/api/cart/:userId', (req, res) => {
  const { userId } = req.params;
  const { bookId, quantity, format } = req.body;

  // Find the user's pending order
  const findPendingOrder = `
    SELECT id, order_item_id FROM \`order\` WHERE user_id = ? AND state = 'pending' LIMIT 1;
  `;

  db.query(findPendingOrder, [userId], (err, results) => {
    if (err) {
      console.error('Error finding pending order:', err);
      return res.status(500).json({ error: 'Database query error' });
    }

    let orderId, orderItemId;

    if (results.length === 0) {
      // If no pending order, create a new order
      const createOrder = `
        INSERT INTO \`order\` (user_id, total_price, state) VALUES (?, 0, 'pending');
      `;
      db.query(createOrder, [userId], (err, orderResult) => {
        if (err) {
          console.error('Error creating new order:', err);
          return res.status(500).json({ error: 'Error creating new order' });
        }

        orderId = orderResult.insertId;
        addItemToOrder(orderId, null); // Call the function to add item to the newly created order
      });
    } else {
      orderId = results[0].id;
      orderItemId = results[0].order_item_id;
      addItemToOrder(orderId, orderItemId); // Add item to the existing order
    }
  });

  // Function to add an item to the order
  const addItemToOrder = (orderId, orderItemId) => {
    if (orderItemId) {
      // If there's an existing order item, update its quantity
      const updateOrderItem = `
        UPDATE order_item 
        SET quantity = quantity + ?
        WHERE id = ? AND book_id = ?;
      `;
      db.query(updateOrderItem, [quantity, orderItemId, bookId], (err) => {
        if (err) {
          console.error('Error updating order item:', err);
          return res.status(500).json({ error: 'Error updating order item' });
        }
        res.json({ message: 'Item updated in cart' });
      });
    } else {
      // Insert a new order item
      const insertOrderItem = `
        INSERT INTO order_item (quantity, format, book_id)
        VALUES (?, ?, ?);
      `;
      db.query(insertOrderItem, [quantity, format, bookId], (err, result) => {
        if (err) {
          console.error('Error inserting order item:', err);
          return res.status(500).json({ error: 'Error inserting order item' });
        }

        const newOrderItemId = result.insertId;

        // Update the order with the new order_item_id
        const updateOrder = `
          UPDATE \`order\`
          SET order_item_id = ?
          WHERE id = ?;
        `;
        db.query(updateOrder, [newOrderItemId, orderId], (err) => {
          if (err) {
            console.error('Error updating order:', err);
            return res.status(500).json({ error: 'Error updating order with new order_item_id' });
          }
          res.json({ message: 'Item added to cart' });
        });
      });
    }
  };
});




// Get all items in a user's cart with total price
app.get('/api/cart/:userId', (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT book.id, book.title, book.price, order_item.quantity, order_item.format, 
           (book.price * order_item.quantity) AS total_item_price
    FROM book
    JOIN order_item ON book.id = order_item.book_id
    JOIN \`order\` ON order_item.order_id = \`order\`.id
    WHERE \`order\`.user_id = ? AND \`order\`.state = "pending";
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching cart items:', err);
      return res.status(500).json({ error: 'Database query error' });
    }

    const totalCartPrice = results.reduce((acc, item) => acc + item.total_item_price, 0);
    res.json({ items: results, totalPrice: totalCartPrice });
  });
});


// Update cart item quantity (fixed query)
app.put('/api/cart/:userId/:bookId', (req, res) => {
  const { userId, bookId } = req.params;
  const { quantity } = req.body;

  if (quantity <= 0) {
    const deleteQuery = `
      DELETE order_item 
      FROM order_item
      JOIN \`order\` ON order_item.order_id = \`order\`.id 
      WHERE order_item.book_id = ? AND \`order\`.user_id = ? AND \`order\`.state = "pending";
    `;
    
    db.query(deleteQuery, [bookId, userId], (err) => {
      if (err) {
        console.error('Error deleting cart item:', err);
        return res.status(500).json({ error: 'Database query error' });
      }
      res.json({ message: 'Item removed from cart' });
    });
  } else {
    const updateQuery = `
      UPDATE order_item 
      JOIN \`order\` ON \`order\`.id = order_item.order_id
      SET order_item.quantity = ?
      WHERE order_item.book_id = ? AND \`order\`.user_id = ? AND \`order\`.state = "pending";
    `;
  
    db.query(updateQuery, [quantity, bookId, userId], (err) => {
      if (err) {
        console.error('Error updating cart item:', err);
        return res.status(500).json({ error: 'Database query error' });
      }
      res.json({ message: 'Cart item updated successfully' });
    });
  }
});

// Confirm order (update from pending to confirmed and add payment)
app.put('/api/cart/confirm/:userId', (req, res) => {
  const { userId } = req.params;
  const { paymentMethod } = req.body;

  if (!paymentMethod) {
    return res.status(400).json({ message: 'Payment method is required' });
  }

  // Confirm the order by setting its state to 'confirmed'
  const updateOrderState = `
    UPDATE \`order\`
    SET state = "confirmed"
    WHERE user_id = ? AND state = "pending";
  `;

  db.query(updateOrderState, [userId], (err) => {
    if (err) {
      console.error('Error confirming order:', err);
      return res.status(500).json({ error: 'Database query error' });
    }

    // Once the order is confirmed, add a payment entry
    const createPayment = `
      INSERT INTO payment (payment_method, payment_status, payment_date, amount, order_id, user_id)
      SELECT ?, "Completed", NOW(), total_price, id, user_id
      FROM \`order\`
      WHERE user_id = ? AND state = "confirmed";
    `;

    db.query(createPayment, [paymentMethod, userId], (err) => {
      if (err) {
        console.error('Error creating payment entry:', err);
        return res.status(500).json({ error: 'Database query error' });
      }
      res.json({ message: 'Order confirmed and payment recorded' });
    });
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
    GROUP BY order_item.book_id
    ORDER BY times_added DESC
    LIMIT 1;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Database query error' });
    }
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
