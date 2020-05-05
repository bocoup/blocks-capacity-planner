export default function assignmentInstructions({
    consumers, assignments, assignment, consumerId, date
}) {
    const isAllocated = assignments.some(({id}) => id === assignment.id);

    if (consumerId === null) {
        if (isAllocated) {
            return [
                {
                    name: 'delete',
                    id: assignment.id,
                }
            ];
        }

        return [];
    }

    const consumer = consumers.find(({id}) => id === consumerId);
    const met = assignments
        .filter((assignment) => {
            return assignment.consumerId === consumerId &&
				assignment.date === date;
        })
        .reduce((total, {amount}) => total + amount, 0);

    // Consumer needs fulfilled--no operation necessary
    if (met === consumer.need) {
        return [];
    }

    const existing = assignments.find((otherAssignment) => {
        return otherAssignment.consumerId === consumerId &&
			otherAssignment.producerId === assignment.producerId &&
			otherAssignment.date === date &&
			otherAssignment.id !== assignment.id;
    });

    if (existing) {
        const amount = Math.min(
            // The most that the consumer can accept from this producer
            consumer.need - met + existing.amount,
            // The most that the producer can offer
            existing.amount + assignment.amount
        );
        const operations = [
            {
                name: 'update',
                id: existing.id,
                amount,
            },
        ];

        if (isAllocated) {
            if (amount === existing.amount + assignment.amount) {
                operations.push({name: 'delete', id: assignment.id});
            } else {
                operations.push(
                    {
                        name: 'update',
                        id: assignment.id,
                        amount: assignment.amount - (amount - existing.amount),
                    }
                );
            }
        }

        return operations;
    }

    const amount = Math.min(consumer.need - met, assignment.amount);
    const operations = [
        {
            name: 'create',
            consumerId,
            producerId: assignment.producerId,
            amount,
            date,
        }
    ];

    if (isAllocated) {
        if (amount === assignment.amount) {
            operations.push({name: 'delete', id: assignment.id});
        } else {
            operations.push(
                {name: 'update', id: assignment.id, amount: assignment.amount - amount}
            );
        }
    }

    return operations;
}
