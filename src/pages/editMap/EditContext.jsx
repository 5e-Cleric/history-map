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
		const fetchMapData = async () => {
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

		fetchMapData();
	}, []);

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

	const handleEvent = async (newEvent) => {
		if (!newEvent.eventId) await saveNewEvent(newEvent);
		else await updateEvent(newEvent);

		fetchEvents();
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
			//console.log('moving element ', data);
		} catch (error) {
			console.error('Error updating event position:', error);
		}
	};

	const toggleSidebar = (newSidebarState) => {
        if(sidebarState.mode === 'editEvent') fetchEvents();
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

				//CRUD functions
				fetchEvents,
				handleEvent,
				saveNewEvent,
				updateEvent,

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
