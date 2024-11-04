import { createContext, useState, useEffect } from 'react';

export const EditContext = createContext();

export const EditProvider = ({ children }) => {
	const [map, setMap] = useState(null);
	const [events, setEvents] = useState([]);
	const [error, setError] = useState(null);
	const [sidebarState, setSidebar] = useState(false);
	const [timelineState, setTimeline] = useState(false);
	const [dropPosition, setDropPosition] = useState(null);
	const [draggingEvent, setDraggingEvent] = useState(null);
	const [zoomLevel, setZoomLevel] = useState(null);
	const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });
	const [mapTranslation, setMapTranslation] = useState({ x: 0, y: 0 });

	const urlId = window.location.pathname.match(/\/([^/]+)\/?$/)[1];

	useEffect(() => {
		fetchMap();
		setZoomLevel(100);
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
			deleteEventsByMap();
			window.location.href = `/`;
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
		} catch (error) {
			console.error('Error updating event position:', error);
		}
	};

	const deleteEvent = async (event) => {
		try {
			await fetch(
				`${import.meta.env.VITE_API_URL}/api/event/${event.mapId}/${
					event.eventId
				}`,
				{ method: 'DELETE' }
			);
			fetchEvents();
			setSidebar(false);
		} catch (error) {}
	};
	const deleteEventsByMap = async () => {
		try {
			await fetch(`${import.meta.env.VITE_API_URL}/api/event/${map.id}`, {
				method: 'DELETE',
			});
		} catch (error) {
			console.error('Error deleting events:', error);
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

	const zoomIn = () => {
		setZoomLevel(zoomLevel + 10);
		setZoomLevel(Math.min(700, zoomLevel + 10));
	};
	const zoomOut = () => {
		setZoomLevel(Math.max(10, zoomLevel - 10));
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
				zoomLevel,
				setZoomLevel,
				zoomIn,
				zoomOut,
				mapPosition,
				setMapPosition,
				mapTranslation,
				setMapTranslation,

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
