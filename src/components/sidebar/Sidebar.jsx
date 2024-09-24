import React, { useEffect, useState, useRef } from 'react';
import './sidebar.css'; // Change the stylesheet name accordingly
import CustomDate from '@components/customDate/CustomDate'; // Import the custom date component

function Sidebar({ onSubmit, mode, event, map, onSidebarToggle, onDelete }) {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [position, setPosition] = useState({ top: null, left: null });
	const dateRef = useRef(null);

	useEffect(() => {
		if (mode === 'editEvent' && event) {
			if (event.eventId) {
				setTitle(event.title);
				setDescription(event.description);
				dateRef.current.setValues(event.date);
			}
			setPosition(event.position);
		} else if (mode === 'map') {
			// Reset fields for map mode
			setTitle('');
			setDescription('');
		}
	}, [mode, event]);

	const handleSubmit = (e) => {
		e.preventDefault();

		const eventData = {
			title,
			description,
			position,
			date: dateRef.current.getValues(),
		};

		if (mode === 'editEvent' && event) {
			// Pass the event id if editing
			onSubmit({ ...eventData, eventId: event.eventId });
		} else {
			// Handle create event if no event object is passed
			onSubmit(eventData);
		}
		onSidebarToggle({ mode: mode, event: event })
	};

	const deleteEvent = async () => {
		try {
			const eventResponse = await fetch(
				`${import.meta.env.VITE_API_URL}/api/event/${event.mapId}/${event.eventId}`,
				{ method: 'DELETE' }
			);

			if (!eventResponse.ok) {
				throw new Error('Failed to delete event');
			}

			const eventData = await eventResponse.json();
			console.log('Event deleted successfully', eventData);
			onDelete();
		} catch (error) {
			console.error('Error deleting event:', error);
		}
	};

	const renderContent = () => {
		switch (mode) {
			case 'editEvent':
				return (
					<div className="event edit">
						<form className="form" onSubmit={handleSubmit}>
							<label className="fieldGroup">
								Event title:
								<input
									type="text"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									required
								/>
							</label>
							<label className="fieldGroup">
								Description:
								<textarea
									value={description}
									onChange={(e) =>
										setDescription(e.target.value)
									}
									required
								></textarea>
							</label>
							<label className="fieldGroup">
								Event Date:
								<CustomDate ref={dateRef} dataType="date" />
							</label>
							<button type="submit" className="green">
								{!event ? 'Create event' : 'Edit event'}
							</button>
						</form>
					</div>
				);
			case 'viewEvent':
				return (
					<div className="event view">
						<h2 className="title">{event.title}</h2>
						<small className="date">
							{event.date.year}/{event.date.month}/
							{event.date.week}/{event.date.day}
						</small>
						<p className="description">
							{event.description || 'No description.'}
						</p>
						<div className="sidebarActions">
							<button
								className="green edit"
								onClick={() =>
									onSidebarToggle({
										mode: 'editEvent',
										event: event,
									})
								}
							>
								Edit
							</button>
							<button
								onClick={() => {
									if (
										window.confirm(
											`Are you sure you want to delete ${event.title}?`
										)
									) {
										deleteEvent();
									}
								}}
								className="red delete"
							>
								Delete
							</button>
						</div>
					</div>
				);
			default:
				return (
					<>
						<h2 className="title">{map.title}</h2>
						<dl>
							<dt>Description:</dt>
							<dd>
								<p>{map.description || 'No description.'}</p>
							</dd>
							<dt>Author:</dt>
							<dd>
								<p>{map.author || 'No Author.'}</p>
							</dd>
						</dl>
						<button
							onClick={() => {
								if (
									confirm(
										'Are you sure you want to delete it? You will not be able to bring it back.'
									)
								) {
									deleteMap(map.mapId);
								}
							}}
							className="red deleteMap"
						>
							Delete world
						</button>
					</>
				);
		}
	};

	return (
		<aside className={`sidebar ${mode ? 'open' : ''}`}>
			<div className="sidebarContent">
				<button
					className="closeButton"
					onClick={() =>
						onSidebarToggle({ mode: mode, event: event })
					}
				>
					X
				</button>
				{renderContent()}
			</div>
		</aside>
	);
}

export default Sidebar;
