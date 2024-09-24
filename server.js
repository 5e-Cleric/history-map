import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import mapRoutes from './backend/routes/mapRoutes.js';
import eventRoutes from './backend/routes/eventRoutes.js';

const app = express();
const PORT = 3050;

const dbCreds = { username: 'history-map' , password: 'QFIDyC22jHsR9ubj' };
// MongoDB connection string with credentials and database name
const mongoURI = `mongodb+srv://history-map:${dbCreds.password}@history-map.tjwf6.mongodb.net/historymap?retryWrites=true&w=majority`;

// Middleware to handle CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Handle connection errors with a custom function
const handleConnectionError = (error) => {
    if (error) {
        console.error('Could not connect to MongoDB: \n');
        console.error(error);
        console.error('\nEnsure MongoDB URI is configured properly and MongoDB is running.');
        process.exit(1); // non-zero exit code to indicate an error
    }
};

// Connect to MongoDB using Mongoose
mongoose
    .connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected'))
    .catch((error) => handleConnectionError(error));

// Define routes
app.get('/', (req, res) => {
    res.send('Hello from Express!');
});

app.use((req, res, next) => {
    next();
});

// Use the map routes
app.use('/api/map', mapRoutes);

// Use the event routes
app.use('/api/event', eventRoutes);

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
