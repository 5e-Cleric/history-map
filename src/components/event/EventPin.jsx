import { useState, useContext } from 'react';
import { EditContext } from '../../pages/editMap/EditContext';

function EventPin({ event, timelineEventPosition, onDragStart }) {
	const {
		sidebarState,

		toggleSidebar,
	} = useContext(EditContext);

	const [dragging, setDragging] = useState(false);
	const active =
		JSON.stringify(event.eventId) ===
		JSON.stringify(sidebarState.event?.eventId);

	if (!timelineEventPosition) {
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
						toggleSidebar({ mode: 'viewEvent', event: event })
					}
				>
					<i className="fa-solid fa-location-dot"></i>
				</div>
			</>
		);
	} else {
		console.log(timelineEventPosition);
		if (!event.date) {
			return (
				<>
					<div
						className={`eventPin${active ? ' active' : ''}`}
						style={{
							top: `${event.position.top}%`,
							left: `${timelineEventPosition.left}%`,
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
						toggleSidebar({ mode: 'viewEvent', event: event })
					}
				>
					<i className="fa-solid fa-location-dot"></i>
				</div>
			</>
		);
	}
}

export default EventPin;
