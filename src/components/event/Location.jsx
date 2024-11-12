import { useContext } from 'react';
import { EditContext } from '@pages/editMap/EditContext';

function Location({ folder }) {
	const { toggleSidebar, sidebarState, setZoomLevel } =
		useContext(EditContext);
	const active =
		JSON.stringify(folder) === JSON.stringify(sidebarState.folder);

	return (
		<div
			className={`location ${active ? 'active' : ''}`}
			onClick={() => {
				toggleSidebar({ mode: 'view', folder: folder });
				setZoomLevel(150);
			}}
			data-title={folder.title}
			style={{
				top: `${folder.position.y}%`,
				left: `${folder.position.x}%`,
				translate: `-50% -80%`,
			}}>
			<i className="fa-solid fa-location-dot"></i>
		</div>
	);
}

export default Location;
