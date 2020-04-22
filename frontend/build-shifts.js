import moment from 'moment';

const isTimeOfDay = (time, timeOfDay) => {
	const hour = parseInt(time.split(':')[0], 10);
	return (hour < 16) !== (timeOfDay === 'evening');
};

export default function buildShifts({startDate, endDate, assignments}) {
	const current = moment(startDate);
	const end = moment(endDate);
	const shifts = [];

	if (!current.isValid() || !end.isValid() || current > end) {
		return shifts;
	}

	while (!current.isSame(end, 'day')) {
		for (const timeOfDay of ['afternoon', 'evening']) {
			shifts.push({
				date: current.format('YYYY-MM-DD'),
				timeOfDay,
				assignments: assignments.filter((assignment) => {
					return current.isSame(assignment.time, 'day') &&
						isTimeOfDay(moment(assignment.date).format('HH:MM'), timeOfDay);
				}),
			});
		}

		current.add(1, 'day');
	}

	return shifts;
}
