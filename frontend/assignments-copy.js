import moment from 'moment';

export default function assignmentsCopy({ assignments, startDate, endDate }) {

  const assignmentToCreate = [];
  const start = moment.utc(startDate);

  assignments
    .filter((assignment) => {
      return assignment.date >= start.subtract(7, 'days').format() &&
        assignment.date < startDate
    })
    .forEach((assignment) => {
        const date = moment.utc(assignment.date).add(7, 'days').format();

        if (date < endDate) {
          assignmentToCreate.push({
            consumerId: assignment.consumerId,
            producerId: assignment.producerId,
            region: assignment.region,
            amount: assignment.amount,
            date: date
          });
        }
    });

  return assignmentToCreate;
}

