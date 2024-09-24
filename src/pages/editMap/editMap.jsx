import React, { useState, useEffect } from 'react';
import Nav from '@components/nav/Nav';
import './editMap.css';
import Toolbar from '@components/toolbar/toolbar';
import EventPin from '@components/event/eventPin';
import Sidebar from '@components/sidebar/Sidebar';
import Timeline from '../../components/timeline/timeline';

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
						`http://localhost:3050/api/map/${urlId}`
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
				`http://localhost:3050/api/event/${urlId}`
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
		updateEventPosition(updatedEvents[index]);
	};

	const createEvent = async (newEvent) => {
		console.log(newEvent);
		await saveNewEvent(newEvent);
		fetchEvents();
	};

	const saveNewEvent = async (event) => {
		try {
			const response = await fetch(
				`http://127.0.0.1:3050/api/event/${urlId}`,
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

	const updateEventPosition = async (event) => {
		try {
			const response = await fetch(
				`http://127.0.0.1:3050/api/event/${urlId}/${event.eventId}`, // Ensure the correct endpoint for updating
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

	const renderMap = () => {
		if (map) {
			return (
				<article
					className="mapArticle"
					onDragOver={handleDragOver}
					onDrop={handleDrop}
				>
					<img src={map.map} alt="your map" className="map" />
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
					onSubmit={createEvent}
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
