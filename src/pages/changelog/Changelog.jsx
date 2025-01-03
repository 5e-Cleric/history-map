import Nav from '@components/nav/Nav';
import './changelog.css';

const Changelog = () => {
	return (
		<div className="page changelog">
			<Nav />
			<main className="content">
				<div className="logoWrapper">
					<svg
						className="logo"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 738.76 678.24">
						<g>
							<path d="M737.36,346.77c0,81.54.16,150.66-.05,219.78-.16,50.39-23.87,79.25-73.24,87.72-48.97,8.4-98.17,15.5-147.26,23.19-16.28,2.55-31.81-1.53-47.3-5.49-70.83-18.13-141.68-36.17-212.39-54.76-15.32-4.03-30.16-4.58-45.67-1.82-35.99,6.41-72.05,12.42-108.16,18.1-57.34,9.01-102.08-26.28-102.54-84.13C-.36,411.68-.08,274.01.61,136.35c.23-46.11,26.76-76.32,72.04-84.61,38.2-6.99,108.37-8.72,146.77-14.54,15.9-2.41,24.38-.76,19.05,15.24s-18.15,26.44-24,27.43c-34.92,5.91-75.89,4.64-110.83,10.4-6.76,1.12-13.54,2.19-20.24,3.6-25.57,5.38-38.42,19.19-38.49,44.91-.36,137.66-.47,275.33.05,413,.12,31.88,20.39,47.98,51.98,43.17,37.83-5.75,75.6-11.98,113.27-18.72,19.57-3.5,38.47-2.45,57.62,2.56,69.07,18.06,138.33,35.44,207.35,53.7,19.72,5.22,38.93,6.75,59.17,3.17,38.8-6.87,77.88-12.11,116.77-18.49,35.19-5.77,45.06-17.31,45.09-52.51.11-132.53.14-265.05-.02-397.58-.05-42.35-16.86-56.18-59.3-49.68-34.44,5.28-74.79,8.88-83.74-.27s-11.78-22.86-10.67-30.29c1.32-8.77,24.93-5.93,34.39-6.67,23.14-2.47,43.9-4.19,56.29-5.49,33.76-4.81,65.15-1.85,89.15,26.46,10.78,12.72,17.14,27.14,16.42,43.87-3.09,71.38-.13,142.78-1.34,201.75Z" />
							<path d="M525.91,143.34c.47,46.61-13.44,82.93-42.64,113.21-29.31,30.39-48.08,67.8-69.1,103.71-4.9,8.37-9.44,16.97-14.74,25.09-13.13,20.11-31.94,20.42-44.8-.07-13.94-22.22-26.98-45.04-39.59-68.05-12.72-23.21-28.72-43.65-46.59-63.12-46.37-50.52-53.75-121.49-19.75-179.27C282.48,17.43,350.02-11.28,415.01,4.12c66.84,15.84,111.37,73.62,110.9,139.22ZM378.19,88.44c-34.47.07-62.19,27.54-62.32,61.74-.13,34.77,27.72,62.62,62.56,62.55,34.45-.07,62.17-27.54,62.32-61.75.15-34.77-27.7-62.61-62.56-62.54Z" />
							<path d="M96.44,144.75c8.74-6.38,23.43-.35,33.36,1.82,16.76,4.09,32.66,9.94,46.9,19.39,10.24,6.53,21.22,13.36,27.92,23.67,9.19,14.85,14.5,41.7,13.72,59.11-.22,15.85-6.73,30.79-19.77,39.99-5.21,3.87-11.03,7.27-15.92,11.49-9.3,7.82-16.54,17.76-.57,21.25,6.37,1.57,14.9,1.32,21.84.93,7.89-.26,18.03-.6,21.59,7.74,3.1,6.9,1.88,19.98,1.55,29.99-.58,13.92-1.42,27.28-2.49,41.15-.69,9.01-1.39,18.94-2.16,27.97-.69,6.36-1.11,13.47-4.94,18.67-4.86,6.59-15.71,5.37-24.21,6.81-5.1.6-19.94,3.01-12.8,9.93,11.41,9.83,31.56,7.08,41.88,18.26,4.89,5.83-.33,13.05-6.4,16.53-10.58,6.38-20.79,5.5-34.93,5.51-14.57-.17-29.38-.98-43.84-2.49-10.5-1.31-25.18-2.15-31.74-6.66-9.4-6.6-9.88-19.84-11.57-30.38-1.56-12.15-2.97-25.89-4-38.6-.62-8.02-.98-16.3.2-24.23,2.15-13.41,7.93-25.83,15.55-37.12,4.54-6.54,10.54-12.14,17.27-16.32,8.42-5.17,20.99-12.01,17.19-23.01-5.15-10.88-21.56-16.69-31.13-23.3-6.48-4.37-12.22-9.69-15.17-16.48-3.6-8.33-3.3-20.17-2.11-29.35,1.96-15.25,13.66-26.52,26.48-33.84,7.92-5.32,28.87-13.56,22.85-21.29-2.43-2.97-5.92-4.88-9.81-7.04-7.57-4.11-17.51-8.44-24.85-12.81-5.52-3.27-9.73-6.91-12.27-11.19-5.11-8.06-4.76-20.76,2.29-26.03l.1-.08Z" />
							<path d="M302.15,332.03c-5.21,4.87-6.37,17.46-8.52,25.11-3.46,12.47-8.41,24.73-2.6,36.85,2.72,5.58,6.46,10.89,8.46,16.8,2.5,6.68,2.05,13.93,3.57,20.79.68,9.77,17.23,22.1,3.92,28.84-4.41,2.37-11.01,2.73-14.69,3.5-4.22.61-5.2,3.29-1.5,7.96,12.66,15.34,36.86,23.34,55.31,28.76,17.79,5.04,31.38.71,48.75-2.94,23.04-4.13,10.24,22.15,28.41,33.58,4.73,3.1,11.16,5.83,15.97,6.1,19.11-.2,11.94-24.91,14.9-37.19,3.2-11.96,14.04-17.4,24.61-24.23,2.6-1.57,5.33-3.06,8.1-4.3,13.67-6.65,27.41-4.55,24.43,14-1.1,8.14-5.67,14.38-13.05,16.9-6.16,2.21-13.82,3.91-11.99,12.23,2.83,10.83,15.26,21.4,24.1,28.89,9.14,7.17,18.6,16.54,30.63,17.98,17.01,1.26,23.45-20.18,39.51-22.07,4.46-.76,9.05-.37,13.55-.14,5.44.39,11.36-.02,16.46-.63,5.29-.6,9.66-.45,14.29,1.6,5.48,2.14,10.98,5.74,17.13,5.48,6.03-.49,11.87-6.8,15.52-11.76,7.57-10.31,9.59-29.36,5.85-41.48-2.61-8.79-8.69-16.33-11.44-24.47-3.06-8.37-1.93-17.3-.9-26,.61-5.49.65-11.1.5-16.5-.3-8.25.08-16.7,2.13-24.72,2.02-8.44,5.3-15.27,6.72-24.66.68-4.56.86-9.22.91-13.88-.12-9.51.27-19.09-.83-28.12-1.22-10.66-7.56-13.96-16.68-15.75-6.34-1.4-14.56-2.97-21.35-5.5-7.68-2.15-17.22-10.74-24.55-4.46-11.17,11.41-14.64,15.24-30.87,19.61-5.94,1.85-12.37,3.63-17.09,6.01-6.07,3.29-12.05,6.99-18.25,9.83-4.01,2.31-6.78,6.44-11.46,7.35-3,1.15-7.41-2.58-10.16-5.51-2.46-2.4-5.35-5.24-8.21-7.08-10.67-7.4-17.46,3.92-27.57,3.84-2.96-.31-5.31-2.37-7.35-4.44-5.11-5.1-9.86-12.89-17.65-12.35-4.38,8.49-40.76,65.06-51.43,77.83s-31.62,12.38-43.81-1.14-37.95-67.49-42.24-70.67c-4.66-3.28-4.09-4.55-9.41.09l-.09.08Z" />
						</g>
					</svg>
				</div>
				<h1>Change Log</h1>
				<div className="card">
					<h3>Update 2.1 - Saturday, November 16th of 2024</h3>
					
					<br />
					<br />

					<p>
						It includes the following changes:
						<ul>
							<li>Error code reference</li>
							<li>Fixed error with date when creating events</li>
							<li>Reduced amount of fetching</li>
							<li>
								Correct toggle of sidebar when creting points
							</li>
							<li>Adding animation to location pin on toolbar</li>
							<li>
								Adding drop to join area on locations when
								dragging
							</li>
							<li>Deleting points on map deletion in all page</li>
							<li>Reordered map context</li>
						</ul>
					</p>
					<hr />
				</div>
				<div className="card">
					<h3>Update 2.0 - Saturday, November 16th of 2024</h3>

					<br />
					<br />

					<p>
						This is the first update of the application. It includes
						the following changes:
						<ul>
							<li>addded zoom buttons</li>
							<li>Added locations</li>
							<li>Global error handling</li>
							<li>Prevent movement of active point</li>
							<li>Prevent duplication of new points</li>
							<li>Fix crash when clicking on new event</li>
							<li>
								separated sidebar content in separate components
							</li>
							<li>
								Correct deletion of new point when closing
								sidebar
							</li>
							<li>Added Changelog</li>
						</ul>
					</p>
				</div>
			</main>
		</div>
	);
};

export default Changelog;
