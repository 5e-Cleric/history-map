import { useContext, useEffect, useState } from 'react';
import './timeline.css';
import EventPin from '../event/EventPin';
import { EditContext } from '@pages/editMap/EditContext';
import {
	convertToTotalDays,
	positionToTime,
	calculateDynamicInterval,
	incrementToNextRoundDate,
} from './dateFunctions.helpers.js';

function Timeline() {
	const {
		map,
		events,
		fetchEvents,
		sidebarState,
		timelineState,
		updateEvent,
		draggingEvent,
		setDraggingEvent,

		//other functions
		toggleSidebar,
		toggleTimeline,
	} = useContext(EditContext);

	const [timelineEvents, setTimelineEvents] = useState(events);

	useEffect(() => {
		if (events) setTimelineEvents(events.filter((event) => event.date));
	}, [events]);

	if (
		!map ||
		!map.dateSystem ||
		!map.dateSystem.dateStart ||
		!map.dateSystem.dateEquivalences ||
		!events ||
		events.length < 2
	) {
		return (
			<article className={`timeline ${timelineState ? 'open' : ''}`}>
				<h2>You need at least two events to use the timeline</h2>
				<div className="bar"></div>
			</article>
		);
	}

	const equivalences = map.dateSystem.dateEquivalences;
	const getLastDate = () => {
		const eventsToCheck =
			timelineEvents && timelineEvents.length > 0
				? timelineEvents
				: events;

		const lastEvent = eventsToCheck.reduce((latest, current) =>
			convertToTotalDays(current.date, equivalences) >
			convertToTotalDays(latest.date, equivalences)
				? current
				: latest
		);

		return lastEvent?.date || null;
	};

	const startDate = map.dateSystem.dateStart;
	const lastDate = getLastDate();

	const totalTimelineDays =
		convertToTotalDays(lastDate, equivalences) -
		convertToTotalDays(startDate, equivalences);

	const getDivisionsArray = () => {
		const divisions = [];
		const intervalDays = calculateDynamicInterval(
			totalTimelineDays,
			equivalences
		);

		let currentDate = { ...startDate };

		while (
			convertToTotalDays(currentDate, equivalences) <=
			convertToTotalDays(lastDate, equivalences)
		) {
			divisions.push(currentDate);
			currentDate = incrementToNextRoundDate(
				currentDate,
				intervalDays,
				equivalences
			);
		}

		return divisions;
	};

	const rendertimelineEvents = () => {
		return (
			<div
				className={`timelineDrop`}
				onDragOver={(e) => {
					e.preventDefault();
				}}
				onDrop={handleDrop}>
				<div className="events">
					{timelineEvents.map((event, index) => {
						const eventDays = convertToTotalDays(
							event.date,
							equivalences
						);
						const eventPositionPercent =
							((eventDays -
								convertToTotalDays(startDate, equivalences)) /
								totalTimelineDays) *
							100;

						return (
							<EventPin
								key={index}
								event={event}
								timelineEventPosition={
									eventPositionPercent || 0
								}
							/>
						);
					})}
				</div>
			</div>
		);
	};

	const handleDrop = (e) => {
		e.preventDefault();
		const timelineRect = e.currentTarget.getBoundingClientRect();
		const newPosition =
			((e.clientX - timelineRect.left) / timelineRect.width) * 100;
		const index = events.findIndex((e) => e.eventId === draggingEvent);

		const newDate = positionToTime(
			newPosition,
			startDate,
			totalTimelineDays,
			equivalences
		);

		events[index] = {
			...events[index],
			date: newDate,
		};
		updateEvent(events[index]);
		setDraggingEvent(null);
		if (sidebarState?.event?.eventId === events[index].eventId)
			toggleSidebar({ mode: 'view', event: events[index] });
		fetchEvents();
	};

	return (
		<article className={`timeline ${timelineState ? 'open' : ''}`}>
			<div className="bar">
				<div className="years">
					{getDivisionsArray().map((division, index) => {
						const divisionDays = convertToTotalDays(
							division,
							equivalences
						);
						const divisionPositionPercent =
							((divisionDays -
								convertToTotalDays(startDate, equivalences)) /
								totalTimelineDays) *
							100;

						return (
							<div
								key={index}
								className="division"
								style={{
									left: `${divisionPositionPercent}%`,
								}}>
								{division.year || '0'}/{division.month || '0'}/
								{division.week || '0'}/{division.day || '0'}
							</div>
						);
					})}
				</div>
			</div>
			{rendertimelineEvents()}
			<button
				className="closeButton"
				onClick={() => toggleTimeline(false)}>
				X
			</button>
		</article>
	);
}

export default Timeline;
