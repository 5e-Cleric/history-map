import { useContext, useEffect } from 'react';
import { EditContext } from '@pages/editMap/EditContext';
import EventPin from '@components/event/EventPin';

function ViewLocation() {
	const { mapId, events, sidebarState, locations, deleteLocation, toggleSidebar } = useContext(EditContext);

	const location = locations.find((loc) => loc.locationId === sidebarState.location?.locationId);

	const locationEvents = events.filter((ev) => {
		return location.events?.some((locEv) => locEv === ev.eventId);
	});

	return (
		<div className="location view">
			<h2 className="title">{location.title}</h2>
			<p className="description">{location.description || 'No description.'}</p>
			<h3>Events in this location:</h3>
			<div className="events">
				{locationEvents?.map((ev, index) => (
					<div className="event" key={index}>
						<EventPin event={ev} inLocation={location} />
						{ev.title}
					</div>
				))}
			</div>
			<small>
				Location id: <a href={`/map/${mapId}#${location.locationId}`}>{location.locationId}</a>
			</small>
			<div className="sidebarActions">
				<button className="green edit" onClick={() => toggleSidebar({ mode: 'edit', location: location })}>
					Edit
				</button>
				<button
					onClick={() => {
						if (window.confirm(`Are you sure you want to delete ${location.title}?`)) {
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
