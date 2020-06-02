const DAY_TRANSITONS_AT = 5;

function parseHour(time) {
    return parseInt(time.split(':')[0], 10);
}

function timeOfDay(time) {
    const hour = parseHour(time);
    if (hour >= DAY_TRANSITONS_AT && hour < 11) {
        return 'breakfast';
    } else if (hour >= 11 && hour < 16) {
        return 'lunch';
    } else if (hour >= 16 && hour < 21) {
        return 'dinner';
    } else if ((hour >= 0 && hour < DAY_TRANSITONS_AT) || hour >=21) {
        return 'late night';
    }
}

function isTimeOfDay (time, timeOfDayString) {
    return timeOfDay(time) === timeOfDayString;
}

function compareTimeWithinShift(timeA, timeB) {
    if (timeOfDay(timeA) === timeOfDay(timeB)) {
        if (parseHour(timeA) < DAY_TRANSITONS_AT && parseHour(timeB) >= DAY_TRANSITONS_AT) {
            return 1;
        } else if (parseHour(timeB) < DAY_TRANSITONS_AT && parseHour(timeA) >= DAY_TRANSITONS_AT) {
            return -1;
        } else {
            return timeA > timeB ? 1 : -1;
        }
    } else {
        throw new Error('Time can only be compared within the same shift.');
    }
}

export { isTimeOfDay, compareTimeWithinShift }

