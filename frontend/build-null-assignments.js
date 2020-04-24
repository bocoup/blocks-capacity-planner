import moment from 'moment';

function producerIsAvailable(dateMoment, timeOfDay, producer) {
	return producer.times.some((time) => {
		return dateMoment.day() === moment.utc().day(time.day).day() &&
			timeOfDay === time.timeOfDay;
	});
}

let count = 0;

export default function buildNullAssignments(date, timeOfDay, producers, assignments) {
	const dateMoment = moment.utc(date);
	return producers
		.filter((producer) => producerIsAvailable(dateMoment, timeOfDay, producer))
		.map((producer) => {
			const totalUtilized = assignments
				// Select only assignments concerning the current producer
				.filter(({producerId}) => producerId === producer.id)
				// Calculate sum
				.reduce((total, assignment) => total + assignment.amount, 0);

			return {
				id: `NullAssignment:${count += 1}`,
				consumerId: null,
				producerId: producer.id,
				amount: producer.capacity - totalUtilized,
				time: null,
				date: null
			};
		})
		.filter(({amount}) => amount > 0);
}
