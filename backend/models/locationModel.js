import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const locationSchema = new mongoose.Schema({
	locationId: { type: String, default: () => nanoid(11), unique: true },
	mapId: { type: String, required: true },
	title: { type: String, required: true },
	description: { type: String, required: false, default: '' },
	position: {
		x: { type: Number, required: true, default: 0 },
		y: { type: Number, required: true, default: 0 },
	},
});

const Location = mongoose.model('Location', locationSchema);
export default Location;
