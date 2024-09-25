import express from 'express';
// Load environment variables from .env
import mongoose from 'mongoose';
import cors from 'cors';
import mapRoutes from './backend/routes/mapRoutes.js';
import eventRoutes from './backend/routes/eventRoutes.js';
import dotenv from 'dotenv';

const env = process.env.NODE_ENV || 'development';

dotenv.config({ path: `.env.${env}` }); // Load .env.local or .env.production based on NODE_ENV

const app = express();
const PORT = process.env.PORT || 3050;
const mongoURI = process.env.MONGO_URI;

// Middleware to handle CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB using Mongoose
mongoose
	.connect(mongoURI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log('MongoDB connected'))
	.catch((error) => {
		console.error('Error connecting to MongoDB:', error);
		console.error(
			'Ensure MongoDB URI is configured properly and MongoDB is running.'
		);
		process.exit(1);
	});

// Define a simple route
app.get('/', (req, res) => {
	res.send('Hello from Express!');
});

// Use the map routes
app.use('/api/map', mapRoutes);

// Use the event routes
app.use('/api/event', eventRoutes);

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
