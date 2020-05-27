const DAY_TRANSITONS_AT = 5;

function parseHour(time) {
    return parseInt(time.split(':')[0], 10);
}

function isTimeOfDay (time, timeOfDay) {
    const hour = parseHour(time);
    switch(timeOfDay) {
    case 'breakfast':
        return hour >= DAY_TRANSITONS_AT && hour < 11;
    case 'lunch':
        return hour >= 11 && hour < 16;
    case 'dinner':
        return hour >= 16 && hour < 21;
    case 'late night':
        return (hour >= 0 && hour < DAY_TRANSITONS_AT) || hour >=21;
    }
}

function compareTime(timeA, timeB) {
    if (parseHour(timeA) < DAY_TRANSITONS_AT && parseHour(timeB) >= DAY_TRANSITONS_AT) {
        return 1;
    } else if (parseHour(timeB) < DAY_TRANSITONS_AT && parseHour(timeA) >= DAY_TRANSITONS_AT) {
        return -1;
    } else {
        return timeA > timeB ? 1 : -1;
    }
}

export { isTimeOfDay, compareTime }

