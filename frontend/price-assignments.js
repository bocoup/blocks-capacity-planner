import moment from 'moment';

export default function priceAssignments({
	producers, assignments, startDate, endDate
}) {
	const start = moment(startDate);
	const end = moment(endDate);

	return assignments
		.filter(({consumerId, date}) => {
			return consumerId !== null && moment(date).isBetween(start, end);
		})
		.reduce((total, assignment) => {
			const producer = producers.find(({id}) => id === assignment.producerId);
			return total + assignment.amount * producer.price;
		}, 0);
}
