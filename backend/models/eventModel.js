import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const eventSchema = new mongoose.Schema({
	eventId: { type: String, default: () => nanoid(10), unique: true },
	mapId: { type: String, required: true },
	title: { type: String, required: true },
	description: { type: String, required: false, default: '' },
	date: {
		year: { type: Number, required: false, default: 0 },
		month: { type: Number, required: false, default: 0 },
		week: { type: Number, required: false, default: 0 },
		day: { type: Number, required: false, default: 0 },
	},
	position: {
		x: { type: Number, required: true, default: 0 },
		y: { type: Number, required: true, default: 0 },
	},
});

const Event = mongoose.model('Event', eventSchema);
export default Event;
