import assert from 'assert';
import moment from 'moment';

import expandDates from '../frontend/expand-dates.js'

const assertTime = (actualDate, expectedString) => {
    assert.equal(moment.utc(actualDate).format('YYYY-MM-DD HH:mm'), expectedString);
};

suite('expandDates', () => {
    test('expands times that fall within boundaries', () => {
        const dates = expandDates('2020-04-13', '2020-04-15', [
            {day: 'Tuesday', time: '13:00'}
        ]);

        assert(Array.isArray(dates));
        assert.equal(dates.length, 1);
        assertTime(dates[0], '2020-04-14 13:00');
    });

    test('expands times that fall on lower boundary', () => {
        const dates = expandDates('2020-04-13', '2020-04-15', [
            {day: 'Monday', time: '13:23'}
        ]);

        assert(Array.isArray(dates));
        assert.equal(dates.length, 1);
        assertTime(dates[0], '2020-04-13 13:23');
    });

    test('expands times that fall on upper boundary', () => {
        const dates = expandDates('2020-04-13', '2020-04-15', [
            {day: 'Wednesday', time: '17:53'}
        ]);

        assert(Array.isArray(dates));
        assert.equal(dates.length, 1);
        assertTime(dates[0], '2020-04-15 17:53');
    });

    test('ignores times that fall before lower boundary', () => {
        const dates = expandDates('2020-04-13', '2020-04-15', [
            {day: 'Sunday', time: '17:53'}
        ]);

        assert(Array.isArray(dates));
        assert.equal(dates.length, 0);
    });

    test('ignores times that fall after upper boundary', () => {
        const dates = expandDates('2020-04-13', '2020-04-15', [
            {day: 'Thursday', time: '17:53'}
        ]);

        assert(Array.isArray(dates));
        assert.equal(dates.length, 0);
    });

    test('expands times for each occurance', () => {
        const dates = expandDates('2020-04-06', '2020-04-29', [
            {day: 'Tuesday', time: '12:22'}
        ]);

        assert(Array.isArray(dates));
        assert.equal(dates.length, 4);
        assertTime(dates[0], '2020-04-07 12:22');
        assertTime(dates[1], '2020-04-14 12:22');
        assertTime(dates[2], '2020-04-21 12:22');
        assertTime(dates[3], '2020-04-28 12:22');
    });

    test('expands multiple times for same date', () => {
        const dates = expandDates('2020-04-13', '2020-04-15', [
            {day: 'Tuesday', time: '13:00'},
            {day: 'Tuesday', time: '22:05'}
        ]);

        assert(Array.isArray(dates));
        assert.equal(dates.length, 2);
        assertTime(dates[0], '2020-04-14 13:00');
        assertTime(dates[1], '2020-04-14 22:05');
    });
});
