import { createContext, useContext, useState, useEffect } from 'react';
import { MainContext } from '../../MainContext';

export const EditContext = createContext();

export const EditProvider = ({ children }) => {
	const [map, setMap] = useState(null);
	const [locations, setLocations] = useState([]);
	const [events, setEvents] = useState([]);
	const [isDataLoaded, setIsDataLoaded] = useState(false);
	const [renderableEvents, setRenderableEvents] = useState([]);
	const [sidebarState, setSidebar] = useState(false);
	const [timelineState, setTimeline] = useState(false);
	const [draggingEvent, setDraggingEvent] = useState(null);
	const [zoomLevel, setZoomLevel] = useState(null);
	const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });
	const [mapTranslation, setMapTranslation] = useState({ x: 0, y: 0 });

	const { setError } = useContext(MainContext);

	const mapId = window.location.pathname.match(/\/([^/]+)\/?$/)[1];

	const [hash, setHash] = useState(window.location.hash);

	useEffect(() => {
		fetchMap();
		setZoomLevel(100);
		setIsDataLoaded(true);
	}, []);

	useEffect(() => {
		if (isDataLoaded && hash && (events.length !== 0 || locations.length !== 0)) {
			const id = hash.match(/#([^#]+)$/)?.[1];
			if (id) {
				const event = events.find((ev) => ev.eventId === id);
				const location = locations.find((loc) => loc.locationId === id);
				if (event || location) {
					toggleSidebar({
						mode: 'view',
						event: event || null,
						location: location || null,
					});
					setZoomLevel(150);
					setHash(null);
				}
			}
		}
	}, [isDataLoaded, events, locations, hash]);

	useEffect(() => {
		if (events.length === 0) return;
		joinEventsWithLocations();
		if (!sidebarState || !sidebarState.event) return;

		// If an event is updated and is not active, toggleSidebar to it
		const updatedEvent = events.find((ev) => ev.eventId === sidebarState.event?.eventId);
		const updatedIsNotActive =
			updatedEvent &&
			updatedEvent.eventId === sidebarState.event.eventId &&
			updatedEvent.position !== sidebarState.event?.position;
		if (updatedIsNotActive) toggleSidebar({ mode: sidebarState.mode, event: updatedEvent });

		// if a new event saved, toggle sidebar to it
		const lastEvent = events[events.length - 1];
		const isLastActive = !sidebarState.event?.eventId && lastEvent?.eventId;
		if (isLastActive) toggleSidebar({ mode: 'view', event: lastEvent });
	}, [events]);

	useEffect(() => {
		if (locations.length === 0 || !sidebarState || sidebarState.event) return;

		const updatedLocation = locations.find((loc) => loc.locationId === sidebarState.location?.locationId);
		const updatedIsNotActive = updatedLocation && updatedLocation.position !== sidebarState.location?.position;
		if (updatedIsNotActive) toggleSidebar({ mode: sidebarState.mode, location: updatedLocation });

		const lastLocation = locations[locations.length - 1];
		const isLastActive = !sidebarState.location?.locationId && lastLocation?.locationId;
		if (isLastActive) toggleSidebar({ mode: 'view', location: lastLocation });
	}, [locations]);

	//   ###########################    MAP    #####################

	const fetchMap = async () => {
		if (mapId) {
			try {
				const mapResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/map/${mapId}`);
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
			await fetch(`${import.meta.env.VITE_API_URL}/api/map/${mapId}`, {
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

	//   ###########################    LOCATIONS    #####################

	const fetchLocations = async () => {
		try {
			const locationResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/location/${mapId}`);
			const locationData = await locationResponse.json();
			setLocations(locationData);
		} catch (error) {
			console.error(error);
			setError({ errorCode: 20, errorText: 'Error fetching locations' });
		}
	};

	const saveNewLocation = async (location) => {
		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}/api/location/${mapId}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(location),
			});
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
				`${import.meta.env.VITE_API_URL}/api/location/${mapId}/${location.locationId}`,
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

	const deleteLocation = async (location) => {
		try {
			await fetch(`${import.meta.env.VITE_API_URL}/api/location/${location.mapId}/${location.locationId}`, {
				method: 'DELETE',
			});
			fetchMapContents();
			toggleSidebar(sidebarState);
		} catch (error) {
			setError({ errorCode: 23, errorText: 'Error deleting location' });
			console.error(error);
		}
	};

	const deleteLocationsByMap = async () => {
		try {
			await fetch(`${import.meta.env.VITE_API_URL}/api/location/${map.id}`, {
				method: 'DELETE',
			});
			window.location.href = '/home';
		} catch (error) {
			setError({
				errorCode: 24,
				errorText: 'Error deleting locations by map',
			});
			console.error('Error deleting locations:', error);
		}
	};

	//   ###########################    EVENTS    #####################

	const fetchEvents = async () => {
		try {
			const eventResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/event/${mapId}`);
			const eventData = await eventResponse.json();
			setEvents(eventData);
		} catch (error) {
			setError({ errorCode: 20, errorText: 'Error fetching events' });
			console.error(error);
		}
	};

	const saveNewEvent = async (event) => {
		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}/api/event/${mapId}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(event),
			});
			const data = await response.json();
			fetchEvents();
		} catch (error) {
			setError({ errorCode: 21, errorText: 'Error saving new event' });
			console.error('Error creating event:', error);
		}
	};

	const updateEvent = async (event) => {
		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}/api/event/${mapId}/${event.eventId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(event),
			});
			const data = await response.json();
			fetchEvents();
		} catch (error) {
			setError({ errorCode: 22, errorText: 'Error updating event' });
			console.error('Error updating event position:', error);
		}
	};

	const deleteEvent = async (event) => {
		try {
			await fetch(`${import.meta.env.VITE_API_URL}/api/event/${event.mapId}/${event.eventId}`, {
				method: 'DELETE',
			});
			fetchEvents();
			toggleSidebar(sidebarState);
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

	//   ###########################    SIDEBAR AND TIMELINE    #####################

	const toggleSidebar = (newSidebarState) => {
		if (JSON.stringify(newSidebarState) === JSON.stringify(sidebarState)) setSidebar(false);
		else setSidebar(newSidebarState);
	};

	const toggleTimeline = () => {
		setTimeline(!timelineState);
	};

	//   ###########################    MISC    #####################

	const fetchMapContents = async () => {
		fetchEvents();
		fetchLocations();
	};

	const joinEventsWithLocations = () => {
		const marginOfError = 5;

		let updatedLocations = locations.map((location) => ({
			...location,
			events: [],
		}));

		const filteredRenderableEvents = events.filter((event) => {
			const matchingLocation = updatedLocations.find((location) => {
				const distance = Math.sqrt(
					Math.pow(event.position.y - location.position.y, 2) +
						Math.pow(event.position.x - location.position.x, 2)
				);
				return distance < marginOfError;
			});

			if (matchingLocation) {
				matchingLocation.events.push(event.eventId);
				return false;
			}

			return true;
		});

		setLocations(updatedLocations);
		setRenderableEvents(filteredRenderableEvents);
	};

	const stopDrag = () => {
		document.querySelectorAll('.mapWrapper .mapPoint').forEach((el) => {
			el.classList.remove('dragging');
		});
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
				// ########## MAP ##########
				map,
				mapId,
				setMap,
				updateMap,
				deleteMap,

				// ########## LOCATIONS ##########
				locations,
				setLocations,
				fetchLocations,
				saveNewLocation,
				updateLocation,
				deleteLocation,
				deleteLocationsByMap,

				// ########## EVENTS ##########
				events,
				renderableEvents,
				setEvents,
				fetchEvents,
				saveNewEvent,
				updateEvent,
				deleteEvent,
				deleteEventsByMap,

				// ########## SIDEBAR AND TIMELINE ##########
				sidebarState,
				toggleSidebar,
				timelineState,
				setTimeline,
				toggleTimeline,

				// ########## MISC ##########
				fetchMapContents,
				joinEventsWithLocations,
				stopDrag,
				zoomLevel,
				setZoomLevel,
				zoomIn,
				zoomOut,
				draggingEvent,
				setDraggingEvent,
				mapPosition,
				setMapPosition,
				mapTranslation,
				setMapTranslation,
			}}>
			{children}
		</EditContext.Provider>
	);
};

export default EditProvider;
