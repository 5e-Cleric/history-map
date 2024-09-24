import { useRef } from 'react';
import './create.css';
import Nav from '@components/nav/Nav';
import CustomDate from '@components/customDate/CustomDate';

function Create() {
	const titleRef = useRef(null);
	const descriptionRef = useRef(null);
	const mapRef = useRef(null);
	const dateNamesRef = useRef(null);
	const dateEquivalencesRef = useRef(null);
	const dateStartRef = useRef(null);

	const handleSubmit = async () => {
		if (!validateForm()) {
			console.error('invalid form');
			return;
		}

		const map = {
			title : titleRef.current.value,
			description : descriptionRef.current.value,
			map : mapRef.current.value,
			dateSystem : {
				dateNames : dateNamesRef.current.getValues(),
				dateEquivalences : dateEquivalencesRef.current.getValues(),
				dateStart : dateStartRef.current.getValues()
			}
			
		}

		try {
            const response = await fetch('http://localhost:3050/api/map/new', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(map),
            });
            const data = await response.json();
            console.log('map created:', data);
			window.location.href = '/all'
        } catch (error) {
            console.error('Error creating map:', error);
            console.error(map);
        }
	};

	const validateForm = () => {
		if (!titleRef.current) return false;

		const isTitleValid =
			titleRef.current.validity.valid && titleRef.current.value;
		const isMapValid =
			mapRef.current.validity.valid && mapRef.current.value;
		const isFormValid = isTitleValid || isMapValid;

		return isFormValid;
	};

	return (
		<div className="page create">
			<Nav />
			<main className="content">
				<div>
					<h1>Create</h1>
				</div>
				<div className="form" id="createmap">
					<label className="fieldGroup">
						Map title:
						<input ref={titleRef} type="text" />
					</label>
					<label className="fieldGroup">
						Paste a link to your map:
						<input ref={mapRef} type="text" />
					</label>
					<label className="fieldGroup">
						Date system names:
						<CustomDate ref={dateNamesRef} dataType="names" />
					</label>
					<label className="fieldGroup">
						Date system equivalences:
						<CustomDate
							ref={dateEquivalencesRef}
							dataType="equivalences"
						/>
					</label>
					<small>
						Tip! if you need a group to have different number, you
						can do <br />
						<code>30 || 31</code> to get the first number to odd
						elements, <br />
						and the second for even ones
					</small>
					<label className="fieldGroup">
						Starting Date:
						<CustomDate ref={dateStartRef} dataType="date" />
					</label>
					<label className="fieldGroup">
						Map description:
						<textarea
							ref={descriptionRef}
							name="mapDescription"
						></textarea>
					</label>
					<button
						type="button"
						onClick={handleSubmit}
						disabled={validateForm()}
					>
						Submit All
					</button>
				</div>
			</main>
		</div>
	);
}

export default Create;
