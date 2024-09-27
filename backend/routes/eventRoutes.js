import express from 'express';
import Event from '../models/eventModel.js';

const router = express.Router();

router.get('/:mapId', async (req, res) => {
	const { mapId } = req.params;
	try {
		const events = await Event.find({ mapId });

		res.json(events);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/:eventId', async (req, res) => {
	const { eventId } = req.params;
	try {
		const event = await Event.findOne({ eventId });
		if (!event) {
			return res.status(404).json({ error: 'Event not found' });
		}

		res.json(event);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
});
router.put('/:mapId/:eventId', async (req, res) => {
	const { mapId, eventId } = req.params;
	const updatedData = req.body;
	console.log(`Updating event ${eventId} for map ${mapId}`);

	try {
		// Find the event by eventId and mapId
		const event = await Event.findOne({ eventId, mapId });
		if (!event) {
			return res
				.status(404)
				.json({ error: 'Event not found for this map' });
		}
		Object.assign(event, updatedData);
		await event.save();

		res.json(event);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
});

// Create a new event
router.post('/:mapId', async (req, res) => {
	const { title, description, date, position } = req.body;
	const { mapId } = req.params;

	console.log(`Creating event for map ${mapId}`);
	try {
		const newEvent = new Event({
			mapId,
			title,
			description,
			date,
			position,
		});

		const savedEvent = await newEvent.save();
		res.status(201).json(savedEvent);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

router.delete('/:mapId/:eventId', async (req, res) => {
	const { mapId, eventId } = req.params;
	console.log(`Attempting to delete event ${eventId} for map ${mapId}`);
	try {
		const event = await Event.findOne({ eventId, mapId });
		if (!event) {
			console.log('Event not found');
			return res.status(404).json({ error: 'Event not found' });
		}
		await Event.deleteOne({ eventId, mapId });

		res.json({ message: 'Event deleted successfully' });
	} catch (error) {
		console.log('Error:', error); // Log any errors
		res.status(500).json({ error: error.message });
	}
});

export default router;
