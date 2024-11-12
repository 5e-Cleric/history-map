import {  useContext } from 'react';
import './sidebar.css';
import { EditContext } from '@pages/editMap/EditContext';
import EditEvent from './sidebarContents/EditEvent';
import ViewEvent from './sidebarContents/ViewEvent';
import EditMap from './sidebarContents/EditMap';
import ViewMap from './sidebarContents/ViewMap';
import ViewFolder from './sidebarContents/ViewFolder';

function Sidebar() {
	const { sidebarState, toggleSidebar } = useContext(EditContext);

	const mode = sidebarState.mode;
	const event = sidebarState.event;
	const folder = sidebarState.folder;

	console.log(sidebarState);

	const renderContent = () => {
		if (mode === 'edit') {
			if (event) return <EditEvent />;
			return <EditMap />;
		} else if(mode === 'view') {
			if (event) return <ViewEvent />;
			if (folder) return <ViewFolder/>;
			return <ViewMap />;
		}
		return null;
	};

	return (
		<aside className={`sidebar ${mode ? 'open' : ''}`}>
			<div className="sidebarContent">
				<button
					className="closeButton"
					onClick={() => toggleSidebar({ mode: mode, event: event })}>
					X
				</button>
				{renderContent()}
			</div>
		</aside>
	);
}

export default Sidebar;
