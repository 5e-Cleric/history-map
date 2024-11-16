import { useContext, useEffect } from 'react';
import { EditContext } from '@pages/editMap/EditContext';
import EventPin from '@components/event/EventPin';

function ViewLocation() {
	const { events, sidebarState, deleteLocation, toggleSidebar } =
		useContext(EditContext);

	const location = sidebarState.location;

	const locationEvents = events.filter((ev) => {
		return location.events?.some((locEv) => locEv === ev.eventId);
	});

	return (
		<div className="location view">
			<h2 className="title">{location.title}</h2>
			<p className="description">
				{location.description || 'No description.'}
			</p>
			<h3>Events in this location:</h3>
			<div className="events">
				{locationEvents?.map((ev, index) => (
					<div className="event" key={index}>
						<EventPin event={ev} inLocation={location} />
						{ev.title}
					</div>
				))}
			</div>
			<div className="sidebarActions">
				<button
					className="green edit"
					onClick={() =>
						toggleSidebar({ mode: 'edit', location: location })
					}>
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
