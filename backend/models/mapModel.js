import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const dateSystemSchema = new mongoose.Schema({
	dateNames: {
		year: { type: String, required: false, default: 'Year' },
		month: { type: String, required: false, default: 'Month' },
		week: { type: String, required: false, default: 'Week' },
		day: { type: String, required: false, default: 'Day' },
	},
	dateEquivalences: {
		year: { type: Number, required: false, default: 1 },
		month: { type: Number, required: false, default: 12 },
		week: { type: Number, required: false, default: 4 },
		day: { type: Number, required: false, default: 7 },
	},
	dateStart: {
		year: { type: Number, required: false, default: 0 },
		month: { type: Number, required: false, default: 0 },
		week: { type: Number, required: false, default: 0 },
		day: { type: Number, required: false, default: 0 },
	},
});

const mapSchema = new mongoose.Schema({
	id: { type: String, default: () => nanoid(12), index: { unique: true } },
	author: { type: String, required: false, default: '' },
	title: { type: String, required: true },
	description: { type: String, required: false, default: '' },
	map: { type: String, required: true },
	dateSystem: { type: dateSystemSchema, required: true },
	version: { type: Number, default: 1 },
});

const Map = mongoose.model('Map', mapSchema);
export default Map;
