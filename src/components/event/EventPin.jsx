import { useState, useContext } from 'react';
import { EditContext } from '@pages/editMap/EditContext';
import { MainContext } from '../../MainContext';

function EventPin({ event, timelineEventPosition, inLocation }) {
	const { setDraggingEvent, sidebarState, setZoomLevel, toggleSidebar } =
		useContext(EditContext);

	const { setError } = useContext(MainContext);

	const [timelinePosition, setTimelinePosition] = useState(
		timelineEventPosition
	);
	const active =
		JSON.stringify(event.eventId) ===
		JSON.stringify(sidebarState.event?.eventId);
	const isTimelineMode = timelineEventPosition !== undefined;

	const handleDrag = (e) => {
		e.preventDefault();
		const timelineRect =
			e.currentTarget.parentElement.getBoundingClientRect();
		const newPosition =
			((e.clientX - timelineRect.left) / timelineRect.width) * 100;
		setTimelinePosition(Math.max(0, Math.min(newPosition, 100))); // Constrain position to 0-100%
	};

	const handleDragStart = (e) => {
		if (active) {
			setError({
				errorCode: 11,
				errorText: "Can't move events while they are active",
			});
		} else {
			setDraggingEvent(['event', event.eventId]);
			document
				.querySelectorAll(
					`.mapWrapper .mapPoint:not(#event-${event.eventId})`
				)
				.forEach((ev) => {
					ev.classList.add('dragging');
				});
		}
		e.stopPropagation();
	};

	const handleClick = (e) => {
		if (!event.eventId) return;
		if (inLocation)
			toggleSidebar({ mode: 'view', event, location: inLocation });
		else toggleSidebar({ mode: 'view', event });
		setZoomLevel(150);
		e.stopPropagation();
	};

	const positionStyles = isTimelineMode
		? { left: `${timelinePosition}%`, translate: '0 -50%' }
		: {
				top: `${event.position.y}%`,
				left: `${event.position.x}%`,
				translate: '-50% -80%',
		  };

	return (
		<div
			id={`event-${event.eventId}`}
			data-title={event.title}
			className={`mapPoint eventPin${active ? ' active' : ''} `}
			draggable
			onDrag={isTimelineMode ? handleDrag : undefined}
			onDragStart={handleDragStart}
			onClick={handleClick}
			style={positionStyles}>
			<i className="fa-solid fa-sun"></i>
		</div>
	);
}

export default EventPin;
