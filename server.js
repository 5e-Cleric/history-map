import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import mapRoutes from './backend/routes/mapRoutes.js';
import eventRoutes from './backend/routes/eventRoutes.js';

const app = express();
const PORT = 3050;

// Middleware to handle CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// MongoDB connection string
const mongoURI = 'mongodb://127.0.0.1/historymap';

const handleConnectionError = (error)=>{
	if(error) {
		console.error('Could not connect to a Mongo database: \n');
		console.error(error);
		console.error('\nIf you are running locally, make sure mongodb.exe is running and DB URL is configured properly');
		process.exit(1); // non-zero exit code to indicate an error
	}
};

mongoose
    .connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch((error)=>handleConnectionError(error));

// Define routes
app.get('/', (req, res) => {
    res.send('Hello from Express!');
});
app.use((req, res, next) => {
    //console.log(`Received request for ${req.url}`);
    next();
});

// Use the map routes
app.use('/api/map', mapRoutes);

app.use('/api/event', eventRoutes);

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
