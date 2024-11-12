import { useContext } from 'react';
import { EditContext } from '@pages/editMap/EditContext';
import EventPin from '@components/event/EventPin';

function ViewFolder() {
	const { sidebarState } = useContext(EditContext);

	const folder = sidebarState.folder;

	return (
		<div className="folder view">
			<h2 className="title">{folder.title}</h2>

			<div className="events">
				{folder.events?.map((ev, index) => (
					<div className="event" key={index}>
						<EventPin event={ev} />
                        {ev.title}
					</div>
				))}
			</div>
		</div>
	);
}

export default ViewFolder;
