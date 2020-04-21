'use strict';

import assert from 'assert';

import assign from '../frontend/assign.js';

suite('assign', () => {
	const consumers = [];
	const producers = [];
	const assignments = [];
	const a = assign.bind(null, consumers, producers, assignments);

	setup(() => {
		consumers.length = 0;
		producers.length = 0;
		assignments.length = 0;
	});

	test('entire capacity to empty consumer', () => {
		consumers.push({id: 1, need: 3});
		producers.push({id: 1, capacity: 3});
		assignments.push({consumerId: null, producerId: 1, amount: 3});

		assert.deepEqual(
			a(null, 1, 1),
			[
				{consumerId: 1, producerId: 1, amount: 3},
			]
		);
	});

	test('partial capacity to empty consumer', () => {
		consumers.push({id: 1, need: 2});
		producers.push({id: 1, capacity: 3});
		assignments.push({consumerId: null, producerId: 1, amount: 3});

		assert.deepEqual(
			a(null, 1, 1),
			[
				{consumerId: null, producerId: 1, amount: 1},
				{consumerId: 1, producerId: 1, amount: 2},
			]
		);
	});

	test('entire capacity to partially-satisfied consumer', () => {
		consumers.push({id: 1, need: 5});
		producers.push({id: 1, capacity: 2});
		producers.push({id: 2, capacity: 3});
		assignments.push({consumerId: 1, producerId: 1, amount: 2});
		assignments.push({consumerId: null, producerId: 2, amount: 3});

		assert.deepEqual(
			a(null, 1, 2),
			[
				{consumerId: 1, producerId: 1, amount: 2},
				{consumerId: 1, producerId: 2, amount: 3},
			]
		);
	});

	test('partial capacity to partially-satisfied consumer', () => {
		consumers.push({id: 1, need: 3});
		producers.push({id: 1, capacity: 2});
		producers.push({id: 2, capacity: 3});
		assignments.push({consumerId: 1, producerId: 1, amount: 2});
		assignments.push({consumerId: null, producerId: 2, amount: 3});

		assert.deepEqual(
			a(null, 1, 2),
			[
				{consumerId: 1, producerId: 1, amount: 2},
				{consumerId: null, producerId: 2, amount: 2},
				{consumerId: 1, producerId: 2, amount: 1},
			]
		);
	});


	test('zero capacity to fully satisfied consumer', () => {
		consumers.push({id: 1, need: 3});
		producers.push({id: 1, capacity: 3});
		producers.push({id: 2, capacity: 3});
		assignments.push({consumerId: 1, producerId: 1, amount: 3});
		assignments.push({consumerId: null, producerId: 2, amount: 3});

		assert.deepEqual(
			a(null, 1, 2),
			[
				{consumerId: 1, producerId: 1, amount: 3},
				{consumerId: null, producerId: 2, amount: 3},
			]
		);
	});
});
