const express = require("express");
const app = express();

// Middleware to parse JSON request body
app.use(express.json());

// In-memory array to store cards
let cards = [];
let nextId = 1; // Auto-increment card IDs

// 1. GET all cards
app.get("/cards", (req, res) => {
  res.json(cards);
});

// 2. POST a new card
app.post("/cards", (req, res) => {
  const { suit, value } = req.body;

  if (!suit || !value) {
    return res.status(400).json({ error: "Suit and value are required" });
  }

  const newCard = { id: nextId++, suit, value };
  cards.push(newCard);

  res.status(201).json(newCard);
});

// 3. GET a card by ID
app.get("/cards/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const card = cards.find(c => c.id === id);

  if (!card) {
    return res.status(404).json({ error: "Card not found" });
  }

  res.json(card);
});

// 4. DELETE a card by ID
app.delete("/cards/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = cards.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Card not found" });
  }

  const deletedCard = cards.splice(index, 1);
  res.json({ message: "Card deleted", card: deletedCard[0] });
});

app.get("/", (req, res) => {
  res.send("Welcome to the Card API! Use /cards to get started.");
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Card API server running at http://localhost:${PORT}`);
});
