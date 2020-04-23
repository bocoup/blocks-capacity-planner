import moment from 'moment';

import isTimeOfDay from './is-time-of-day';

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
				day: current.format('dddd'),
				timeOfDay,
				assignments: assignments.filter((assignment) => {
					return current.isSame(assignment.time, 'day') &&
						isTimeOfDay(moment(assignment.time).format('HH:MM'), timeOfDay);
				}),
			});
		}

		current.add(1, 'day');
	}

	return shifts;
}
