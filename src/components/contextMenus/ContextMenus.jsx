// MultiContextMenuComponent.jsx
import React from 'react';
import './contextMenus.css';
import { useState, useContext, useEffect } from 'react';
import { ContextMenu, ContextMenuItem, Submenu } from 'rctx-contextmenu';
import { EditContext } from '../../pages/editMap/EditContext';

const MultiContextMenuComponent = () => {
	const {
		// ########## MAP ##########
		map,
		mapId,
		setMap,
		updateMap,
		deleteMap,

		// ########## LOCATIONS ##########
		locations,
		setLocations,
		fetchLocations,
		saveNewLocation,
		updateLocation,
		deleteLocation,
		deleteLocationsByMap,

		// ########## EVENTS ##########
		events,
		renderableEvents,
		setEvents,
		fetchEvents,
		saveNewEvent,
		updateEvent,
		deleteEvent,
		deleteEventsByMap,

		// ########## SIDEBAR AND TIMELINE ##########
		sidebarState,
		toggleSidebar,
		timelineState,
		setTimeline,
		toggleTimeline,

		// ########## MISC ##########
		fetchMapContents,
		joinEventsWithLocations,
		stopDrag,
		zoomLevel,
		setZoomLevel,
		zoomIn,
		zoomOut,
		draggingEvent,
		setDraggingEvent,
		mapPosition,
		setMapPosition,
		mapTranslation,
		setMapTranslation,
	} = useContext(EditContext);

	//console.log(contextMenuProps);
	const [activeLocation, setActiveLocation] = useState(null);
	const [activeEvent, setActiveEvent] = useState(null);

	const handleShowLocation = () => {
		const element = document.querySelector('.contextmenu');
		if (element) {
			const { left, top } = element.getBoundingClientRect();
			const loc = getClosest('location', left, top);
			setActiveLocation(loc);
		}
	};

	const handleShowEvent = () => {
		const element = document.querySelector('.contextmenu');
		if (element) {
			const { left, top } = element.getBoundingClientRect();
			const loc = getClosest('event', left, top);
			setActiveEvent(loc);
		}
	};

	const getClosest = (type, x, y) => {
		const marginOfError = 35;

		if (type === 'location') {
			const matchingLocation = locations.find((loc) => {
				const locationElement = document.getElementById(`location-${loc.locationId}`);
				const { left, top } = locationElement.getBoundingClientRect();
				const distance = Math.sqrt(Math.pow(y - top, 2) + Math.pow(x - left, 2));
				return distance < marginOfError;
			});
			return matchingLocation;
		} else {
			const matchingEvent = events.find((ev) => {
				const eventElement = document.getElementById(`event-${ev.eventId}`);
				const { left, top } = eventElement.getBoundingClientRect();
				const distance = Math.sqrt(Math.pow(y - top, 2) + Math.pow(x - left, 2));
				return distance < marginOfError;
			});
			return matchingEvent;
		}
	};

	const genericMenus = (
		<>
			<hr />
			<ContextMenuItem onClick={() => navigator.clipboard.writeText(map.map)}>Copy Map url</ContextMenuItem>
			<ContextMenuItem onClick={() => window.location.reload()}>Reload Map</ContextMenuItem>
		</>
	);

	return (
		<>
			<ContextMenu id="menu-map">
				<ContextMenuItem onClick={() => toggleSidebar({ mode: 'edit' })}>Edit Map</ContextMenuItem>
				{genericMenus}
			</ContextMenu>

			<ContextMenu id="menu-location" onShow={handleShowLocation}>
				<ContextMenuItem onClick={() => toggleSidebar({ mode: 'edit', location: activeLocation })}>
					Edit Location
				</ContextMenuItem>
				<ContextMenuItem
					onClick={() =>
						navigator.clipboard.writeText(window.location.split('#')[0] + '#' + activeLocation.locationId)
					}>
					Copy Location url
				</ContextMenuItem>
				<ContextMenuItem
					onClick={() =>
						window.confirm(`Are you sure you want to delete ${activeLocation.title}?`) &&
						deleteLocation(activeLocation)
					}>
					Delete Location
				</ContextMenuItem>
				{
					//<ContextMenuItem attributes={{title:"not ready yet"}} onClick={(e) => {console.log('not ready yet')}}>Delete Events from Location</ContextMenuItem>
				}
				<ContextMenuItem
					onClick={() => {
						setEvents((prevEvents) => [...prevEvents, { position: activeLocation.position }]);
						toggleSidebar({
							mode: 'edit',
							event: { position: activeLocation.position },
							location: activeLocation,
						});
					}}>
					Create event inside this location
				</ContextMenuItem>
				{genericMenus}
			</ContextMenu>

			<ContextMenu id="menu-event" onShow={handleShowEvent}>
				<ContextMenuItem onClick={() => toggleSidebar({ mode: 'edit', event: activeEvent })}>
					Edit Event
				</ContextMenuItem>
				<ContextMenuItem
					onClick={() =>
						navigator.clipboard.writeText(window.location.split('#')[0] + '#' + activeEvent.locationId)
					}>
					Copy event url
				</ContextMenuItem>
				<ContextMenuItem
					onClick={() =>
						window.confirm(`Are you sure you want to delete ${activeEvent.title}?`) &&
						deleteEvent(activeEvent)
					}>
					Delete event
				</ContextMenuItem>
				<ContextMenuItem>
					<Submenu title="Move to location">
						{locations.map((loc) => {
							return (
								<ContextMenuItem
									key={loc.locationId}
									onClick={() => {
										const index = events.findIndex((ev) => ev.eventId === activeEvent.eventId);
										if (index === -1) return; // Safety check

										const updatedEvents = [...events];
										updatedEvents[index] = {
											...updatedEvents[index],
											position: loc.position,
										};
										updateEvent(updatedEvents[index]);
									}}>
									{loc.title}
								</ContextMenuItem>
							);
						})}
					</Submenu>
				</ContextMenuItem>
				{genericMenus}
			</ContextMenu>
		</>
	);
};

export default MultiContextMenuComponent;
