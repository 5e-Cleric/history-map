import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';
import './editMap.css';
import Nav from '@components/nav/Nav';
import Toolbar from '@components/toolbar/Toolbar';
import EventPin from '@components/event/EventPin';
import Location from '../../components/event/Location';
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
		mapPosition,
		setMapPosition,
		mapTranslation,
		setMapTranslation,

		toggleSidebar,
	} = useContext(EditContext);

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

	const checkIfEventClose = (newPosition) => {
		//check if the new position for this event coincides with the position of another event, with a changeable margin of error

		const marginOfError = 5;
		const otherEvents = events.filter(
			(event) => event.eventId !== draggingEvent
		);
		const coincidingEvent = otherEvents.find((otherEvent) => {
			const distance = Math.sqrt(
				Math.pow(newPosition.y - otherEvent.position.y, 2) +
					Math.pow(newPosition.x - otherEvent.position.x, 2)
			);
			return distance < marginOfError;
		});
		return coincidingEvent;
	};

	const handleDrop = (e) => {
		e.preventDefault();

		document.querySelectorAll('.mapWrapper .eventPin').forEach((ev) => {
			ev.classList.remove('dragging');
		});
		const mapRect = e.target.getBoundingClientRect();
		const newPosition = {
			x: ((e.clientX - mapRect.left) / mapRect.width) * 100,
			y: ((e.clientY - mapRect.top) / mapRect.height) * 100,
		};

		if (draggingEvent) {
			if (draggingEvent === 'new') {
				// Handle creating a new event
				setDropPosition(newPosition);

				setEvents((prevEvents) => {
					return [...prevEvents, { position: newPosition }];
				});
				console.log(events);
				toggleSidebar({
					mode: 'edit',
					event: { position: newPosition },
				});
			} else {
				const index = events.findIndex(
					(ev) => ev.eventId === draggingEvent
				);
				handleDragEnd(index, newPosition);
			}
			setDraggingEvent(null);
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
			return <p>{error}</p>;
		}
	};

	const renderEvents = () => {
		if (!events.length) {
			return null;
		}
		return events.map((ev, index) => <EventPin key={index} event={ev} />);
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
