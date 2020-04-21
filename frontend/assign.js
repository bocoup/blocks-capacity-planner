export default function assign(
	consumers, producers, assignments, fromConsumerId, toConsumerId, producerId
) {
	const fromConsumer = consumers.find(({id}) => id === fromConsumerId);
	const toConsumer = consumers.find(({id}) => id === toConsumerId);
	const producer = producers.find(({id}) => id === producerId);
	const unmet = toConsumer.need - assignments.reduce(
		(memo, assignment) => {
			return memo + 
				(assignment.consumerId === toConsumerId ? assignment.amount : 0);
		},
		0
	);
	let sourceAssignment;
	const newAssignments = assignments.filter((assignment) => {
		if (assignment.consumerId === fromConsumerId) {
			sourceAssignment = assignment;
			return false;
		}
		return true;
	});

	if (unmet < sourceAssignment.amount) {
		newAssignments.push(Object.freeze(Object.assign(
			{}, sourceAssignment, {amount: sourceAssignment.amount - unmet}
		)));
	}

	if (unmet) {
		newAssignments.push(Object.freeze({
			consumerId: toConsumerId,
			producerId,
			amount: unmet
		}));
	}

	return newAssignments;
};
