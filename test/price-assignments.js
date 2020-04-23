import assert from 'assert';

import priceAssignments from '../frontend/price-assignments.js';

suite('priceAssignments', () => {
	test('zero assignments', () => {
		const assignments = [];
		const producers = [
			{id: 1, price: 1},
			{id: 2, price: 2},
		];
		const startDate = '2020-04-22T21:34:00.000Z';
		const endDate = '2020-04-28T21:34:00.000Z';

		assert.equal(
			priceAssignments({producers, assignments, startDate, endDate }),
			0
		);
	});

	test('zero assignments in time window', () => {
		const assignments = [
			{producerId: 1, amount: 1, date: '2020-04-22T21:33:59.999Z'},
			{producerId: 1, amount: 1, date: '2020-04-28T21:34:00.001Z'},
		];
		const producers = [
			{id: 1, price: 1},
			{id: 2, price: 2},
		];
		const startDate = '2020-04-22T21:34:00.000Z';
		const endDate = '2020-04-28T21:34:00.000Z';

		assert.equal(
			priceAssignments({producers, assignments, startDate, endDate }),
			0
		);
	});

	test('one assignment', () => {
		const assignments = [
			{producerId: 2, amount: 4, date: '2020-04-23T00:00:00.000Z'},
		];
		const producers = [
			{id: 1, price: 1},
			{id: 2, price: 2},
		];
		const startDate = '2020-04-22T21:34:00.000Z';
		const endDate = '2020-04-28T21:34:00.000Z';

		assert.equal(
			priceAssignments({producers, assignments, startDate, endDate }),
			8
		);
	});

	test('one assignment in time window', () => {
		const assignments = [
			{producerId: 1, amount: 3, date: '2020-04-22T21:33:59.999Z'},
			{producerId: 1, amount: 4, date: '2020-04-25T21:33:59.999Z'},
			{producerId: 1, amount: 5, date: '2020-04-28T21:34:00.001Z'},
		];
		const producers = [
			{id: 1, price: 1},
			{id: 2, price: 2},
		];
		const startDate = '2020-04-22T21:34:00.000Z';
		const endDate = '2020-04-28T21:34:00.000Z';

		assert.equal(
			priceAssignments({producers, assignments, startDate, endDate }),
			4
		);
	});

	test('many assignments', () => {
		const assignments = [
			{producerId: 1, amount: 4, date: '2020-04-23T00:00:00.000Z'},
			{producerId: 2, amount: 8, date: '2020-04-23T00:00:00.000Z'},
		];
		const producers = [
			{id: 1, price: 1},
			{id: 2, price: 2},
		];
		const startDate = '2020-04-22T21:34:00.000Z';
		const endDate = '2020-04-28T21:34:00.000Z';

		assert.equal(
			priceAssignments({producers, assignments, startDate, endDate }),
			20
		);
	});

	test('many assignments in time window', () => {
		const assignments = [
			{producerId: 1, amount: 3, date: '2020-04-22T21:33:59.999Z'},
			{producerId: 1, amount: 4, date: '2020-04-25T21:33:59.999Z'},
			{producerId: 2, amount: 4, date: '2020-04-25T21:33:59.999Z'},
			{producerId: 1, amount: 5, date: '2020-04-28T21:34:00.001Z'},
		];
		const producers = [
			{id: 1, price: 1},
			{id: 2, price: 2},
		];
		const startDate = '2020-04-22T21:34:00.000Z';
		const endDate = '2020-04-28T21:34:00.000Z';

		assert.equal(
			priceAssignments({producers, assignments, startDate, endDate }),
			12
		);
	});
});
