import moment from 'moment';

const isDayOfWeek = (date, dayOfWeek) => {
	return moment(date).day() === moment().day(dayOfWeek).day();
};
const isTimeOfDay = (time, timeOfDay) => {
	const hour = parseInt(time.split(':')[0], 10);
	return (hour < 16) !== (timeOfDay === 'evening');
};

export default function buildShifts(windows, producers, consumers) {
	return windows.map((window) => ({
		window,
		consumers: consumers.filter((consumer) => {
			return consumer.times.some(({day, time}) => {
				return isDayOfWeek(window.date, day) &&
					isTimeOfDay(time, window.timeOfDay);
			});
		}),
		producers: producers.filter((producer) => {
			return producer.times.some(({day, timeOfDay}) => {
				return isDayOfWeek(window.day, day) &&
					timeOfDay === window.timeOfDay;
			});
		}),
	}));
}
