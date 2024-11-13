import { useContext } from 'react';
import { EditContext } from '@pages/editMap/EditContext';
import EventPin from '@components/event/EventPin';

function ViewLocation() {
	const { sidebarState, deleteLocation, toggleSidebar } = useContext(EditContext);

	const location = sidebarState.location;

	return (
		<div className="location view">
			<h2 className="title">{location.title}</h2>
			<p className="description">
				{location.description || 'No description.'}
			</p>
			<h3>Events in this location:</h3>
			<div className="events">
				{location.events?.map((ev, index) => (
					<div className="event" key={index}>
						<EventPin event={ev} />
                        {ev.title}
					</div>
				))}
			</div>
			<div className="sidebarActions">
				<button
					className="green edit"
					onClick={() =>toggleSidebar({mode: 'edit',location: location})}>
					Edit
				</button>
				<button
					onClick={() => {
						if (
							window.confirm(
								`Are you sure you want to delete ${location.title}?`
							)
						) {
							deleteLocation(location);
						}
					}}
					className="red delete">
					Delete
				</button>
			</div>
		</div>
	);
}

export default ViewLocation;
