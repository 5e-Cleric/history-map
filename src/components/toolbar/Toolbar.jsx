import { useContext } from 'react';
import './toolbar.css';
import { EditContext } from '../../pages/editMap/EditContext';

const Toolbar = () => {
	const {

		//other functions
		toggleSidebar,
		toggleTimeline,
	} = useContext(EditContext);

	const handleDragStart = (event) => {
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
						title="open map sidebar"
						className="sidebarButton"
						onClick={() =>
							toggleSidebar({ mode: 'map', event: null })
						}
					>
						<i className="fa-solid fa-earth-americas"></i>
					</button>
				</li>
				<li>
					<button
						title="drag to add an event"
						draggable
						onDragStart={handleDragStart}
						onDragEnd={handleDragEnd}
					>
						<i className="fa-solid fa-location-dot"></i>
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
