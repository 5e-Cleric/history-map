import { useEffect, useState, useRef, useContext } from 'react';
import { EditContext } from '@pages/editMap/EditContext';

function EditLocation() {
	const {
		sidebarState,
        fetchLocations,
        saveNewLocation,
        updateLocation,

		toggleSidebar,
	} = useContext(EditContext);

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [position, setPosition] = useState({ y: null, x: null });

	const location = sidebarState.location;

	useEffect(() => {
		if (location.locationId) {
			setTitle(location.title);
			setDescription(location.description);
		}
		setPosition(location.position);
	}, [location]);

	const handleSubmit = (e) => {
		e.preventDefault();

		const locationData = {
			locationId: location.locationId,
			title,
			description,
			position,
		};

		if (location.locationId) {
            console.log(locationData);
			updateLocation(locationData);
		} else {
			saveNewLocation(locationData);
		}

		fetchLocations();
		toggleSidebar({ mode: 'view', location: location });
	};

	return (
		<div className="location edit">
			<form className="form" onSubmit={handleSubmit}>
				<label className="fieldGroup">
					Location title:
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
						onChange={(e) => setDescription(e.target.value)}
						required></textarea>
				</label>
				<button type="submit" className="green">
					{!location ? 'Create location' : 'Save location'}
				</button>
			</form>
		</div>
	);
}

export default EditLocation;
