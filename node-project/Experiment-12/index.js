const express = require("express");
const app = express();

app.use(express.json());

// In-memory seats data
// seatId => { status: "available" | "locked" | "booked", lockedBy: userId, lockTime: timestamp }
let seats = {};
const totalSeats = 10;

// Initialize seats
for (let i = 1; i <= totalSeats; i++) {
  seats[i] = { status: "available", lockedBy: null, lockTime: null };
}

// 1. View all seats
app.get("/seats", (req, res) => {
  res.json(seats);
});

// 2. Lock a seat
app.post("/seats/lock", (req, res) => {
  const { seatId, userId } = req.body;

  if (!seatId || !userId) return res.status(400).json({ error: "seatId and userId required" });
  if (!seats[seatId]) return res.status(404).json({ error: "Seat does not exist" });

  const seat = seats[seatId];

  // Check if already booked
  if (seat.status === "booked") return res.status(400).json({ error: "Seat already booked" });

  // Check if locked by another user
  if (seat.status === "locked" && seat.lockedBy !== userId) {
    return res.status(400).json({ error: "Seat is currently locked by another user" });
  }

  // Lock the seat
  seat.status = "locked";
  seat.lockedBy = userId;
  seat.lockTime = Date.now();

  // Auto-expire lock after 1 minute
  setTimeout(() => {
    if (seat.status === "locked" && Date.now() - seat.lockTime >= 60_000) {
      seat.status = "available";
      seat.lockedBy = null;
      seat.lockTime = null;
      console.log(`Seat ${seatId} lock expired`);
    }
  }, 60_000);

  res.json({ message: `Seat ${seatId} locked for user ${userId}`, seat });
});

// 3. Confirm a seat booking
app.post("/seats/confirm", (req, res) => {
  const { seatId, userId } = req.body;

  if (!seatId || !userId) return res.status(400).json({ error: "seatId and userId required" });
  if (!seats[seatId]) return res.status(404).json({ error: "Seat does not exist" });

  const seat = seats[seatId];

  // Only allow if seat is locked by the same user
  if (seat.status !== "locked" || seat.lockedBy !== userId) {
    return res.status(400).json({ error: "Seat is not locked by this user" });
  }

  seat.status = "booked";
  seat.lockedBy = null;
  seat.lockTime = null;

  res.json({ message: `Seat ${seatId} successfully booked for user ${userId}`, seat });
});

// Welcome route for the root URL
app.get("/", (req, res) => {
  res.send("Welcome to the Ticket Booking API! Use /seats to view all seats.");
});
// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Ticket Booking API running at http://localhost:${PORT}`);
});
