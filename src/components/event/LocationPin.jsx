import { useContext } from 'react';
import { EditContext } from '@pages/editMap/EditContext';
import { MainContext } from '../../MainContext';

function LocationPin({ location }) {
	const { setDraggingEvent, toggleSidebar, sidebarState, setZoomLevel } =
		useContext(EditContext);

	const { setError } = useContext(MainContext);
	const active =
		JSON.stringify(location) === JSON.stringify(sidebarState.location);

	const handleDragStart = (e) => {
		if (active) {
			setError({
				errorCode: 11,
				errorText: "Can't move locations while they are active",
			});
		} else {
			setDraggingEvent(['location', location.locationId]);
			document
				.querySelectorAll(
					`.mapWrapper .mapPoint:not(#location-${location.locationId})`
				)
				.forEach((ev) => {
					ev.classList.add('dragging');
				});
		}
		e.stopPropagation();
	};

	const handleClick = (e) => {
		toggleSidebar({ mode: 'view', location: location });
		setZoomLevel(150);
		e.stopPropagation();
	};

	return (
		<div
			id={`location-${location.locationId}`}
			data-title={location.title}
			className={`mapPoint locationPin ${active ? 'active' : ''}`}
			draggable
			onDragStart={handleDragStart}
			onClick={handleClick}
			style={{
				top: `${location.position.y}%`,
				left: `${location.position.x}%`,
				translate: `-50% -80%`,
			}}>
			<i className="fa-solid fa-map-pin"></i>
		</div>
	);
}

export default LocationPin;
