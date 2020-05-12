import assert from 'assert';

import isTimeOfDay from '../frontend/is-time-of-day.js';

suite('isTimeOfDay', () => {
    suite('positive', () => {
        test('00:00', () => {
            assert(isTimeOfDay('00:00', 'late night'));
        });
        test('04:59', () => {
            assert(isTimeOfDay('04:49', 'late night'));
        });
        test('05:00', () => {
            assert(isTimeOfDay('05:00', 'breakfast'));
        });
        test('10:59', () => {
            assert(isTimeOfDay('10:59', 'breakfast'));
        });
        test('11:00', () => {
            assert(isTimeOfDay('11:00', 'lunch'));
        });
        test('15:59', () => {
            assert(isTimeOfDay('15:59', 'lunch'));
        });
        test('16:00', () => {
            assert(isTimeOfDay('16:00', 'dinner'));
        });
        test('20:59', () => {
            assert(isTimeOfDay('20:59', 'dinner'));
        });
        test('21:00', () => {
            assert(isTimeOfDay('21:00', 'late night'));
        });
        test('23:59', () => {
            assert(isTimeOfDay('23:59', 'late night'));
        });
    });

    suite('negative', () => {
        // Late night
        test('00:00', () => {
            assert.equal(isTimeOfDay('00:00', 'breakfast'), false);
        });
        test('00:00', () => {
            assert.equal(isTimeOfDay('00:00', 'lunch'), false);
        });
        test('00:00', () => {
            assert.equal(isTimeOfDay('00:00', 'dinner'), false);
        });
        test('04:59', () => {
            assert.equal(isTimeOfDay('04:49', 'breakfast'), false);
        });
        test('04:59', () => {
            assert.equal(isTimeOfDay('04:49', 'lunch'), false);
        });
        test('04:59', () => {
            assert.equal(isTimeOfDay('04:49', 'dinner'), false);
        });
        // Breakfast
        test('05:00', () => {
            assert.equal(isTimeOfDay('05:00', 'lunch'), false);
        });
        test('05:00', () => {
            assert.equal(isTimeOfDay('05:00', 'dinner'), false);
        });
        test('05:00', () => {
            assert.equal(isTimeOfDay('05:00', 'late night'), false);
        });
        test('10:59', () => {
            assert.equal(isTimeOfDay('10:59', 'lunch'), false);
        });
        test('10:59', () => {
            assert.equal(isTimeOfDay('10:59', 'dinner'), false);
        });
        test('10:59', () => {
            assert.equal(isTimeOfDay('10:59', 'late night'), false);
        });
        // Lunch
        test('11:00', () => {
            assert.equal(isTimeOfDay('11:00', 'breakfast'), false);
        });
        test('11:00', () => {
            assert.equal(isTimeOfDay('11:00', 'dinner'), false);
        });
        test('11:00', () => {
            assert.equal(isTimeOfDay('11:00', 'late night'), false);
        });
        test('15:59', () => {
            assert.equal(isTimeOfDay('15:59', 'breakfast'), false);
        });
        test('15:59', () => {
            assert.equal(isTimeOfDay('15:59', 'dinner'), false);
        });
        test('15:59', () => {
            assert.equal(isTimeOfDay('15:59', 'late night'), false);
        });
        // Dinner
        test('16:00', () => {
            assert.equal(isTimeOfDay('16:00', 'breakfast'), false);
        });
        test('16:00', () => {
            assert.equal(isTimeOfDay('16:00', 'lunch'), false);
        });
        test('16:00', () => {
            assert.equal(isTimeOfDay('16:00', 'late night'), false);
        });
        test('20:59', () => {
            assert.equal(isTimeOfDay('20:59', 'breakfast'), false);
        });
        test('20:59', () => {
            assert.equal(isTimeOfDay('20:59', 'lunch'), false);
        });
        test('20:59', () => {
            assert.equal(isTimeOfDay('20:59', 'late night'), false);
        });
        // Late night
        test('21:00', () => {
            assert.equal(isTimeOfDay('21:00', 'breakfast'), false);
        });
        test('21:00', () => {
            assert.equal(isTimeOfDay('21:00', 'lunch'), false);
        });
        test('21:00', () => {
            assert.equal(isTimeOfDay('21:00', 'dinner'), false);
        });
        test('23:59', () => {
            assert.equal(isTimeOfDay('23:59', 'breakfast'), false);
        });
        test('23:59', () => {
            assert.equal(isTimeOfDay('23:59', 'lunch'), false);
        });
        test('23:59', () => {
            assert.equal(isTimeOfDay('23:59', 'dinner'), false);
        });
    });
});
