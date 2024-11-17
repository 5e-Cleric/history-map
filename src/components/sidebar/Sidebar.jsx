import { useContext } from 'react';
import './sidebar.css';
import { EditContext } from '@pages/editMap/EditContext';
import EditEvent from './sidebarContents/EditEvent';
import ViewEvent from './sidebarContents/ViewEvent';
import EditMap from './sidebarContents/EditMap';
import ViewMap from './sidebarContents/ViewMap';
import EditLocation from './sidebarContents/EditLocation';
import ViewLocation from './sidebarContents/ViewLocation';

function Sidebar() {
	const { fetchMapContents, sidebarState, toggleSidebar } = useContext(EditContext);

	const mode = sidebarState.mode;
	const event = sidebarState.event;
	const location = sidebarState.location;

	if (!sidebarState) return;

	const renderContent = () => {
		if (mode === 'edit') {
			if (event) return <EditEvent />;
			if (location) return <EditLocation />;
			return <EditMap />;
		} else if (mode === 'view') {
			if (event) return <ViewEvent />;
			if (location) return <ViewLocation />;
			return <ViewMap />;
		}
		return null;
	};

	return (
		<aside className={`sidebar ${mode ? 'open' : ''}`}>
			<div className="sidebarWrapper">
				{sidebarState.location && sidebarState.event && (
					<button
						className="backToLocation"
						onClick={() => {
							toggleSidebar({
								mode: 'view',
								location: sidebarState.location,
							});
						}}>
						<i className="fas fa-arrow-left" />
					</button>
				)}
				<button
					className="closeButton"
					onClick={() => {
						toggleSidebar(sidebarState);
						//filter out events without an id
						if (mode === 'edit') fetchMapContents();
					}}>
					<i className="fa-solid fa-xmark"></i>
				</button>
				<div className="sidebarContent">{renderContent()}</div>
			</div>
		</aside>
	);
}

export default Sidebar;
