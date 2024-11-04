import express from 'express';
import Map from '../models/mapModel.js';

const router = express.Router();

router.get('/all', async (req, res) => {
	try {
		const maps = await Map.find();
		res.json(maps);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/:id', async (req, res) => {
	const { id } = req.params;
	try {
		if (id.length !== 12) {
			return res.status(400).json({ error: 'Invalid map ID length' });
		}

		const map = await Map.findOne({ id });

		if (!map) {
			return res.status(404).json({ error: 'Map not found' });
		}

		res.json(map);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
});

// Create a new map
router.post('/new', async (req, res) => {
	const { title, description, map, author, dateSystem } = req.body;

	console.log(req.body);
	try {
		const newMap = new Map({
			title,
			description,
			map,
			author: author || 'noAuthor',
			dateSystem,
		});

		const savedMap = await newMap.save();
		res.status(201).json(savedMap);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

//PUT route to update a map by ID
router.put('/:id', async (req, res) => {
	const { id } = req.params;
	const updatedData = req.body;
	console.log(`Updating map ${id}`);

	try {
		const map = await Map.findOne({ id: id });
		if (!map) {
			return res.status(404).json({ error: 'Map not found.' });
		}
		Object.assign(map, updatedData);
		await map.save();

		res.json(map);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
});

// DELETE route to delete a map by ID
router.delete('/:id', async (req, res) => {
	const { id } = req.params;
	console.log(`Attempting to delete map with id: ${id}`); // Log the ID
	try {
		// Validate the ID format
		if (id.length !== 12) {
			console.log('Invalid map ID length'); // Log validation failure
			return res.status(400).json({ error: 'Invalid map ID length' });
		}

		const map = await Map.findOne({ id });

		if (!map) {
			console.log('Map not found'); // Log if map is not found
			return res.status(404).json({ error: 'Map not found' });
		}

		await Map.deleteOne({ id });
		console.log('Map deleted successfully'); // Log successful deletion

		res.json({ message: 'Map deleted successfully' });
	} catch (error) {
		console.log('Error:', error); // Log any errors
		res.status(500).json({ error: error.message });
	}
});

export default router;
