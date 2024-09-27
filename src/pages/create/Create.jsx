import { useRef, useState } from 'react';
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

	const [error, setError] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (titleRef.current?.value.trim() === '') {
			setError('please fill the title before submiting');
			return;
		}
		const mapLink = () => {
			const map = mapRef.current.value;
			const pattern = /\.\w+$/;
			const isLink = pattern.test(map);
		
			if (!map || !isLink) {
				return 'default';
			}
			return map;
		};
		

		const map = {
			title: titleRef.current.value,
			description: descriptionRef.current.value,
			map: mapLink(),
			dateSystem: {
				dateNames: dateNamesRef.current.getValues(),
				dateEquivalences: dateEquivalencesRef.current.getValues(),
				dateStart: dateStartRef.current.getValues(),
			},
		};

		console.log(map);
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/map/new`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(map),
				}
			);
			const resultMap = await response.json();
			console.log('map created:', resultMap);
			//window.location.href = `/map/${resultMap.id}`;
		} catch (error) {
			setError(error);
			console.error('Error creating map:', error);
			console.error(map);
		}
	};

	return (
		<div className="page create">
			<Nav />
			<main className="content">
				<div>
					<h1>Create</h1>
				</div>
				<form className="form" onSubmit={handleSubmit}>
					<label className="fieldGroup">
						Map title:
						<input ref={titleRef} type="text" />
					</label>
					<label className="fieldGroup">
						Paste a link to your map:
						<input
							ref={mapRef}
							defaultValue={'default'}
							type="text"
						/>
						<div className="tip">
							<i className="fa-solid fa-question"></i>
							<div className="tipDetails">
								Enter a link to a map hosted on a supported
								platform, or use our default map to try things
								around
							</div>
						</div>
					</label>
					<label className="fieldGroup">
						Date system names:
						<CustomDate ref={dateNamesRef} dataType="names" />
						<div className="tip">
							<i className="fa-solid fa-question"></i>
							<div className="tipDetails">
								Here add the names of your calendar, such as
								years, months, weeks and days
							</div>
						</div>
					</label>
					<label className="fieldGroup">
						Date system equivalences:
						<CustomDate
							ref={dateEquivalencesRef}
							dataType="equivalences"
						/>
						<div className="tip">
							<i className="fa-solid fa-question"></i>
							<div className="tipDetails">
								Here add the equivalences of your calendar, such
								as how many months in a year, how many weeks in
								a month, etcetera
							</div>
						</div>
					</label>
					{/*
						<small>
						Tip! if you need a group to have different number, you
						can do <br />
						<code>30 || 31</code> to get the first number to odd
						elements, <br />
						and the second for even ones
					</small>
					*/}
					<label className="fieldGroup">
						Starting Date:
						<CustomDate ref={dateStartRef} dataType="date" />
						<div className="tip">
							<i className="fa-solid fa-question"></i>
							<div className="tipDetails">
								Add the starting date of your world, in years,
								months, weeks and days, or your equivalent
							</div>
						</div>
					</label>
					<label className="fieldGroup">
						Map description:
						<textarea
							ref={descriptionRef}
							name="mapDescription"
						></textarea>
					</label>
					<small>
						Note: you will be able to modify all of these later!
					</small>
					<button type="submit" className="green">
						Create Map
					</button>
					<div className="error">{error}</div>
				</form>
			</main>
		</div>
	);
}

export default Create;
