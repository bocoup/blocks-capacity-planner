import assert from 'assert';

import assignmentsCopy from '../frontend/assignments-copy.js';

suite('assignmentsCopy', () => {
	test('one matching assignment - one week range', () => {
		const date = '2020-04-22T16:30:00.000Z';
		const assignments = [
          {name: 'create', consumerId: 1, producerId: 2, amount: 100, date},
        ];
        const startDate = '2020-04-24T16:30:00.000Z';
        const endDate = '2020-05-01T16:30:00.000Z';

		assert.deepEqual(assignmentsCopy({ assignments, startDate, endDate }), [
          {name: 'create', consumerId: 1, producerId: 2, amount: 100, date: '2020-04-29T16:30:00Z' },
        ]);
	});

	test('on one matching assignment - two week range', () => {
		const date = '2020-04-22T16:30:00.000Z';
		const assignments = [
          {name: 'create', consumerId: 1, producerId: 2, amount: 100, date},
        ];
        const startDate = '2020-04-24T16:30:00.000Z';
        const endDate = '2020-05-08T16:30:00.000Z';

		assert.deepEqual(assignmentsCopy({ assignments, startDate, endDate }), [
          {name: 'create', consumerId: 1, producerId: 2, amount: 100, date: '2020-04-29T16:30:00Z' },
          {name: 'create', consumerId: 1, producerId: 2, amount: 100, date: '2020-05-06T16:30:00Z' },
        ]);
	});

	test('on one matching assignment - leap year', () => {
		const date = '2020-12-26T16:30:00.000Z';
		const assignments = [
          {name: 'create', consumerId: 1, producerId: 2, amount: 100, date},
        ];
        const startDate = '2020-12-29T16:30:00.000Z';
        const endDate = '2021-01-11T16:30:00.000Z';

		assert.deepEqual(assignmentsCopy({ assignments, startDate, endDate }), [
          {name: 'create', consumerId: 1, producerId: 2, amount: 100, date: '2021-01-02T16:30:00Z' },
          {name: 'create', consumerId: 1, producerId: 2, amount: 100, date: '2021-01-09T16:30:00Z' },
        ]);
	});
});
