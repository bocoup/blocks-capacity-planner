import assert from 'assert';

import buildShifts from '../frontend/build-shifts.js';

suite('buildShifts', () => {
	test('time values', () => {
		const shifts = buildShifts({
			startDate: '2020-04-23', endDate: '2020-04-26', assignments: []
		});

		assert(Array.isArray(shifts));
		assert.equal(shifts.length, 6);
		assert.deepEqual(
			[shifts[0].date, shifts[0].day, shifts[0].timeOfDay],
			['2020-04-23', 'Thursday', 'afternoon']
		);
		assert.deepEqual(
			[shifts[1].date, shifts[1].day, shifts[1].timeOfDay],
			['2020-04-23', 'Thursday', 'evening']
		);
		assert.deepEqual(
			[shifts[2].date, shifts[2].day, shifts[2].timeOfDay],
			['2020-04-24', 'Friday', 'afternoon']
		);
		assert.deepEqual(
			[shifts[3].date, shifts[3].day, shifts[3].timeOfDay],
			['2020-04-24', 'Friday', 'evening']
		);
		assert.deepEqual(
			[shifts[4].date, shifts[4].day, shifts[4].timeOfDay],
			['2020-04-25', 'Saturday', 'afternoon']
		);
		assert.deepEqual(
			[shifts[5].date, shifts[5].day, shifts[5].timeOfDay],
			['2020-04-25', 'Saturday', 'evening']
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
