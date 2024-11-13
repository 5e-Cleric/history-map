import { useContext } from 'react';
import { EditContext } from '@pages/editMap/EditContext';
import EventPin from '@components/event/EventPin';

function ViewLocation() {
	const { sidebarState } = useContext(EditContext);

	const location = sidebarState.location;

	return (
		<div className="location view">
			<h2 className="title">{location.title}</h2>

			<div className="events">
				{location.events?.map((ev, index) => (
					<div className="event" key={index}>
						<EventPin event={ev} />
                        {ev.title}
					</div>
				))}
			</div>
		</div>
	);
}

export default ViewLocation;
