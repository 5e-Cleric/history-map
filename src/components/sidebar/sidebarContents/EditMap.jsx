import { useEffect, useState, useRef, useContext } from 'react';
import CustomDate from '@components/customDate/CustomDate';
import { EditContext } from '@pages/editMap/EditContext';

function EditMap() {
	const { map, updateMap, toggleSidebar } = useContext(EditContext);

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [mapLink, setMapLink] = useState('');
	const dateNamesRef = useRef(null);
	const dateEquivalencesRef = useRef(null);
	const dateStartRef = useRef(null);

	useEffect(() => {
		// Reset fields for map mode
		setTitle(map.title);
		setDescription(map.description);
		setMapLink(map.map);
		dateNamesRef.current.setValues(map.dateSystem.dateNames);
		dateEquivalencesRef.current.setValues(map.dateSystem.dateEquivalences);
		dateStartRef.current.setValues(map.dateSystem.dateStart);
	}, [map]);

	const handleSubmit = (e) => {
		e.preventDefault();

		const mapData = {
			title,
			author: map.author,
			description,
			map: mapLink,
			id: map.id,
			dateSystem: {
				dateNames: dateNamesRef.current.getValues(),
				dateEquivalences: dateEquivalencesRef.current.getValues(),
				dateStart: dateStartRef.current.getValues(),
			},
		};
		updateMap(mapData);
		toggleSidebar({ mode: 'view' });
	};

	return (
		<div className="event editMap">
			<form className="form" onSubmit={handleSubmit} id="editmap">
				<label className="fieldGroup">
					Map title:
					<input value={title} onChange={(e) => setTitle(e.target.value)} type="text" />
				</label>
				<label className="fieldGroup">
					Paste a link to your map:
					<input value={mapLink} onChange={(e) => setMapLink(e.target.value)} type="text" />
				</label>
				<label className="fieldGroup">
					Date system names:
					<CustomDate ref={dateNamesRef} dataType="names" />
				</label>
				<label className="fieldGroup">
					Date system equivalences:
					<CustomDate ref={dateEquivalencesRef} dataType="equivalences" />
				</label>
				<label className="fieldGroup">
					Starting Date:
					<CustomDate ref={dateStartRef} dataType="date" />
				</label>
				<label className="fieldGroup">
					Map description:
					<textarea
						name="mapDescription"
						value={description}
						onChange={(e) => setDescription(e.target.value)}></textarea>
				</label>
				<button type="submit" onSubmit={handleSubmit} className="green">
					Save map
				</button>
			</form>
		</div>
	);
}

export default EditMap;
