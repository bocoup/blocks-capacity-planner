export default function assign(
	consumers, producers, assignments, fromConsumerId, toConsumerId, producerId
) {
	const toConsumer = consumers.find(({id}) => id === toConsumerId);
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
}
