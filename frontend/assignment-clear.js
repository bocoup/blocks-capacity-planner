export default function assignmentClear({ assignments, startDate, endDate }) {
  // TODO: Will this blow up if there are no assignment set (within the date
  // range or at all)
  const operations = [];

  assignments
    .filter((assignment) => {
      // TODO: Do I need to use moment?
      return assignment.date >= startDate && assignment.date <= endDate
    })
    .map((assignment) => {
      operations.push({name: 'delete', id: assignment.id});
    });

  return operations;
}

// TODO: Set default indenting to match ESlinting guidelines.
