import moment from 'moment';

export default function assignmentsCopy({ assignments, consumers, startDate, endDate }) {

    const assignmentToCreate = [];
    const start = moment.utc(startDate);

    assignments
        .filter((assignment) => {
            return assignment.date >= start.subtract(7, 'days').format() &&
        assignment.date < startDate
        })
        .forEach((assignment) => {
            const date = moment.utc(assignment.date).add(7, 'days').format();
            const consumerId = assignment.consumerId;
            const consumer = consumers.find(consumer => consumer.id === consumerId);

            if (date < endDate) {
                assignmentToCreate.push({
                    consumerId: consumerId,
                    producerId: assignment.producerId,
                    region: consumer && consumer.region,
                    amount: assignment.amount,
                    date: date
                });
            }
        });

    return assignmentToCreate;
}

