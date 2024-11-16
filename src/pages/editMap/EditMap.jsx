import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';
import './editMap.css';
import Nav from '@components/nav/Nav';
import Toolbar from '@components/toolbar/Toolbar';
import EventPin from '@components/event/EventPin';
import LocationPin from '../../components/event/LocationPin';
import Sidebar from '@components/sidebar/Sidebar';
import Timeline from '../../components/timeline/Timeline';
import defaultMap from '@assets/defaultMap.jpg';
import { EditContext } from './EditContext';
import { MainContext } from '../../MainContext';

function Edit() {
	const {
		map,
		events,
		renderableEvents,
		setEvents,
		updateEvent,
		locations,
		setLocations,
		updateLocation,

		sidebarState,
		draggingEvent,
		setDraggingEvent,
		zoomLevel,
		zoomIn,
		zoomOut,
		mapPosition,
		setMapPosition,
		mapTranslation,
		setMapTranslation,

		toggleSidebar,
	} = useContext(EditContext);

	const { setError } = useContext(MainContext);

	// State to handle the map's position

	const [isDragging, setIsDragging] = useState(false);
	const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });

	const mapArticleRef = useRef(null);

	useEffect(() => {
		if (draggingEvent) setIsDragging(false);
	}, [draggingEvent]);

	useEffect(() => {
		updateMapPosition();
	}, [sidebarState]);

	const updateMapPosition = () => {
		if (
			(sidebarState.event || sidebarState.location) &&
			mapArticleRef.current
		) {
			const mapWrapper =
				mapArticleRef.current.querySelector('.mapWrapper');
			const { width, height } = mapWrapper.getBoundingClientRect();
			const wrapperWidth = Math.round(width);
			const wrapperHeight = Math.round(height);

			const eventX =
				sidebarState.event?.position?.x ??
				sidebarState.location?.position?.x ??
				0;
			const eventY =
				sidebarState.event?.position?.y ??
				sidebarState.location?.position?.y ??
				0;

			setMapPosition({
				x: wrapperWidth / (2 * 1.5),
				y: wrapperHeight / (2 * 1.5),
			});
			setMapTranslation({ x: -eventX, y: -eventY });
		}
	};

	const handleWheel = (e) => {
		if (e.deltaY > 0) {
			zoomOut();
		} else {
			zoomIn();
		}
	};

	const handleDrop = (e) => {
		e.preventDefault();

		document.querySelectorAll('.mapWrapper .mapPoint').forEach((el) => {
			el.classList.remove('dragging');
		});

		const { left, top, width, height } = e.target.getBoundingClientRect();
		const newPosition = {
			x: ((e.clientX - left) / width) * 100,
			y: ((e.clientY - top) / height) * 100,
		};

		if (draggingEvent) {
			const [type, id] = draggingEvent;

			if (type === 'location') {
				if (id === 'new') {
					addNewLocation(newPosition);
				} else {
					updateExistingLocation(id, newPosition);
				}
			} else if (type === 'event') {
				if (id === 'new') {
					addNewEvent(newPosition);
				} else {
					updateExistingEvent(id, newPosition);
				}
			}

			setDraggingEvent(null);
		}
	};

	// Helper functions

	const addNewLocation = (position) => {
		setLocations((prevLocations) => [...prevLocations, { position }]);
		console.log(sidebarState);
		toggleSidebar({
			mode: 'edit',
			location: { position },
		});
	};

	const updateExistingLocation = (locationId, position) => {
		const index = locations.findIndex(
			(loc) => loc.locationId === locationId
		);
		if (locations[index].events && locations[index].events?.length !== 0) {
			setError({
				errorCode: 25,
				errorText: 'Locations with events cannot be moved!',
			});
		} else {
			const updatedLocations = [...locations];
			updatedLocations[index] = {
				...updatedLocations[index],
				position,
			};
			updateLocation(updatedLocations[index]);
		}
	};

	const addNewEvent = (position) => {
		setEvents((prevEvents) => [...prevEvents, { position }]);
		toggleSidebar({
			mode: 'edit',
			event: { position },
		});
	};

	const updateExistingEvent = (eventId, position) => {
		const index = events.findIndex((ev) => ev.eventId === eventId);
		if (index === -1) return; // Safety check

		const updatedEvents = [...events];
		updatedEvents[index] = {
			...updatedEvents[index],
			position,
		};
		updateEvent(updatedEvents[index]);
	};

	const handleImageError = (event) => {
		if (event.target.src.split('/').pop() !== 'default') {
			console.log(event.target.src);
			setError({
				errorCode: 40,
				errorText:
					"We couldn't find your map, here is the default instead",
			});
		}

		event.target.src = defaultMap;
	};

	const handleMouseDown = (e) => {
		if (e.target.className !== 'map') return;
		setIsDragging(true);
		setLastMousePosition({ x: e.clientX, y: e.clientY });
	};

	const handleMouseMove = (e) => {
		if (!isDragging || draggingEvent || e.target.className !== 'map')
			return;
		const deltaX = e.clientX - lastMousePosition.x;
		const deltaY = e.clientY - lastMousePosition.y;
		setMapPosition((prevPosition) => ({
			x: prevPosition.x + deltaX,
			y: prevPosition.y + deltaY,
		}));
		setLastMousePosition({ x: e.clientX, y: e.clientY });
	};

	const handleMouseUp = () => {
		setIsDragging(false);
	};

	const renderMap = () => {
		if (map) {
			return (
				<article
					ref={mapArticleRef}
					className="mapArticle"
					onDragOver={(e) => {
						e.preventDefault();
					}}
					onDrop={handleDrop}
					onWheel={handleWheel}
					onMouseUp={handleMouseUp}>
					<div
						className="mapWrapper"
						onMouseDown={handleMouseDown}
						onMouseMove={handleMouseMove}
						onMouseUp={handleMouseUp}
						style={{
							transition: `${isDragging ? '' : 'transform 0.3s'}`,
							scale: `${zoomLevel / 100}`,
							transform: `translate(${mapPosition.x}px, ${mapPosition.y}px) translate(${mapTranslation.x}%, ${mapTranslation.y}%) `,
							cursor: `${isDragging ? 'grabbing' : 'grab'}`,
						}}>
						<img
							src={map.map}
							onError={handleImageError}
							alt="your map"
							className="map"
						/>
						{renderLocations()}
						{renderEvents()}
					</div>

					<a
						className="defaultAttribution"
						href="https://www.freepik.com/free-vector/ancient-abstract-earth-relief-old-map-generated-conceptual-vector-elevation-map-fantasy-landscape_25145565.htm#query=fantasy%20map&position=0&from_view=keyword&track=ais_hybrid&uuid=1d282c7f-1ee4-42fc-b720-6086b25c7df6">
						Default Image by GarryKillian on Freepik
					</a>
				</article>
			);
		} else {
			return <p>Oops, where is the map?</p>;
		}
	};

	const renderEvents = () => {
		if (!renderableEvents.length) {
			return null;
		}
		return renderableEvents.map((ev, index) => (
			<EventPin key={index} event={ev} />
		));
	};

	const renderLocations = () => {
		if (!locations.length) {
			return null;
		}
		return locations.map((location, index) => (
			<LocationPin key={index} location={location} />
		));
	};

	if (!map) {
		return null;
	}

	return (
		<div className="page edit">
			<Nav />
			<main className="content">
				<Toolbar />
				{renderMap()}
				<Sidebar />
				<Timeline />
			</main>
		</div>
	);
}

export default Edit;
