import { useState, useContext } from 'react';
import { EditContext } from '../../pages/editMap/EditContext';

function EventPin({ event, timelineEventPosition }) {
	const {
		draggingEvent,
		setDraggingEvent,
		sidebarState,
		setZoomLevel,

		toggleSidebar,
	} = useContext(EditContext);
	const [timelinePosition, setTimelinePosition] = useState(timelineEventPosition);

	const active =
		JSON.stringify(event.eventId) ===
		JSON.stringify(sidebarState.event?.eventId);

	const handleDrag = (e) => {
		e.preventDefault();
		const timelineRect =
			e.currentTarget.parentElement.getBoundingClientRect();
		const newPosition =
			((e.clientX - timelineRect.left) / timelineRect.width) * 100;
		//set min position at 0% and max at 100
		setTimelinePosition(Math.max(0, Math.min(newPosition, 100)));
	};

	if (!timelineEventPosition && timelineEventPosition !== 0) {
		if (!event.date) {
			return (
				<div
					className={`eventPin${active ? ' active' : ''}`}
					style={{
						top: `${event.position.top}%`,
						left: `${event.position.left}%`,
						translate: `-50% -80%`,
					}}
				>
					<i className="fa-solid fa-location-dot"></i>
				</div>
			);
		}

		const handleDragStart = (e) => {
			setDraggingEvent(event.eventId);
			e.stopPropagation();
		};

		return (
			<div
				id={`event-${event.eventId}`}
				className={`eventPin${active ? ' active' : ''}`}
				style={{
					top: `${event.position.top}%`,
					left: `${event.position.left}%`,
					translate: `-50% -80%`,
				}}
				draggable
				onDragStart={handleDragStart}
				onClick={(e) => {
					toggleSidebar({ mode: 'viewEvent', event: event });
					setZoomLevel(150);
					e.stopPropagation();
				}}
			>
				<i className="fa-solid fa-location-dot"></i>
			</div>
		);
	} else {
		if (!event.date) {
			return (
				<div
					className={`eventPin${active ? ' active' : ''}${
						draggingEvent ? dragging : ''
					}`}
					style={{
						top: `50%`,
						left: `${timelineEventPosition || 0}%`,
						translate: `0 -50%`,
					}}
				>
					<i className="fa-solid fa-sun"></i>
				</div>
			);
		}

		const handleDragStart = (e) => {
			setDraggingEvent(event.eventId);
			const img = new Image();
			img.src = '';
			e.dataTransfer.setDragImage(img, 0, 0);
		};

		return (
			<div
				id={`event-${event.eventId}`}
				className={`eventPin${active ? ' active' : ''}${
					draggingEvent ? ' dragging' : ''
				}`}
				style={{
					left: `${timelinePosition}%`,
				}}
				draggable
				onDrag={handleDrag}
				onDragStart={handleDragStart}
				onClick={() => {
					toggleSidebar({ mode: 'viewEvent', event: event });
					setZoomLevel(150);
				}}
			>
				<i className="fa-solid fa-sun"></i>
			</div>
		);
	}
}

export default EventPin;
