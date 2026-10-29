const express = require("express");
const jwt = require("jsonwebtoken");
const books = require("./booksdb");

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET = process.env.JWT_SECRET || "express-book-review-development-secret";
const users = Object.create(null);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const bookList = () => Object.values(books).map(({ reviews, ...book }) => ({ ...book, reviews }));

app.get("/", (req, res) => res.json({ message: "Express Book Review API", endpoints: ["/books", "/isbn/:isbn", "/author/:author", "/title/:title", "/review/:isbn"] }));
app.get("/books", (req, res) => res.json(bookList()));
app.get("/isbn/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: "Book not found" });
  return res.json(book);
});
app.get("/author/:author", (req, res) => {
  const author = decodeURIComponent(req.params.author).toLowerCase();
  return res.json(bookList().filter((book) => book.author.toLowerCase().includes(author)));
});
app.get("/title/:title", (req, res) => {
  const title = decodeURIComponent(req.params.title).toLowerCase();
  return res.json(bookList().filter((book) => book.title.toLowerCase().includes(title)));
});
app.get("/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: "Book not found" });
  return res.json(book.reviews);
});

app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "username and password are required" });
  if (users[username]) return res.status(409).json({ message: "User already exists" });
  users[username] = { username, password };
  return res.status(201).json({ message: "User successfully registered", username });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!users[username] || users[username].password !== password) return res.status(401).json({ message: "Invalid username or password" });
  return res.json({ message: "Login successful", token: jwt.sign({ username }, SECRET, { expiresIn: "1h" }) });
});

const authenticate = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  try {
    req.user = jwt.verify(token, SECRET);
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication required" });
  }
};

app.put("/customer/review/:isbn", authenticate, (req, res) => {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: "Book not found" });
  const review = req.body.review || req.body;
  book.reviews[req.user.username] = typeof review === "string" ? review : review.review;
  return res.json({ message: "Review added successfully", reviews: book.reviews });
});

app.delete("/customer/review/:isbn", authenticate, (req, res) => {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: "Book not found" });
  delete book.reviews[req.user.username];
  return res.json({ message: "Review deleted successfully", reviews: book.reviews });
});

if (require.main === module) app.listen(PORT, () => console.log(`Book review API listening on port ${PORT}`));
module.exports = app;
