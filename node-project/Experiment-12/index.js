const express = require("express");
const app = express();

app.use(express.json());
let seats = {};
const totalSeats = 10;

for (let i = 1; i <= totalSeats; i++) {
  seats[i] = { status: "available", lockedBy: null, lockTime: null };
}

app.get("/seats", (req, res) => {
  res.json(seats);
});

app.post("/seats/lock", (req, res) => {
  const { seatId, userId } = req.body;

  if (!seatId || !userId) return res.status(400).json({ error: "seatId and userId required" });
  if (!seats[seatId]) return res.status(404).json({ error: "Seat does not exist" });

  const seat = seats[seatId];

  if (seat.status === "booked") return res.status(400).json({ error: "Seat already booked" });

  if (seat.status === "locked" && seat.lockedBy !== userId) {
    return res.status(400).json({ error: "Seat is currently locked by another user" });
  }

  seat.status = "locked";
  seat.lockedBy = userId;
  seat.lockTime = Date.now();

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

app.post("/seats/confirm", (req, res) => {
  const { seatId, userId } = req.body;

  if (!seatId || !userId) return res.status(400).json({ error: "seatId and userId required" });
  if (!seats[seatId]) return res.status(404).json({ error: "Seat does not exist" });

  const seat = seats[seatId];

  if (seat.status !== "locked" || seat.lockedBy !== userId) {
    return res.status(400).json({ error: "Seat is not locked by this user" });
  }

  seat.status = "booked";
  seat.lockedBy = null;
  seat.lockTime = null;

  res.json({ message: `Seat ${seatId} successfully booked for user ${userId}`, seat });
});


// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Ticket Booking API running at http://localhost:${PORT}`);
});
