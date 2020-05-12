import assert from 'assert';

import isTimeOfDay from '../frontend/is-time-of-day.js';

suite('isTimeOfDay', () => {
    suite('positive', () => {
        test('00:00', () => {
            assert(isTimeOfDay('00:00', 'afternoon'));
        });
        test('12:00', () => {
            assert(isTimeOfDay('12:00', 'afternoon'));
        });
        test('12:01', () => {
            assert(isTimeOfDay('12:01', 'afternoon'));
        });
        test('15:59', () => {
            assert(isTimeOfDay('15:59', 'afternoon'));
        });
        test('16:00', () => {
            assert(isTimeOfDay('16:00', 'evening'));
        });
        test('23:59', () => {
            assert(isTimeOfDay('23:59', 'evening'));
        });
    });

    suite('negative', () => {
        test('00:00', () => {
            assert.equal(isTimeOfDay('00:00', 'evening'), false);
        });
        test('12:00', () => {
            assert.equal(isTimeOfDay('12:00', 'evening'), false);
        });
        test('12:01', () => {
            assert.equal(isTimeOfDay('12:01', 'evening'), false);
        });
        test('15:59', () => {
            assert.equal(isTimeOfDay('15:59', 'evening'), false);
        });
        test('16:00', () => {
            assert.equal(isTimeOfDay('16:00', 'afternoon'), false);
        });
        test('23:59', () => {
            assert.equal(isTimeOfDay('23:59', 'afternoon'), false);
        });
    });
});
