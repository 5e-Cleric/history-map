import './timeline.css';

const convertToTotalDays = (date, equivalences) => {
    if (!date) return 0;

    const daysInYear = equivalences.month * equivalences.week * equivalences.day; // Total days in one year
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

// Dynamic interval calculation based on equivalences
const calculateDynamicInterval = (totalDays, equivalences) => {
    const daysInYear = equivalences.month * equivalences.week * equivalences.day; 
    const daysInMonth = equivalences.week * equivalences.day; 
    const daysInWeek = equivalences.day; 

    // Calculate potential intervals based on the total timeline
    const intervals = [];
    const targetIntervals = 10; // Aim for around 10 intervals

    // Calculate intervals in years, months, weeks, and days
    const yearsInterval = Math.floor(totalDays / daysInYear / targetIntervals);
    const monthsInterval = Math.floor(totalDays / daysInMonth / targetIntervals);
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
    const daysInYear = equivalences.month * equivalences.week * equivalences.day;
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


function Timeline({ timelineState, map, mapEvents }) {
    if (
        !map ||
        !map.dateSystem ||
        !map.dateSystem.dateStart ||
        !map.dateSystem.dateEquivalences ||
        !mapEvents ||
        mapEvents.length < 2
    ) {
        return <div>Error: Missing required data for the timeline.</div>;
    }
    const events = mapEvents.filter((event) => event.date);

    const equivalences = map.dateSystem.dateEquivalences;

    const getLastDate = () => {
        const lastEvent = events.reduce((latest, current) => {
            return current.date.year > latest.date.year ? current : latest;
        });
        return lastEvent.date;
    };

    const startDate = map.dateSystem.dateStart;
    const lastDate = getLastDate();

    const totalTimelineDays =
        convertToTotalDays(lastDate, equivalences) -
        convertToTotalDays(startDate, equivalences);

    console.log(totalTimelineDays);

    const getDivisionsArray = () => {
        const divisions = [];
        const intervalDays = calculateDynamicInterval(totalTimelineDays, equivalences);

        let currentDate = { ...startDate }; // Make a copy of startDate

        while (convertToTotalDays(currentDate, equivalences) <= convertToTotalDays(lastDate, equivalences)) {
            divisions.push(currentDate);
            currentDate = incrementToNextRoundDate(currentDate, intervalDays, equivalences);
        }

        return divisions;
    };

    const renderEvents = () => {
        return (
            <div className="events">
                {events.map((event, index) => {
                    const eventDays = convertToTotalDays(event.date, equivalences);
                    const eventPositionPercent =
                        ((eventDays - convertToTotalDays(startDate, equivalences)) / totalTimelineDays) * 100;

                    return (
                        <div
                            key={index}
                            className="event"
                            style={{ left: `${eventPositionPercent}%` }}
                        >
                            <div className="date">
                                {event.date.year}/{event.date.month}/{event.date.week}/{event.date.day}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <article className={`timeline ${timelineState ? 'open' : ''}`}>
            <div className="bar">
                <div className="years">
                    <div className="divisions">
                        {getDivisionsArray().map((division, index) => {
                            const divisionDays = convertToTotalDays(division, equivalences);
                            const divisionPositionPercent =
                                ((divisionDays - convertToTotalDays(startDate, equivalences)) / totalTimelineDays) * 100;

                            return (
                                <div
                                    key={index}
                                    className="division"
                                    style={{
                                        left: `${divisionPositionPercent}%`,
                                    }}
                                >
                                    {division.year}/{division.month}/{division.week}/{division.day}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            {renderEvents()}
        </article>
    );
}

export default Timeline;
