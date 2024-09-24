import { useEffect, useState } from 'react';
import Nav from '@components/nav/Nav';
import './all.css';

function All() {
	const [maps, setmaps] = useState(null);
	const [searching, setSearching] = useState(null);
	const [error, setError] = useState('');

	useEffect(() => {
		fetchMaps();
	}, []);

	const fetchMaps = () => {
		console.log(`fetching to ${import.meta.env.VITE_API_URL}/api/map/all`);
		fetch(`${import.meta.env.VITE_API_URL}/api/map/all`)
			.then((response) => response.json())
			.then((data) => {
				setmaps(data);
				setSearching(false);
			})
			.catch((error) => {
				console.log(error);
				console.error(error);
				setError('Error fetching maps');
				setSearching(false);
			});
	};

	const deleteMap = async (id) => {
		try {
			await fetch(`${import.meta.env.VITE_API_URL}/api/map/${id}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
			});
			fetchMaps();
		} catch (error) {
			console.error(error);
		}
	};

	const rendermaps = () => {
		if (searching) {
			return (
				<div className="searching">
					<h1>Searching maps...</h1>
				</div>
			);
		}

		if (error) {
			return (
				<div className="error">
					<h1>{error}</h1>
				</div>
			);
		}

		if (!maps || maps.length === 0) {
			return (
				<div className="nomaps">
					<h1>No maps found</h1>
				</div>
			);
		}

		return (
			<ul className="mapList">
				{maps.map((map) => (
					<li key={map.id} className="mapItem">
						<h3>Title: {map.title}</h3>
						<a href={`/map/${map.id}`} className="mapLink">
							open
						</a>{' '}
						<button
							className="delete"
							onClick={() => {
								deleteMap(map.id);
							}}
						>
							delete
						</button>
					</li>
				))}
			</ul>
		);
	};

	return (
		<div className="page all">
			<Nav />
			<main className="content">
				<h1>All maps</h1>
				{rendermaps()}
			</main>
		</div>
	);
}

export default All;
