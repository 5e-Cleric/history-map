import { useContext } from 'react';
import './toolbar.css';
import { EditContext } from '@pages/editMap/EditContext';

const Toolbar = () => {
	const {
		zoomIn,
		zoomOut,
		setZoomLevel,
		setMapPosition,
		setMapTranslation,
		setDraggingEvent,
		//other functions
		toggleSidebar,
		toggleTimeline,
	} = useContext(EditContext);

	const handleDragStart = (event) => {
		setDraggingEvent('new');
		// Optional: style adjustments for the drag image, like transparency.
		// event.currentTarget.style.opacity = '1';
	};

	const handleDragEnd = () => {
		// Optional: style adjustments after drag ends, like resetting transparency.
		// event.currentTarget.style.opacity = '';
	};

	return (
		<div className="toolbar">
			<ul>
				<li>
					<button
						className="eventDrag"
						title="drag to add an event"
						draggable
						onDragStart={handleDragStart}
						onDragEnd={handleDragEnd}
					>
						<i className="fa-solid fa-location-dot"></i>
					</button>
				</li>
			</ul>
			<ul>
				<li>
					<button
						className="zoomOut"
						title="zoom out"
						onClick={() => zoomOut()}
					>
						<i className="fa-solid fa-magnifying-glass-minus"></i>
					</button>
				</li>
				<li>
					<button
						className="resetZoom"
						title="reset zoom to 100%"
						onClick={() => {
							setZoomLevel(100);
							setMapPosition({ x: 0, y: 0 });
							setMapTranslation({ x: 0, y: 0 });
						}}
					>
						<i className="fa-solid fa-expand"></i>
					</button>
				</li>
				<li>
					<button
						className="zoomIn"
						title="zoom in"
						onClick={() => zoomIn()}
					>
						<i className="fa-solid fa-magnifying-glass-plus"></i>
					</button>
				</li>
			</ul>
			<ul>
				<li>
					<button
						title="open map sidebar"
						className="sidebarButton"
						onClick={() =>
							toggleSidebar({ mode: 'view', event: null })
						}
					>
						<i className="fa-solid fa-earth-americas"></i>
					</button>
				</li>
				<li>
					<div className="layers">
						<button title="this is not ready yet">
							<i className="fa-solid fa-layer-group"></i>
						</button>
					</div>
				</li>
				<li>
					<button
						title="open timeline"
						className="timelineButton"
						onClick={toggleTimeline}
					>
						<i className="fa-solid fa-timeline"></i>
					</button>
				</li>
			</ul>
		</div>
	);
};

export default Toolbar;
