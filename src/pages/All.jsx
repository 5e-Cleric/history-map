import { useEffect, useState, useContext } from 'react';
import Nav from '@components/nav/Nav';
import './all.css';
import { MainContext } from '../MainContext';

function All() {
	const [maps, setmaps] = useState(null);
	const [searching, setSearching] = useState(null);
	const { setError } = useContext(MainContext);

	useEffect(() => {
		fetchMaps();
	}, []);

	const fetchMaps = () => {
		setSearching(true);
		fetch(`${import.meta.env.VITE_API_URL}/api/map/all`)
			.then((response) => response.json())
			.then((data) => {
				setmaps(data);
				setSearching(false);
			})
			.catch((error) => {
				console.error(error);
				setError({ errorCode: 3, errorText: 'Error fetching maps' });
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
			setError({ errorCode: 5, errorText: 'Error deleting map' });
			console.error(error);
		}

		try {
			await fetch(`${import.meta.env.VITE_API_URL}/api/event/${id}`, {
				method: 'DELETE',
			});
		} catch (error) {
			setError({ errorCode: 24, errorText: 'Error deleting events' });
			console.error('Error deleting events:', error);
		}

		try {
			await fetch(`${import.meta.env.VITE_API_URL}/api/location/${id}`, {
				method: 'DELETE',
			});
		} catch (error) {
			setError({ errorCode: 24, errorText: 'Error deleting locations' });
			console.error('Error deleting locations:', error);
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

		if (!maps || maps.length === 0) {
			return (
				<div className="nomaps">
					<h1>No maps found</h1>
				</div>
			);
		}

		return (
			<ul
				className="mapList"
				onContextMenu={() => {
					console.log('a');
				}}>
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
							}}>
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
				<small>
					This page is temporary and will be replaced by a userpage whenever i add users.
					<br />
					<br />
					<br />
				</small>
				{rendermaps()}
			</main>
		</div>
	);
}

export default All;
