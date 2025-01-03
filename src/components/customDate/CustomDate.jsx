import { useRef, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import './customDate.css';

const CustomDate = forwardRef(({ dataType }, ref) => {
	const dateRefs = {
		year: useRef(null),
		month: useRef(null),
		week: useRef(null),
		day: useRef(null),
	};

	const getDefaultValue = (key) => {
		switch (dataType) {
			case 'names':
				return key.charAt(0) + key.slice(1);
			case 'equivalences':
				return key === 'year'
					? '1'
					: key === 'month'
					? '30'
					: key === 'week'
					? '4'
					: '7';
			case 'date':
				return '0';
			default:
				return '';
		}
	};

	useImperativeHandle(ref, () => ({
		getValues: () => {
			const values = {};
			if (dataType !== 'names') {
				for (const key in dateRefs) {
					values[key] =
						parseInt(Math.round(dateRefs[key].current?.value) || 0) ||
						parseInt(getDefaultValue(key) || 0);
				}
			} else {
				for (const key in dateRefs) {
					values[key] =
						dateRefs[key].current.value || getDefaultValue(key);
				}
			}

			return values;
		},
		setValues: (date) => {
			if (dateRefs.year.current) {
				dateRefs.year.current.value = date.year || '0';
			}
			if (dateRefs.month.current) {
				dateRefs.month.current.value = date.month || '0';
			}
			if (dateRefs.week.current) {
				dateRefs.week.current.value = date.week || '0';
			}
			if (dateRefs.day.current) {
				dateRefs.day.current.value = date.day || '0';
			}
		},
		
		
	}));

	if (dataType === 'equivalences') {
		return (
			<div className="customDate">
				<span className="year">
					<input type="text" value='1' disabled/>/
				</span>
				{['month', 'week', 'day'].map((key) => (
					<span key={key}>
						<input
							ref={dateRefs[key]}
							type="text"
							pattern={
								dataType === 'names'
									? '^[A-Za-z]+$'
									: '^[0-9]{1,4}$'
							}
							defaultValue={getDefaultValue(key)}
						/>
						{key !== 'day' && '/'}
					</span>
				))}
			</div>
		);
	}

	return (
		<div className="customDate">
			{['year', 'month', 'week', 'day'].map((key) => (
				<span key={key}>
					<input
						ref={dateRefs[key]}
						type="text"
						pattern={
							dataType === 'names'
								? '^[A-Za-z]+$'
								: '^[0-9]{1,4}$'
						}
						defaultValue={getDefaultValue(key)}
					/>
					{key !== 'day' && '/'}
				</span>
			))}
		</div>
	);
});

// Set displayName for better debugging
CustomDate.displayName = 'CustomDate';

// Define propTypes for prop validation
CustomDate.propTypes = {
	dataType: PropTypes.string.isRequired,
};

export default CustomDate;
