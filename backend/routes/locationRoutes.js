import express from 'express';
import Location from '../models/locationModel.js';

const router = express.Router();

router.get('/:mapId', async (req, res) => {
	const { mapId } = req.params;
	try {
		const locations = await Location.find({ mapId });

		res.json(locations);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/:locationId', async (req, res) => {
	const { locationId } = req.params;
	try {
		const location = await Location.findOne({ locationId });
		if (!location) {
			return res.status(404).json({ error: 'Location not found' });
		}

		res.json(location);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
});

router.put('/:mapId/:locationId', async (req, res) => {
	const { mapId, locationId } = req.params;
	const updatedData = req.body;
	console.log(`Updating location ${locationId} for map ${mapId}`);

	try {
		// Find the location by locationId and mapId
		const location = await Location.findOne({ locationId, mapId });
		if (!location) {
			return res
				.status(404)
				.json({ error: 'Location not found for this map' });
		}
		Object.assign(location, updatedData);
		await location.save();

		res.json(location);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
});

// Create a new location
router.post('/:mapId', async (req, res) => {
	const { title, description, position } = req.body;
	const { mapId } = req.params;

	console.log(req.body);
	console.log(`Creating location for map ${mapId}`);
	try {
		const newLocation = new Location({
			mapId,
			title,
			description,
			position,
		});

		const savedLocation = await newLocation.save();
		res.status(201).json(savedLocation);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

router.delete('/:mapId/:locationId', async (req, res) => {
	const { mapId, locationId } = req.params;
	console.log(`Attempting to delete location ${locationId} for map ${mapId}`);
	try {
		const location = await Location.findOne({ locationId, mapId });
		if (!location) {
			console.log('Location not found');
			return res.status(404).json({ error: 'Location not found' });
		}
		await Location.deleteOne({ locationId, mapId });

		res.json({ message: 'Location deleted successfully' });
	} catch (error) {
		console.log('Error:', error);
		res.status(500).json({ error: error.message });
	}
});

router.delete('/:mapId', async (req, res) => {
	const { mapId } = req.params;
	try {
		await Location.deleteMany({ mapId });

		res.json({ message: 'Locations deleted successfully' });
	} catch (error) {
		console.log('Error:', error);
		res.status(500).json({ error: error.message });
	}
});

export default router;
