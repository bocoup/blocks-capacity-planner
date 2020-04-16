import moment from 'moment';

/**
 * @param {string} startDate - ISO-formatted date string
 * @param {string} endDate - ISO-formatted date string
 *
 * @returns {Array<Date>}
 */
export default function expandDates(startDate, endDate, times) {
  const current = moment.utc(startDate);
  const end = moment.utc(endDate);
  const all = [];

  while (current <= end) {
    for (const {day, time} of times) {
      if (moment().day(day).day() !== current.day()) {
        continue;
      }
      const [hour, minute] = time.split(':').map((part) => parseInt(part, 10));
      const clone = current.clone();
      clone.set('hour', hour);
      clone.set('minute', minute);
      all.push(clone.toDate());
    }
    current.add(1, 'day');
  }

  return all;
};
