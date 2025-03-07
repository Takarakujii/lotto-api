import express from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config.js';
import cors from 'cors';

import v1 from './routes/v1/index.js';
import './core/database.js';
import morgan from 'morgan';

import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);

// CORS for REST API
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || origin.startsWith("http://localhost:")) {
            callback(null, true); // Allow all localhost ports
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true, // Allow cookies & authentication headers
    allowedHeaders: ['Content-Type', 'Authorization', 'apikey'],
}));

// CORS for Socket.IO
const io = new Server(server, {
    cors: {
        origin: (origin, callback) => {
            if (!origin || origin.startsWith("http://localhost:")) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/v1', v1);

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);


    
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        clearInterval(timer);
    });
});

const port = process.env.PORT || 8080;
server.listen(port, () => console.log(`Server running on port: http://localhost:${port}`));
