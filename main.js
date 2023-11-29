const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Dictionary to store API keys (replace with a secure storage mechanism in production)
const apiKeys = {
  "your_api_key": "your_username",
};

const requireApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (apiKey && apiKeys[apiKey]) {
    // You may perform additional checks, logging, or associate the API key with a user here
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Apply API key authentication to all routes
app.use(requireApiKey);

// Mock data for books
const books = [
  { id: 1, title: 'Book 1', author: 'Author A' },
  { id: 2, title: 'Book 2', author: 'Author B' },
  { id: 3, title: 'Book 3', author: 'Author C' },
];

// Example of a route that doesn't require an API key
app.get('/public', (req, res) => {
  res.send('This is a public route!');
});

app.get('/books', (req, res) => {
  // Get query parameters
  const titleFilter = req.query.title;
  const authorFilter = req.query.author;

  // Get path parameter
  const bookId = req.query.book_id;

  if (bookId) {
    // If bookId is provided, return the book with the specified ID
    const book = books.find((b) => b.id === parseInt(bookId));
    if (book) {
      res.json(book);
    } else {
      res.status(404).send('Book not found');
    }
  } else {
    // Filter books based on query parameters
    let filteredBooks = books;
    if (titleFilter) {
      filteredBooks = filteredBooks.filter((b) => b.title.toLowerCase().includes(titleFilter.toLowerCase()));
    }
    if (authorFilter) {
      filteredBooks = filteredBooks.filter((b) => b.author.toLowerCase().includes(authorFilter.toLowerCase()));
    }

    res.json(filteredBooks);
  }
});

app.get('/books/:book_id', (req, res) => {
  const bookId = parseInt(req.params.book_id);

  // Find the book with the specified ID
  const book = books.find((b) => b.id === bookId);

  // Get query parameters
  const titleFilter = req.query.title;
  const authorFilter = req.query.author;

  // Filter books based on query parameters
  let filteredBooks = books;
  if (titleFilter) {
    filteredBooks = filteredBooks.filter((b) => b.title.toLowerCase().includes(titleFilter.toLowerCase()));
  }
  if (authorFilter) {
    filteredBooks = filteredBooks.filter((b) => b.author.toLowerCase().includes(authorFilter.toLowerCase()));
  }

  if (book) {
    res.json(book);
  } else {
    res.status(404).send('Book not found');
  }
});

app.get('/books/:book_id', (req, res) => {
  const bookId = parseInt(req.params.book_id);

  // Get query parameters
  const authorFilter = req.query.author;

  // Filter books based on the provided bookId and author
  let filteredBooks = books;

  if (authorFilter) {
    filteredBooks = filteredBooks.filter((b) => b.author.toLowerCase().includes(authorFilter.toLowerCase()));
  }

  // If bookId is provided, filter by ID as well
  if (bookId) {
    filteredBooks = filteredBooks.filter((b) => b.id === bookId);
  }

  if (filteredBooks.length > 0) {
    res.json(filteredBooks);
  } else {
    res.status(404).send('No matching books found');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
