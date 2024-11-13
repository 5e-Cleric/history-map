import { useContext } from 'react';
import { EditContext } from '@pages/editMap/EditContext';

function ViewEvent() {
	const {
		sidebarState,
		deleteEvent,
		toggleSidebar,
	} = useContext(EditContext);

	const event = sidebarState.event;

	return (
		<div className="event view">
			<h2 className="title">{event.title}</h2>
			<small className="date">
				{event.date.year || '0'}/{event.date.month || '0'}/
				{event.date.week || '0'}/{event.date.day || '0'}
			</small>
			<p className="description">
				{event.description || 'No description.'}
			</p>
			<div className="sidebarActions">
				<button
					className="green edit"
					onClick={() =>toggleSidebar({mode: 'edit',event: event})}>
					Edit
				</button>
				<button
					onClick={() => {
						if (
							window.confirm(
								`Are you sure you want to delete ${event.title}?`
							)
						) {
							deleteEvent(event);
						}
					}}
					className="red delete">
					Delete
				</button>
			</div>
		</div>
	);
}

export default ViewEvent;