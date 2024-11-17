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
			<div className="titleWrapper">
				<h2 className="title">{location.title}</h2>
				<button
					onClick={() => {
						//replace hash with location.locationId
						const newHash = window.location.split('#')[0] + '#' + location.locationId;
						navigator.clipboard.writeText(newHash);
					}}
					className="share"
					title="copy direct link to location">
					<i className="fa-solid fa-link"></i>
				</button>
			</div>

			<p className="description">{location.description || 'No description.'}</p>
			<br />
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
