import moment from 'moment';

export default function assignmentsCopy({ assignments, startDate, endDate }) {

    const assignmentToCreate = [];
    const prevStart = moment.utc(startDate).subtract(7, 'days').format();

    assignments
        .filter((assignment) => {
            return assignment.date >= prevStart && assignment.date < startDate;
        })
        .forEach((assignment) => {
            const date = moment.utc(assignment.date).add(7, 'days').format();

            if (date < endDate) {
                assignmentToCreate.push({
                    consumerId: assignment.consumerId,
                    producerId: assignment.producerId,
                    amount: assignment.amount,
                    date: date
                });
            }
        });

    return assignmentToCreate;
}

