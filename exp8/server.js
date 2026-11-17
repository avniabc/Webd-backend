const express = require("express");
const app = express();
app.use(express.json());

let books = [
  { id: 1, title: "Atomic Habits", author: "James Clear" },
  { id: 2, title: "Ikigai", author: "Hector Garcia" },
  { id: 3, title: "The Monk Who Sold His Ferrari", author: "Robin Sharma" }
];
let nextId = 4;

app.get("/", (req, res) => res.send("Avni's Book API is running. Try /books"));

app.get("/books", (req, res) => res.json(books));

app.get("/books/:id", (req, res) => {
  const book = books.find(b => b.id === Number(req.params.id));
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book);
});

app.post("/books", (req, res) => {
  if (!req.body.title || !req.body.author)
    return res.status(400).json({ message: "title and author are required" });
  const book = { id: nextId++, title: req.body.title, author: req.body.author };
  books.push(book);
  res.status(201).json(book);
});

app.put("/books/:id", (req, res) => {
  const book = books.find(b => b.id === Number(req.params.id));
  if (!book) return res.status(404).json({ message: "Book not found" });
  book.title = req.body.title || book.title;
  book.author = req.body.author || book.author;
  res.json(book);
});

app.delete("/books/:id", (req, res) => {
  const before = books.length;
  books = books.filter(b => b.id !== Number(req.params.id));
  if (books.length === before) return res.status(404).json({ message: "Book not found" });
  res.json({ message: "Book deleted successfully" });
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
