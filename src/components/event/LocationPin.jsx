import { useContext } from 'react';
import { EditContext } from '@pages/editMap/EditContext';

function LocationPin({ location }) {
	const { toggleSidebar, sidebarState, setZoomLevel } =
		useContext(EditContext);
	const active =
		JSON.stringify(location) === JSON.stringify(sidebarState.location);

	return (
		<div
			className={`mapPoint locationPin ${active ? 'active' : ''}`}
			onClick={() => {
				toggleSidebar({ mode: 'view', location: location });
				setZoomLevel(150);
			}}
			data-title={location.title}
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
