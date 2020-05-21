import assert from 'assert';

import assignmentsCopy from '../frontend/assignments-copy.js';

suite('assignmentsCopy', () => {
    test('matching assignment', () => {
        const date = '2020-04-22T16:30:00.000Z';
        const assignments = [
            {id: 32, consumerId: 1, producerId: 2, amount: 100, date},
        ];
        const startDate = '2020-04-24T16:30:00.000Z';
        const endDate = '2020-05-01T16:30:00.000Z';

        assert.deepEqual(assignmentsCopy({ assignments, startDate, endDate }), [
            {consumerId: 1, producerId: 2, amount: 100, date: '2020-04-29T16:30:00Z' },
        ]);
    });

    test('no matching assignment - end date out of range', () => {
        const date = '2020-04-22T16:30:00.000Z';
        const assignments = [
            {id: 32, consumerId: 1, producerId: 2, amount: 100, date},
        ];
        const startDate = '2020-04-24T16:30:00.000Z';
        const endDate = '2020-04-28T16:30:00.000Z';

        assert.deepEqual(assignmentsCopy({ assignments, startDate, endDate }), []);
    });

    test('no matching assignment - assignment not a week before', () => {
        const date = '2020-04-16T16:30:00.000Z';
        const assignments = [
            {id: 32, consumerId: 1, producerId: 2, amount: 100, date},
        ];
        const startDate = '2020-04-24T16:30:00.000Z';
        const endDate = '2020-05-01T16:30:00.000Z';

        assert.deepEqual(assignmentsCopy({ assignments, startDate, endDate }), []);
    });
});
