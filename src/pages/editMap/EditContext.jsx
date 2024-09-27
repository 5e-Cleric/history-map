import { createContext, useState, useEffect } from 'react';

export const EditContext = createContext();

export const EditProvider = ({ children }) => {
	const [map, setMap] = useState(null);
	const [events, setEvents] = useState([]);
	const [error, setError] = useState('');
	const [sidebarState, setSidebar] = useState(false);
	const [timelineState, setTimeline] = useState(false);
	const [dropPosition, setDropPosition] = useState(null);
	const [draggingEvent, setDraggingEvent] = useState(null);

	const urlId = window.location.pathname.match(/\/([^/]+)\/?$/)[1];

	useEffect(() => {
		fetchMap();
	}, []);

	const fetchMap = async () => {
		if (urlId) {
			try {
				const mapResponse = await fetch(
					`${import.meta.env.VITE_API_URL}/api/map/${urlId}`
				);
				const mapData = await mapResponse.json();
				setMap(mapData);
			} catch (error) {
				setError('Error fetching Maps');
			}
			fetchEvents();
		}
	};

	const updateMap = async (newMap) => {
		console.log(newMap);
		try {
			await fetch(`${import.meta.env.VITE_API_URL}/api/map/${urlId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(newMap),
			});
			fetchMap();
		} catch (error) {
			console.error(error);
		}
	};

	const deleteMap = async () => {
		try {
			await fetch(`${import.meta.env.VITE_API_URL}/api/map/${map.id}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
			});
			const data = await response.json();
		} catch (error) {
			console.error(error);
		}
	};

	const fetchEvents = async () => {
		try {
			const eventResponse = await fetch(
				`${import.meta.env.VITE_API_URL}/api/event/${urlId}`
			);
			const eventData = await eventResponse.json();
			setEvents(eventData);
		} catch (error) {
			setError('Error fetching Events');
		}
	};

	const saveNewEvent = async (event) => {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/event/${urlId}`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(event),
				}
			);
			const data = await response.json();
			console.log('Event created:', data);
		} catch (error) {
			console.error('Error creating event:', error);
		}
	};

	const updateEvent = async (event) => {
		console.log(event);
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/event/${urlId}/${
					event.eventId
				}`, // Ensure the correct endpoint for updating
				{
					method: 'PUT', // Assuming you're using PUT for updating
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(event),
				}
			);
			const data = await response.json();

			fetchEvents();
		} catch (error) {
			console.error('Error updating event position:', error);
		}
	};

	const deleteEvent = async (event) => {
		try {
			const eventResponse = await fetch(
				`${import.meta.env.VITE_API_URL}/api/event/${event.mapId}/${
					event.eventId
				}`,
				{ method: 'DELETE' }
			);

			if (!eventResponse.ok) {
				throw new Error('Failed to delete event');
			}

			const eventData = await eventResponse.json();
			console.log('Event deleted successfully', eventData);
			fetchEvents();
			setSidebar(false);
		} catch (error) {
			console.error('Error deleting event:', error);
		}
	};

	const handleDragEnd = (index, newPosition) => {
		const updatedEvents = [...events];
		updatedEvents[index] = {
			...updatedEvents[index],
			position: newPosition,
		};
		setEvents(updatedEvents);
		updateEvent(updatedEvents[index]);
	};

	const toggleSidebar = (newSidebarState) => {
		if (sidebarState.mode === 'editEvent') fetchEvents();
		if (JSON.stringify(newSidebarState) === JSON.stringify(sidebarState))
			setSidebar(false);
		else setSidebar(newSidebarState);
		setDropPosition(null);
	};

	const toggleTimeline = () => {
		setTimeline(!timelineState);
	};

	return (
		<EditContext.Provider
			value={{
				//state
				map,
				setMap,
				events,
				setEvents,
				error,
				setError,
				sidebarState,
				setSidebar,
				timelineState,
				setTimeline,
				dropPosition,
				setDropPosition,
				draggingEvent,
				setDraggingEvent,

				handleDragEnd,

				//CRUD functions
				updateMap,
				deleteMap,
				fetchEvents,
				saveNewEvent,
				updateEvent,
				deleteEvent,

				//other functions
				//other functions
				toggleSidebar,
				toggleTimeline,
			}}
		>
			{children}
		</EditContext.Provider>
	);
};

export default EditProvider;
