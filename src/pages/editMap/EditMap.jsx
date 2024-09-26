import React, { useState, useEffect, useContext } from 'react';
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

		updateEvent,

		//other functions
		toggleSidebar,
	} = useContext(EditContext);

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

	const handleDragEnd = (index, newPosition) => {
		const updatedEvents = [...events];
		updatedEvents[index] = {
			...updatedEvents[index],
			position: newPosition,
		};
		setEvents(updatedEvents);
		updateEvent(updatedEvents[index]);
	};

	const handleImageError = (event) => {
		event.target.src = defaultMap;
	};

	const renderMap = () => {
		if (map) {
			return (
				<article
					className="mapArticle"
					onDragOver={(e) => {
						e.preventDefault();
					}}
					onDrop={handleDrop}
				>
					<img
						src={map.map}
						onError={handleImageError}
						alt="your map"
						className="map"
					/>
					<a
						className="defaultAttribution"
						href="https://www.freepik.com/free-vector/ancient-abstract-earth-relief-old-map-generated-conceptual-vector-elevation-map-fantasy-landscape_25145565.htm#query=fantasy%20map&position=0&from_view=keyword&track=ais_hybrid&uuid=1d282c7f-1ee4-42fc-b720-6086b25c7df6"
					>
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
				onDragStart={() => setDraggingEvent(event.eventId)}
				onDragEnd={handleDragEnd}
			/>
		));
	};

	if (!map) {
		return;
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
