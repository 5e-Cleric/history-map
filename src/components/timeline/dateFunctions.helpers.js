const convertToTotalDays = (date, equivalences) => {
	if (!date) return 0;

	const daysInYear =
		equivalences.month * equivalences.week * equivalences.day; // Total days in one year
	const daysInMonth = equivalences.week * equivalences.day; // Total days in one month
	const daysInWeek = equivalences.day; // Total days in one week

	// Convert the date to total days using the equivalences
	const totalDays =
		date.year * daysInYear + // Days contributed by years
		date.month * daysInMonth + // Days contributed by months
		date.week * daysInWeek + // Days contributed by weeks
		date.day; // Days contributed by days

	return totalDays;
};

const convertTotalDaysToDate = (totalDays, equivalences) => {
	const daysInYear =
		equivalences.month * equivalences.week * equivalences.day;
	const daysInMonth = equivalences.week * equivalences.day;
	const daysInWeek = equivalences.day;

	let remainingDays = totalDays;
	let date = { year: 0, month: 0, week: 0, day: 0 };

	// Calculate the number of years
	date.year = Math.floor(remainingDays / daysInYear);
	remainingDays %= daysInYear;

	// Calculate the number of months
	date.month = Math.floor(remainingDays / daysInMonth);
	remainingDays %= daysInMonth;

	// Calculate the number of weeks
	date.week = Math.floor(remainingDays / daysInWeek);
	remainingDays %= daysInWeek;

	// The remaining days
	date.day = remainingDays;

	return date;
};

const positionToTime = (
	positionPercent,
	startDate,
	totalTimelineDays,
	equivalences
) => {
	// Calculate the number of days from the start date corresponding to the position
	const daysFromStart = (positionPercent / 100) * totalTimelineDays;
	//round date to not use decimals
	const roundedDaysFromStart = Math.floor(daysFromStart + 0.5);

	// Convert the total number of days back into a date
	const startDateTotalDays = convertToTotalDays(startDate, equivalences);
	const newTotalDays = startDateTotalDays + roundedDaysFromStart;

	return convertTotalDaysToDate(newTotalDays, equivalences);
};

// Dynamic interval calculation based on equivalences
const calculateDynamicInterval = (totalDays, equivalences) => {
	const daysInYear =
		equivalences.month * equivalences.week * equivalences.day;
	const daysInMonth = equivalences.week * equivalences.day;
	const daysInWeek = equivalences.day;

	// Calculate potential intervals based on the total timeline
	const intervals = [];
	const targetIntervals = 10; // Aim for around 10 intervals

	// Calculate intervals in years, months, weeks, and days
	const yearsInterval = Math.floor(totalDays / daysInYear / targetIntervals);
	const monthsInterval = Math.floor(
		totalDays / daysInMonth / targetIntervals
	);
	const weeksInterval = Math.floor(totalDays / daysInWeek / targetIntervals);
	const daysInterval = Math.floor(totalDays / targetIntervals);

	// Push valid intervals
	if (yearsInterval > 0) intervals.push(daysInYear * yearsInterval);
	if (monthsInterval > 0) intervals.push(daysInMonth * monthsInterval);
	if (weeksInterval > 0) intervals.push(daysInWeek * weeksInterval);
	if (daysInterval > 0) intervals.push(daysInterval);

	// Return the smallest interval
	return Math.min(...intervals);
};

// Increment a date object to the next "round" date based on the interval
const incrementToNextRoundDate = (currentDate, intervalDays, equivalences) => {
	const daysInYear =
		equivalences.month * equivalences.week * equivalences.day;
	const daysInMonth = equivalences.week * equivalences.day;
	const daysInWeek = equivalences.day;

	let newDate = { ...currentDate };

	// If interval is greater than days in year
	if (intervalDays >= daysInYear) {
		newDate.year += Math.floor(intervalDays / daysInYear);
		intervalDays %= daysInYear; // Remaining days after adding years
		newDate.month = 0; // Reset months
		newDate.week = 0; // Reset weeks
		newDate.day = 0; // Reset days
	}

	// If interval is greater than days in month
	if (intervalDays >= daysInMonth) {
		newDate.month += Math.floor(intervalDays / daysInMonth);
		intervalDays %= daysInMonth; // Remaining days after adding months
		newDate.week = 0; // Reset weeks
		newDate.day = 0; // Reset days
	}

	// If interval is greater than days in week
	if (intervalDays >= daysInWeek) {
		newDate.week += Math.floor(intervalDays / daysInWeek);
		intervalDays %= daysInWeek; // Remaining days after adding weeks
	}

	// Finally add the remaining days
	newDate.day += intervalDays;

	// Normalize the date object (handle overflows)
	if (newDate.day >= daysInWeek) {
		newDate.week += Math.floor(newDate.day / daysInWeek);
		newDate.day %= daysInWeek; // Reset days to fit within the week
	}
	if (newDate.week >= equivalences.week) {
		newDate.month += Math.floor(newDate.week / equivalences.week);
		newDate.week %= equivalences.week; // Reset weeks to fit within the month
	}
	if (newDate.month >= equivalences.month) {
		newDate.year += Math.floor(newDate.month / equivalences.month);
		newDate.month %= equivalences.month; // Reset months to fit within the year
	}

	return newDate;
};

export {
	convertToTotalDays,
	convertTotalDaysToDate,
	positionToTime,
	calculateDynamicInterval,
	incrementToNextRoundDate,
};