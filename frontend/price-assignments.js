export default function priceAssignments({producers, assignments}) {
	return assignments
		.filter(({consumerId}) => consumerId !== null)
		.reduce((total, assignment) => {
			const producer = producers.find(({id}) => id === assignment.producerId);
			return total + assignment.amount * producer.price;
		}, 0);
}
