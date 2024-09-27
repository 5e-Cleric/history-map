import { useEffect, useState, useRef, useContext } from 'react';
import './sidebar.css';
import CustomDate from '@components/customDate/CustomDate';
import { EditContext } from '../../pages/editMap/EditContext';

function Sidebar() {
	const {
		map,
		sidebarState,
		updateMap,
		deleteMap,
		updateEvent,
		saveNewEvent,
		deleteEvent,

		toggleSidebar,
	} = useContext(EditContext);

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [position, setPosition] = useState({ top: null, left: null });
	const [mapLink, setMapLink] = useState('');
	const dateRef = useRef(null);
	const dateNamesRef = useRef(null);
	const dateEquivalencesRef = useRef(null);
	const dateStartRef = useRef(null);

	const mode = sidebarState.mode;
	const event = sidebarState.event;

	useEffect(() => {
		if (mode === 'editEvent' && event) {
			if (event.eventId) {
				setTitle(event.title);
				setDescription(event.description);
				dateRef.current.setValues(event.date);
			}
			setPosition(event.position);
		} else if (mode === 'editMap') {
			// Reset fields for map mode
			setTitle(map.title);
			setDescription(map.description);
			setMapLink(map.map);
			dateNamesRef.current.setValues(map.dateSystem.dateNames);
			dateEquivalencesRef.current.setValues(
				map.dateSystem.dateEquivalences
			);
			dateStartRef.current.setValues(map.dateSystem.dateStart);
		}
	}, [mode, event, map]);

	const handleSubmit = (e) => {
		e.preventDefault();

		if (mode === 'editMap') {
			const mapData = {
				title,
				author: map.author,
				description,
				map: mapLink,
				id: map.id ,
				dateSystem: {
					dateNames: dateNamesRef.current.getValues(),
					dateEquivalences: dateEquivalencesRef.current.getValues(),
					dateStart: dateStartRef.current.getValues(),
				},
			};

			updateMap(mapData);

			toggleSidebar({ mode: 'map', event: null });
		} else {
			const eventData = {
				eventId: event.eventId,
				title,
				description,
				position,
				date: dateRef.current.getValues(),
			};

			if (mode === 'editEvent' && event) {
				updateEvent(eventData);
			} else {
				saveNewEvent(eventData);
			}
			toggleSidebar({ mode: mode, event: event });
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
								{!event ? 'Create event' : 'Save event'}
							</button>
						</form>
					</div>
				);
			case 'viewEvent':
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
								onClick={() =>
									toggleSidebar({
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
										deleteEvent(event);
									}
								}}
								className="red delete"
							>
								Delete
							</button>
						</div>
					</div>
				);
			case 'editMap':
				return (
					<div className="event editMap">
						<form
							className="form"
							onSubmit={handleSubmit}
							id="editmap"
						>
							<label className="fieldGroup">
								Map title:
								<input
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									type="text"
								/>
							</label>
							<label className="fieldGroup">
								Paste a link to your map:
								<input
									value={mapLink}
									onChange={(e) => setMapLink(e.target.value)}
									type="text"
								/>
							</label>
							<label className="fieldGroup">
								Date system names:
								<CustomDate
									ref={dateNamesRef}
									dataType="names"
								/>
							</label>
							<label className="fieldGroup">
								Date system equivalences:
								<CustomDate
									ref={dateEquivalencesRef}
									dataType="equivalences"
								/>
							</label>
							<label className="fieldGroup">
								Starting Date:
								<CustomDate
									ref={dateStartRef}
									dataType="date"
								/>
							</label>
							<label className="fieldGroup">
								Map description:
								<textarea
									name="mapDescription"
									value={description}
									onChange={(e) =>
										setDescription(e.target.value)
									}
								></textarea>
							</label>
							<button
								type="submit"
								onSubmit={handleSubmit}
								className="green"
							>
								Save map
							</button>
						</form>
					</div>
				);
				break;
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
						<div className="sidebarActions">
							<button
								onClick={() => {
									toggleSidebar({
										mode: 'editMap',
										event: null,
									});
								}}
								className="green editMap"
							>
								Edit map
							</button>
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
								Delete map
							</button>
						</div>
					</>
				);
		}
	};

	return (
		<aside className={`sidebar ${mode ? 'open' : ''}`}>
			<div className="sidebarContent">
				<button
					className="closeButton"
					onClick={() => toggleSidebar({ mode: mode, event: event })}
				>
					X
				</button>
				{renderContent()}
			</div>
		</aside>
	);
}

export default Sidebar;
