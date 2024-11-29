import { useEffect, useState, useRef, useContext } from 'react';
import CustomDate from '@components/customDate/CustomDate';
import { EditContext } from '@pages/editMap/EditContext';
import { MainContext } from '../../../MainContext';
import { convertToTotalDays } from '../../timeline/dateFunctions.helpers';

function EditEvent() {
	const {
		map,
		sidebarState,
		updateEvent,
		saveNewEvent,

		toggleSidebar,
	} = useContext(EditContext);

	const { setError } = useContext(MainContext);

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [position, setPosition] = useState({ y: null, x: null });
	const dateRef = useRef(null);

	const event = sidebarState.event;

	useEffect(() => {
		if (event.eventId) {
			setTitle(event.title);
			setDescription(event.description);
			dateRef.current.setValues(event.date);
		}
		setPosition(event.position);
	}, [event]);

	const validateDates = () => {
		const date = dateRef.current.getValues();
		const startDate = map.dateSystem.dateStart;
		if (
			convertToTotalDays(date, map.dateSystem.dateEquivalences) <
			convertToTotalDays(startDate, map.dateSystem.dateEquivalences)
		) {
			setError({
				errorCode: 26,
				errorText: `The date must be posterior to 
				${startDate.year || '0'}/${startDate.month || '0'}/${startDate.week || '0'}/${startDate.day || '0'}`,
			});
			return false;
		}

		
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const eventData = {
			eventId: event.eventId,
			title,
			description,
			position,
			date: dateRef.current.getValues(),
		};

		if (!validateDates()) return;

		if (event.eventId) {
			updateEvent(eventData);
			toggleSidebar({ mode: 'view', event: eventData });
		} else {
			saveNewEvent(eventData);
		}
	};

	return (
		<div className="event edit">
			<form className="form" onSubmit={handleSubmit}>
				<label className="fieldGroup">
					Event title:
					<input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
				</label>
				<label className="fieldGroup">
					Description:
					<textarea value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
				</label>
				<label className="fieldGroup">
					Event Date:
					<CustomDate ref={dateRef} type="date" />
				</label>
				<button type="submit" className="green">
					{!event ? 'Create event' : 'Save event'}
				</button>
			</form>
		</div>
	);
}

export default EditEvent;
