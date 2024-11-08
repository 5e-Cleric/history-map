import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';
import './editMap.css';
import Nav from '@components/nav/Nav';
import Toolbar from '@components/toolbar/Toolbar';
import EventPin from '@components/event/EventPin';
import Sidebar from '@components/sidebar/Sidebar';
import Timeline from '../../components/timeline/Timeline';
import defaultMap from '@assets/defaultMap.jpg';
import { EditContext } from './EditContext';

function Edit() {
	const {
		map,
		events,
		setEvents,
		error,
		sidebarState,
		setDropPosition,
		draggingEvent,
		setDraggingEvent,
		handleDragEnd,
		zoomLevel,
		zoomIn,
		zoomOut,
		setZoomLevel,

		toggleSidebar,
	} = useContext(EditContext);

	// State to handle the map's position
	const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });
	const [mapTranslation, setMapTranslation] = useState({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState(false);
	const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });

	const mapArticleRef = useRef(null);

	useEffect(() => {
		if (draggingEvent) setIsDragging(false);
	}, [draggingEvent]);

	useEffect(() => {
		updateMapPosition();
	}, [sidebarState.event]);
	
	const updateMapPosition = () => {
		if (sidebarState.event && mapArticleRef.current) {
			const mapWrapper =
				mapArticleRef.current.querySelector('.mapWrapper');
			const { width, height } = mapWrapper.getBoundingClientRect();
			
			const wrapperWidth = Math.round(width);
			const wrapperHeight = Math.round(height);

			const eventX = sidebarState.event.position.left;
			const eventY = sidebarState.event.position.top;

			//move top left mapwrapper corner into the center of the page (accounting for zoom)
			//then apply the percentual translation
			setZoomLevel(150);

			setMapPosition({ x: (wrapperWidth / (2*1.5)) + 100, y: (wrapperHeight / (2*1.5))});
			setMapTranslation({ x: -eventX, y: -eventY, });
		}
	};

	const handleWheel = (e) => {
		if (e.deltaY > 0) {
			zoomOut();
		} else {
			zoomIn();
		}
	};

	const handleDrop = (event) => {
		event.preventDefault();
		const mapRect = event.target.getBoundingClientRect();
		const newPosition = {
			top: ((event.clientY - mapRect.top) / mapRect.height) * 100,
			left: ((event.clientX - mapRect.left) / mapRect.width) * 100,
		};
		if (draggingEvent) {
			const index = events.findIndex((e) => e.eventId === draggingEvent);
			handleDragEnd(index, newPosition);
			setDraggingEvent(null);
		} else {
			if (sidebarState.mode === 'editEvent') {
			}
			// Handle creating a new event
			setDropPosition(newPosition);
			setEvents((prevEvents) => {
				return [...prevEvents, { position: newPosition }];
			});
			toggleSidebar({
				mode: 'editEvent',
				event: { position: newPosition },
			});
		}
	};

	const handleImageError = (event) => {
		event.target.src = defaultMap;
	};

	const handleMouseDown = (e) => {
		setIsDragging(true);
		setLastMousePosition({ x: e.clientX, y: e.clientY });
	};

	const handleMouseMove = (e) => {
		if (!isDragging || draggingEvent) return;
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
				>
					<div
						className="mapWrapper"
						onMouseDown={handleMouseDown}
						onMouseMove={handleMouseMove}
						onMouseUp={handleMouseUp}
						style={{
							transition: `${isDragging ? '' : 'transform 0.3s'}`,
							scale: `${zoomLevel / 100}`,
							transform: `translate(${mapPosition.x}px, ${mapPosition.y}px) translate(${mapTranslation.x}%, ${mapTranslation.y}%) `,
						}}
					>
						<img
							src={map.map}
							onError={handleImageError}
							alt="your map"
							className="map"
						/>
						{renderEvents(events)}
					</div>

					<a
						className="defaultAttribution"
						href="https://www.freepik.com/free-vector/ancient-abstract-earth-relief-old-map-generated-conceptual-vector-elevation-map-fantasy-landscape_25145565.htm#query=fantasy%20map&position=0&from_view=keyword&track=ais_hybrid&uuid=1d282c7f-1ee4-42fc-b720-6086b25c7df6"
					>
						Default Image by GarryKillian on Freepik
					</a>
				</article>
			);
		} else {
			return <p>{error}</p>;
		}
	};

	const renderEvents = (events) => {
		if (!events.length) {
			return null;
		}
		return events.map((event, index) => (
			<EventPin key={index} event={event} />
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
