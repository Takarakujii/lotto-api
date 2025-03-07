const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Change this to your frontend URL
    credentials: true
  }
});

let countdown = 60; // Initial countdown time
let countdownActive = false; // Prevent multiple timers

// Function to start countdown
const startCountdown = () => {
  if (!countdownActive) {
    countdownActive = true;

    const timer = setInterval(() => {
      countdown--;

      // Broadcast countdown to all clients
      io.emit('countdown', countdown);

      if (countdown <= 0) {
        clearInterval(timer);
        countdown = 60; // Reset countdown
        countdownActive = false;
      }
    }, 1000);
  }
};

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log('A user connected');

  // Send the current countdown to new clients
  socket.emit('countdown', countdown);

  // Start countdown when a user logs in
  socket.on('user_logged_in', () => {
    startCountdown();
  });

  // Disconnect event
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(8080, () => {
  console.log('Server running on port 8080');
});
