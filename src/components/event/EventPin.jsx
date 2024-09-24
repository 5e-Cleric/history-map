import { useState } from 'react';

function EventPin({ onSidebarToggle, event, onDragStart, active }) {
	const [dragging, setDragging] = useState(false);

	if (!event.date) {
		return (
			<>
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
			</>
		);
	}

	const handleDragStart = () => {
		setDragging(true);
		onDragStart(event.eventId); // Pass eventId
	};

	const handleDragEnd = () => {
		setDragging(false);
	};

	return (
		<>
			<div
				className={`eventPin${active ? ' active' : ''}${
					dragging ? ' dragging' : ''
				}`}
				style={{
					top: `${event.position.top}%`,
					left: `${event.position.left}%`,
					translate: `-50% -80%`,
				}}
				draggable
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
				onClick={() =>
					onSidebarToggle({ mode: 'viewEvent', event: event })
				}
			>
				<i className="fa-solid fa-location-dot"></i>
			</div>
		</>
	);
}

export default EventPin;
