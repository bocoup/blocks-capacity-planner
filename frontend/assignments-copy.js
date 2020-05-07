import moment from 'moment';

export default function assignmentsCopy({ assignments, startDate, endDate }) {

  const operations = [];
  const start = moment.utc(startDate);
  const end = moment.utc(endDate);

  assignments
    .filter((assignment) => {
      return assignment.date >= start.subtract(7, 'days').format() &&
        assignment.date <= startDate
    })
    .forEach((assignment) => {
      let date = moment.utc(assignment.date).add(7, 'days');

      while (date <= end) {
        operations.push({
          name: 'create',
          consumerId: assignment.consumerId,
          producerId: assignment.producerId,
          amount: assignment.amount,
          date: date.format(),
        });

        date = date.add(7, 'days');
      }
    });

  return operations;
}

