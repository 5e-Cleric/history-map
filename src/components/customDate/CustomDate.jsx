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

	const getPlaceholder = (key) => {
		
		return dataType === 'names' ? key.charAt(0) + key.slice(1) : key === 'month' ? '12' : key === 'year' ? '1' : key === 'week' ? '4' : '7';
	};

	const getDefaultValue = (key) => {
		switch (dataType) {
			case 'names':
				return getPlaceholder(key);
			case 'equivalences':
				return key === 'year'
					? '0001'
					: key === 'month'
					? '0030'
					: key === 'week'
					? '0004'
					: '0007';
			case 'start':
				return key === 'year'
					? '0000'
					: key === 'month'
					? '0000'
					: key === 'week'
					? '0000'
					: '0000';
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
						parseInt(dateRefs[key].current.value) ||
						parseInt(getDefaultValue(key));
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
			dateRefs.year.current.value = date.year;
			dateRefs.month.current.value = date.month;
			dateRefs.week.current.value = date.week;
			dateRefs.day.current.value = date.day;
		},
	}));

	return (
		<div className="customDate">
			{['year', 'month', 'week', 'day'].map((key) => (
				<span key={key}>
					<input
						ref={dateRefs[key]}
						type="text"
						pattern={
							dataType === 'names' ? '^[A-Za-z]+$' : '^[0-9]{1,4}$'
						}
						placeholder={getPlaceholder(key)}
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
