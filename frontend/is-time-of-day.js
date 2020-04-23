export default function isTimeOfDay (time, timeOfDay) {
	const hour = parseInt(time.split(':')[0], 10);
	return (hour < 16) !== (timeOfDay === 'evening');
}
