import './toolbar.css';

const Toolbar = ({ onSidebarToggle, onTimelineToggle }) => {
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
						className="sidebarButton"
						onClick={() =>
							onSidebarToggle({ mode: 'map', event: null })
						}
					>
						<i className="fa-solid fa-earth-americas"></i>
					</button>
				</li>
				<li>
					<button
						draggable
						onDragStart={handleDragStart}
						onDragEnd={handleDragEnd}
					>
						<i className="fa-solid fa-location-dot"></i>
					</button>
				</li>
				<li>
					<div className="layers">
						<button>
							<i className="fa-solid fa-layer-group"></i>
						</button>
					</div>
				</li>
				<li>
					<button
						className="timelineButton"
						onClick={onTimelineToggle}
					>
						<i className="fa-solid fa-timeline"></i>
					</button>
				</li>
			</ul>
		</div>
	);
};

export default Toolbar;
