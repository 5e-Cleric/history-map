import { useContext, useEffect, useState, useRef } from 'react';
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
		timelineState,
		updateEvent,
		draggingEvent,
		setDraggingEvent,

		//other functions
		stopDrag,
		toggleTimeline,
	} = useContext(EditContext);

	const [timelineEvents, setTimelineEvents] = useState(events);

	const timelineBarRef = useRef(null);

	useEffect(() => {
		if (events) setTimelineEvents(events.filter((event) => event.date));
	}, [events]);

	if (!events || events.length < 3) {
		return (
			<article className={`timeline ${timelineState ? 'open' : ''}`}>
				<h2>You need at least three events to use the timeline</h2>
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

	if (totalTimelineDays === 0)
		return (
			<article className={`timeline ${timelineState ? 'open' : ''}`}>
				<h2>
					All your events have the same date, so there is no timeline
					to show
				</h2>
				<div className="bar"></div>
			</article>
		);

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
						const startDateDays = convertToTotalDays(
							startDate,
							equivalences
						);
						const eventPositionPercent =
							((eventDays - startDateDays) / totalTimelineDays) * 100;
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
		stopDrag();
		if ( draggingEvent[0] === 'location') {
			setDraggingEvent(null);
			return;
		}
		
		const timelineRect = timelineBarRef.current.getBoundingClientRect();
		const newPosition =
			((e.clientX - timelineRect.left) / timelineRect.width) * 100;
		const index = events.findIndex((e) => e.eventId === draggingEvent[1]);

		const newDate = positionToTime(
			newPosition,
			startDate,
			totalTimelineDays,
			equivalences
		);

		if (index !== -1) {
			events[index] = { ...events[index], date: newDate };
			updateEvent(events[index]);
		}
	};

	return (
		<article className={`timeline ${timelineState ? 'open' : ''}`}>
			<div className="bar" ref={timelineBarRef}>
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
