import { useEffect, useState, useRef, useContext } from 'react';
import CustomDate from '@components/customDate/CustomDate';
import { EditContext } from '@pages/editMap/EditContext';

function EditEvent() {
	const {
		sidebarState,
		fetchEvents,
		updateEvent,
		saveNewEvent,

		toggleSidebar,
	} = useContext(EditContext);

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

	const handleSubmit = (e) => {
		e.preventDefault();

		const eventData = {
			eventId: event.eventId,
			title,
			description,
			position,
			date: dateRef.current.getValues(),
		};

		if (event.eventId) {
			updateEvent(eventData);
		} else {
			saveNewEvent(eventData);
		}

		fetchEvents();
		toggleSidebar({ mode: 'view', event: event });
	};

	return (
		<div className="event edit">
			<form className="form" onSubmit={handleSubmit}>
				<label className="fieldGroup">
					Event title:
					<input
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
					/>
				</label>
				<label className="fieldGroup">
					Description:
					<textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						required></textarea>
				</label>
				<label className="fieldGroup">
					Event Date:
					<CustomDate ref={dateRef} dataType="date" />
				</label>
				<button type="submit" className="green">
					{!event ? 'Create event' : 'Save event'}
				</button>
			</form>
		</div>
	);
}

export default EditEvent;
