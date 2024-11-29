import { useContext } from 'react';
import { EditContext } from '@pages/editMap/EditContext';
import { ContextMenuTrigger } from 'rctx-contextmenu';
import { MainContext } from '../../MainContext';

function LocationPin({ location }) {
	const { setDraggingEvent, toggleSidebar, sidebarState, setZoomLevel } = useContext(EditContext);
	const active = JSON.stringify(location) === JSON.stringify(sidebarState.location);

	const handleDragStart = (e) => {
		if (!location.locationId) return;
		setDraggingEvent(['location', location.locationId]);
		document.querySelectorAll(`.mapWrapper .mapPoint:not(#location-${location.locationId})`).forEach((ev) => {
			ev.classList.add('dragging');
		});
		//e.stopPropagation();
	};

	const handleClick = (e) => {
		if (!location.locationId) return;
		toggleSidebar({ mode: 'view', location: location });
		setZoomLevel(150);
		//e.stopPropagation();
	};

	return (
		<div
			id={`location-${location.locationId}`}
			data-title={location.title}
			className={`mapPoint locationPin ${active ? 'active' : ''}`}
			draggable
			onDragStart={handleDragStart}
			onClick={handleClick}
			onContextMenu={() => {
				console.log('a');
			}}
			style={{
				top: `${location.position.y}%`,
				left: `${location.position.x}%`,
				translate: `-50% -80%`,
			}}>
			<ContextMenuTrigger
				id="menu-location">
				<i className="fa-solid fa-map-pin"></i>
			</ContextMenuTrigger>
		</div>
	);
}

export default LocationPin;
