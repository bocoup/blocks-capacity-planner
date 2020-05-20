export default function isTimeOfDay (time, timeOfDay) {
    const hour = parseInt(time.split(':')[0], 10);
    switch(timeOfDay) {
    case 'breakfast':
        return hour >= 5 && hour < 11;
    case 'lunch':
        return hour >= 11 && hour < 16;
    case 'dinner':
        return hour >= 16 && hour < 21;
    case 'late night':
        return (hour >= 0 && hour < 5) || hour >=21;
    }
}
