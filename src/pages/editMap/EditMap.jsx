import React, { useState, useEffect } from 'react';
import './editMap.css';
import Nav from '@components/nav/Nav';
import Toolbar from '@components/toolbar/Toolbar';
import EventPin from '@components/event/EventPin';
import Sidebar from '@components/sidebar/Sidebar';
import Timeline from '../../components/timeline/Timeline';
import defaultMap from '@assets/defaultMap.jpg';

function Edit() {
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

	const handleDragOver = (event) => {
		event.preventDefault();
	};

	const handleDragStart = (eventId) => {
		setDraggingEvent(eventId);
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
			// Handle creating a new event
			setDropPosition(newPosition);
			setEvents((prevEvents) => {
				return [...prevEvents, { position: newPosition }];
			});
			handleSidebarToggle({
				mode: 'editEvent',
				event: { position: newPosition },
			});
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

	const handleEvent = async (newEvent) => {
		console.log(newEvent);
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

	const handleImageError = (event) => {
		event.target.src = defaultMap;
	};

	const renderMap = () => {
		if (map) {
			return (
				<article
					className="mapArticle"
					onDragOver={handleDragOver}
					onDrop={handleDrop}
				>
					<img
						src={map.map}
						onError={handleImageError}
						alt="your map"
						className="map"
					/>
					<a className='defaultAttribution' href="https://www.freepik.com/free-vector/ancient-abstract-earth-relief-old-map-generated-conceptual-vector-elevation-map-fantasy-landscape_25145565.htm#query=fantasy%20map&position=0&from_view=keyword&track=ais_hybrid&uuid=1d282c7f-1ee4-42fc-b720-6086b25c7df6">
						Default Image by GarryKillian on Freepik
					</a>

					<div className="events">{renderEvents(events)}</div>
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
			<EventPin
				key={index}
				event={event}
				index={index}
				onDragStart={() => handleDragStart(event.eventId)}
				onDragEnd={handleDragEnd}
				onDelete={fetchEvents}
				onSidebarToggle={handleSidebarToggle}
				active={
					JSON.stringify(event.eventId) ===
					JSON.stringify(sidebarState.event?.eventId)
				}
			/>
		));
	};

	const handleSidebarToggle = (newSidebarState) => {
		if (JSON.stringify(newSidebarState) === JSON.stringify(sidebarState))
			setSidebar(false);
		else setSidebar(newSidebarState);
		setDropPosition(null);
	};

	const handleTimelineToggle = () => {
		setTimeline(!timelineState);
	};

	if (!map) {
		return;
	}

	return (
		<div className="page edit">
			<Nav />
			<main className="content">
				<Toolbar
					onSidebarToggle={handleSidebarToggle}
					onTimelineToggle={handleTimelineToggle}
				/>

				{renderMap()}
				<Sidebar
					onSubmit={handleEvent}
					mode={sidebarState.mode}
					event={sidebarState.event}
					map={map}
					onDelete={fetchEvents}
					onSidebarToggle={handleSidebarToggle}
				/>
				<Timeline
					timelineState={timelineState}
					map={map}
					mapEvents={events}
				/>
			</main>
		</div>
	);
}

export default Edit;
