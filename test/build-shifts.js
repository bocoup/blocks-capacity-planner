import assert from 'assert';

import buildShifts from '../frontend/build-shifts.js';

suite('buildShifts', () => {
    test('time values', () => {
        const shifts = buildShifts({
            startDate: '2020-04-23', endDate: '2020-04-26', assignments: []
        });

        assert(Array.isArray(shifts));
        assert.equal(shifts.length, 12);
        assert.deepEqual(
            [shifts[0].date, shifts[0].day, shifts[0].timeOfDay],
            ['2020-04-23', 'Thursday', 'breakfast']
        );
        assert.deepEqual(
            [shifts[1].date, shifts[1].day, shifts[1].timeOfDay],
            ['2020-04-23', 'Thursday', 'lunch']
        );
        assert.deepEqual(
            [shifts[2].date, shifts[2].day, shifts[2].timeOfDay],
            ['2020-04-23', 'Thursday', 'dinner']
        );
        assert.deepEqual(
            [shifts[3].date, shifts[3].day, shifts[3].timeOfDay],
            ['2020-04-23', 'Thursday', 'late night']
        );
        assert.deepEqual(
            [shifts[4].date, shifts[4].day, shifts[4].timeOfDay],
            ['2020-04-24', 'Friday', 'breakfast']
        );
        assert.deepEqual(
            [shifts[5].date, shifts[5].day, shifts[5].timeOfDay],
            ['2020-04-24', 'Friday', 'lunch']
        );
        assert.deepEqual(
            [shifts[6].date, shifts[6].day, shifts[6].timeOfDay],
            ['2020-04-24', 'Friday', 'dinner']
        );
        assert.deepEqual(
            [shifts[7].date, shifts[7].day, shifts[7].timeOfDay],
            ['2020-04-24', 'Friday', 'late night']
        );
        assert.deepEqual(
            [shifts[8].date, shifts[8].day, shifts[8].timeOfDay],
            ['2020-04-25', 'Saturday', 'breakfast']
        );
        assert.deepEqual(
            [shifts[9].date, shifts[9].day, shifts[9].timeOfDay],
            ['2020-04-25', 'Saturday', 'lunch']
        );
        assert.deepEqual(
            [shifts[10].date, shifts[10].day, shifts[10].timeOfDay],
            ['2020-04-25', 'Saturday', 'dinner']
        );
        assert.deepEqual(
            [shifts[11].date, shifts[11].day, shifts[11].timeOfDay],
            ['2020-04-25', 'Saturday', 'late night']
        );
    });

    test('invalid start date', () => {
        const shifts = buildShifts({
            startDate: '2020-02-30', endDate: '2020-04-26', assignments: []
        });

        assert(Array.isArray(shifts));
        assert.equal(shifts.length, 0);
    });

    test('invalid end date', () => {
        const shifts = buildShifts({
            startDate: '2020-04-23', endDate: '2020-04-31', assignments: []
        });

        assert(Array.isArray(shifts));
        assert.equal(shifts.length, 0);
    });

    test('end date preceded start date', () => {
        const shifts = buildShifts({
            startDate: '2020-04-26', endDate: '2020-04-23', assignments: []
        });

        assert(Array.isArray(shifts));
        assert.equal(shifts.length, 0);
    });
});
