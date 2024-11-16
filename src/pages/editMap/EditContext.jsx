import { createContext, useState, useEffect } from 'react';

export const EditContext = createContext();

export const EditProvider = ({ children }) => {
	const [map, setMap] = useState(null);
	const [locations, setLocations] = useState([]);
	const [events, setEvents] = useState([]);
	const [renderableEvents, setRenderableEvents] = useState([]);
	const [error, setError] = useState({ errorCode: null, errorText: null });
	const [sidebarState, setSidebar] = useState(false);
	const [timelineState, setTimeline] = useState(false);
	const [draggingEvent, setDraggingEvent] = useState(null);
	const [zoomLevel, setZoomLevel] = useState(null);
	const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });
	const [mapTranslation, setMapTranslation] = useState({ x: 0, y: 0 });

	const urlId = window.location.pathname.match(/\/([^/]+)\/?$/)[1];

	useEffect(() => {
		fetchMap();
		setZoomLevel(100);
	}, []);

	useEffect(() => {
		joinEventsWithLocations();
	}, [events]);

	const joinEventsWithLocations = () => {
		// Margin of error for proximity check, 5%
		const marginOfError = 5;

		let updatedLocations = [...locations];
		const filteredRenderableEvents = events.filter((ev) => {
			const coincidingLocation = updatedLocations.find((location) => {
				const distance = Math.sqrt(
					Math.pow(ev.position.y - location.position.y, 2) +
						Math.pow(ev.position.x - location.position.x, 2)
				);
				return distance < marginOfError;
			});

			if (coincidingLocation) {
				const updatedLocation = {
					...coincidingLocation,
					events: [...(coincidingLocation.events || []), ev.eventId],
				};

				updatedLocations = updatedLocations.map((location) =>
					location.locationId === coincidingLocation.locationId
						? updatedLocation
						: location
				);

				return false;
			}

			return true;
		});

		setLocations(updatedLocations);
		setRenderableEvents(filteredRenderableEvents);
	};

	const fetchMap = async () => {
		if (urlId) {
			try {
				const mapResponse = await fetch(
					`${import.meta.env.VITE_API_URL}/api/map/${urlId}`
				);
				const mapData = await mapResponse.json();
				setMap(mapData);
			} catch (error) {
				setError({ errorCode: 3, errorText: 'Error fetching map' });
				console.error(error);
			}
			fetchMapContents();
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
			setError({ errorCode: 4, errorText: 'Error updating Map' });
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
			deleteLocationsByMap();
			window.location.href = `/`;
		} catch (error) {
			setError({ errorCode: 5, errorText: 'Error deleting map' });
			console.error(error);
		}
	};

	const fetchLocations = async () => {
		try {
			const locationResponse = await fetch(
				`${import.meta.env.VITE_API_URL}/api/location/${urlId}`
			);
			const locationData = await locationResponse.json();
			setLocations(locationData);
		} catch (error) {
			console.error(error);
			setError({ errorCode: 20, errorText: 'Error fetching locations' });
		}
	};

	const saveNewLocation = async (location) => {
		console.log(`${import.meta.env.VITE_API_URL}/api/location/${urlId}`);
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/location/${urlId}`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(location),
				}
			);
			const data = await response.json();
			fetchMapContents();
		} catch (error) {
			setError({ errorCode: 21, errorText: 'Error creating location' });
			console.error('Error creating location:', error);
		}
	};

	const updateLocation = async (location) => {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/location/${urlId}/${
					location.locationId
				}`,
				{
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(location),
				}
			);
			const data = await response.json();
			fetchMapContents();
		} catch (error) {
			setError({ errorCode: 22, errorText: 'Error updating location' });
			console.error('Error updating location position:', error);
		}
	};

	const deleteLocation = async () => {
		try {
			await fetch(
				`${import.meta.env.VITE_API_URL}/api/event/${location.mapId}/${
					location.locationId
				}`,
				{ method: 'DELETE' }
			);
			fetchMapContents();
			setSidebar(false);
		} catch (error) {
			setError({ errorCode: 23, errorText: 'Error deleting location' });
			console.error(error);
		}
	};

	const deleteLocationsByMap = async () => {
		try {
			await fetch(
				`${import.meta.env.VITE_API_URL}/api/location/${map.id}`,
				{
					method: 'DELETE',
				}
			);
			window.location.href = '/home';
		} catch (error) {
			setError({
				errorCode: 24,
				errorText: 'Error deleting locations by map',
			});
			console.error('Error deleting locations:', error);
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
			setError({ errorCode: 20, errorText: 'Error fetching events' });
			console.error(error);
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
			fetchEvents();
		} catch (error) {
			setError({ errorCode: 21, errorText: 'Error saving new event' });
			console.error('Error creating event:', error);
		}
	};

	const updateEvent = async (event) => {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/event/${urlId}/${
					event.eventId
				}`,
				{
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(event),
				}
			);
			const data = await response.json();
			fetchEvents();
		} catch (error) {
			setError({ errorCode: 22, errorText: 'Error updating event' });
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
		} catch (error) {
			setError({ errorCode: 23, errorText: 'Error deleting event' });
			console.error(error);
		}
	};

	const deleteEventsByMap = async () => {
		try {
			await fetch(`${import.meta.env.VITE_API_URL}/api/event/${map.id}`, {
				method: 'DELETE',
			});
		} catch (error) {
			setError({ errorCode: 24, errorText: 'Error deleting events' });
			console.error('Error deleting events:', error);
		}
	};

	const fetchMapContents = async () => {
		fetchEvents();
		fetchLocations();
	};

	const toggleSidebar = (newSidebarState) => {
		if (JSON.stringify(newSidebarState) === JSON.stringify(sidebarState))
			setSidebar(false);
		else setSidebar(newSidebarState);
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
				renderableEvents,
				setEvents,
				locations,
				setLocations,
				fetchLocations,
				saveNewLocation,
				updateLocation,
				deleteLocation,
				deleteLocationsByMap,
				error,
				setError,
				sidebarState,
				setSidebar,
				timelineState,
				setTimeline,
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

				//CRUD functions
				updateMap,
				deleteMap,
				fetchEvents,
				fetchMapContents,
				saveNewEvent,
				updateEvent,
				deleteEvent,

				//other functions
				toggleSidebar,
				toggleTimeline,
			}}>
			{children}
		</EditContext.Provider>
	);
};

export default EditProvider;
