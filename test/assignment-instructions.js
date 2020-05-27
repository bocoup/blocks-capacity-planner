import assert from 'assert';

import assignmentInstructions from '../frontend/assignment-instructions.js';

suite('assignmentInstructions', () => {
    test('unassigned - reject (already unassigned)', () => {
        const date = '2020-04-22T16:30:00.000Z';
        const params = {
            assignments: [
                {id: 1, consumerId: 1, producerId: 2, amount: 1, date},
                {id: 2, consumerId: 1, producerId: 3, amount: 2, date},
                {id: 3, consumerId: 2, producerId: 4, amount: 2, date},
            ],
            assignment: {
                id: 'NullAssignment:foo',
                consumerId: null,
                producerId: 1,
                amount: 1,
                date,
            },
            consumerId: null,
            consumers: [
                {id: 1, need: 6},
            ],
            date,
        };

        assert.deepEqual(assignmentInstructions(params), []);
    });

    test('unassigned - reject (consumer fulfilled)', () => {
        const date = '2020-04-22T16:30:00.000Z';
        const params = {
            assignments: [
                {id: 1, consumerId: 1, producerId: 2, amount: 4, date},
                {id: 2, consumerId: 1, producerId: 3, amount: 2, date},
            ],
            assignment: {
                id: 'NullAssignment:foo',
                consumerId: null,
                producerId: 1,
                amount: 3,
                date,
            },
            consumerId: 1,
            consumers: [
                {id: 1, need: 6},
            ],
            date,
        };

        assert.deepEqual(assignmentInstructions(params), []);
    });

    test('unassigned - transfer', () => {
        const date = '2020-04-22T16:30:00.000Z';
        const params = {
            assignments: [
                {id: 1, consumerId: 1, producerId: 2, amount: 1, date},
                {id: 2, consumerId: 1, producerId: 3, amount: 2, date},
            ],
            assignment: {
                id: 'NullAssignment:foo',
                consumerId: null,
                producerId: 1,
                amount: 2,
                date,
            },
            consumerId: 1,
            consumers: [
                {id: 1, need: 6},
            ],
            date,
        };

        assert.deepEqual(
            assignmentInstructions(params),
            [
                {name: 'create', consumerId: 1, producerId: 1, amount: 2, date},
            ]
        );
    });

    test('unassigned - transfer to fulfill', () => {
        const date = '2020-04-22T16:30:00.000Z';
        const params = {
            assignments: [
                {id: 1, consumerId: 1, producerId: 2, amount: 1, date},
                {id: 2, consumerId: 1, producerId: 3, amount: 2, date},
            ],
            assignment: {
                id: 'NullAssignment:foo',
                consumerId: null,
                producerId: 1,
                amount: 3,
                date,
            },
            consumerId: 1,
            consumers: [
                {id: 1, need: 6},
            ],
            date,
        };

        assert.deepEqual(
            assignmentInstructions(params),
            [
                {name: 'create', consumerId: 1, producerId: 1, amount: 3, date},
            ]
        );
    });

    test('unassigned - split', () => {
        const date = '2020-04-22T16:30:00.000Z';
        const params = {
            assignments: [
                {id: 1, consumerId: 1, producerId: 2, amount: 1, date},
                {id: 2, consumerId: 1, producerId: 3, amount: 3, date},
                // Ignores assignments for other producers
                {id: 3, consumerId: 2, producerId: 3, amount: 3, date},
                // Ignores assignments for same producer at other time
                {id: 4, consumerId: 1, producerId: 2, amount: 1, date: '2020-04-22T13:00:00.000Z'},
            ],
            assignment: {
                id: 'NullAssignment:foo',
                consumerId: null,
                producerId: 1,
                amount: 3,
                date,
            },
            consumerId: 1,
            consumers: [
                {id: 1, need: 6},
            ],
            date,
        };

        assert.deepEqual(
            assignmentInstructions(params),
            [
                {name: 'create', consumerId: 1, producerId: 1, amount: 2, date},
            ]
        );
    });

    test('unassigned - merge', () => {
        const date = '2020-04-22T16:30:00.000Z';
        const params = {
            assignments: [
                {id: 1, consumerId: 1, producerId: 2, amount: 1, date},
                {id: 2, consumerId: 1, producerId: 3, amount: 1, date},
                {id: 3, consumerId: 1, producerId: 1, amount: 1, date},
                // Ignores assignments for other producers
                {id: 4, consumerId: 2, producerId: 3, amount: 3, date},
                // Ignores assignments for same producer at other time
                {id: 5, consumerId: 1, producerId: 2, amount: 1, date: '2020-04-22T13:00:00.000Z'},
            ],
            assignment: {
                id: 'NullAssignment:foo',
                consumerId: null,
                producerId: 1,
                amount: 2,
                date,
            },
            consumerId: 1,
            consumers: [
                {id: 1, need: 6},
            ],
            date,
        };

        assert.deepEqual(
            assignmentInstructions(params),
            [
                {name: 'update', id: 3, amount: 3},
            ]
        );
    });

    test('unassigned - merge to fulfill', () => {
        const date = '2020-04-22T16:30:00.000Z';
        const params = {
            assignments: [
                {id: 1, consumerId: 1, producerId: 2, amount: 1, date},
                {id: 2, consumerId: 1, producerId: 3, amount: 1, date},
                {id: 3, consumerId: 1, producerId: 1, amount: 1, date},
                // Ignores assignments for other producers
                {id: 4, consumerId: 2, producerId: 3, amount: 3, date},
                // Ignores assignments for same producer at other time
                {id: 5, consumerId: 1, producerId: 2, amount: 1, date: '2020-04-22T13:00:00.000Z'},
            ],
            assignment: {
                id: 'NullAssignment:foo',
                consumerId: null,
                producerId: 1,
                amount: 3,
                date,
            },
            consumerId: 1,
            consumers: [
                {id: 1, need: 6},
            ],
            date,
        };

        assert.deepEqual(
            assignmentInstructions(params),
            [
                {name: 'update', id: 3, amount: 4},
            ]
        );
    });

    test('unassigned - merge and split', () => {
        const date = '2020-04-22T16:30:00.000Z';
        const params = {
            assignments: [
                {id: 1, consumerId: 1, producerId: 2, amount: 1, date},
                {id: 2, consumerId: 1, producerId: 3, amount: 3, date},
                {id: 3, consumerId: 1, producerId: 1, amount: 1, date},
                // Ignores assignments for other producers
                {id: 4, consumerId: 2, producerId: 3, amount: 3, date},
                // Ignores assignments for same producer on other date
                {id: 5, consumerId: 1, producerId: 2, amount: 1, date: '2020-04-22T13:00:00.000Z'},
            ],
            assignment: {
                id: 'NullAssignment:foo',
                consumerId: null,
                producerId: 1,
                amount: 2,
                date,
            },
            consumerId: 1,
            consumers: [
                {id: 1, need: 6},
            ],
            date,
        };

        assert.deepEqual(
            assignmentInstructions(params),
            [
                {name: 'update', id: 3, amount: 2},
            ]
        );
    });

    test('assigned - reject (consumer fulfilled)', () => {
        const date = '2020-04-22T16:30:00.000Z';
        const params = {
            assignments: [
                {id: 1, consumerId: 1, producerId: 2, amount: 4, date},
                {id: 2, consumerId: 1, producerId: 3, amount: 2, date},
                {id: 3, consumerId: 2, producerId: 4, amount: 1, date},
            ],
            consumerId: 1,
            consumers: [
                {id: 1, need: 6},
            ],
            date,
        };
        params.assignment = params.assignments[2];

        assert.deepEqual(assignmentInstructions(params), []);
    });

    test('assigned - unassign', () => {
        const date = '2020-04-22T16:30:00.000Z';
        const params = {
            assignments: [
                {id: 1, consumerId: 1, producerId: 2, amount: 1, date},
                {id: 2, consumerId: 1, producerId: 3, amount: 2, date},
                {id: 3, consumerId: 2, producerId: 4, amount: 2, date},
            ],
            consumerId: null,
            consumers: [
                {id: 1, need: 6},
            ],
            date,
        };
        params.assignment = params.assignments[2];

        assert.deepEqual(
            assignmentInstructions(params),
            [
                {name: 'delete', id: 3},
            ]
        );
    });

    test('assigned - transfer', () => {
        const date = '2020-04-22T16:30:00.000Z';
        const params = {
            assignments: [
                {id: 1, consumerId: 1, producerId: 2, amount: 1, date},
                {id: 2, consumerId: 1, producerId: 3, amount: 2, date},
                {id: 3, consumerId: 2, producerId: 4, amount: 2, date},
            ],
            consumerId: 1,
            consumers: [
                {id: 1, need: 6},
            ],
            date,
        };
        params.assignment = params.assignments[2];

        assert.deepEqual(
            assignmentInstructions(params),
            [
                {name: 'create', consumerId: 1, producerId: 4, amount: 2, date},
                {name: 'delete', id: 3},
            ]
        );
    });

    test('assigned - transfer to fulfill', () => {
        const date = '2020-04-22T16:30:00.000Z';
        const params = {
            assignments: [
                {id: 1, consumerId: 1, producerId: 2, amount: 1, date},
                {id: 2, consumerId: 1, producerId: 3, amount: 2, date},
                {id: 3, consumerId: 2, producerId: 4, amount: 3, date},
            ],
            consumerId: 1,
            consumers: [
                {id: 1, need: 6},
            ],
            date,
        };
        params.assignment = params.assignments[2];

        assert.deepEqual(
            assignmentInstructions(params),
            [
                {name: 'create', consumerId: 1, producerId: 4, amount: 3, date},
                {name: 'delete', id: 3},
            ]
        );
    });

    test('assigned - split', () => {
        const date = '2020-04-22T16:30:00.000Z';
        const params = {
            assignments: [
                {id: 1, consumerId: 1, producerId: 2, amount: 1, date},
                {id: 2, consumerId: 1, producerId: 3, amount: 3, date},
                // Ignores assignments for other producers
                {id: 3, consumerId: 2, producerId: 3, amount: 3, date},
                // Ignores assignments for same producer at other time
                {id: 4, consumerId: 1, producerId: 2, amount: 1, date: '2020-04-22T13:00:00.000Z'},
                {id: 6, consumerId: 2, producerId: 1, amount: 3, date},
            ],
            consumerId: 1,
            consumers: [
                {id: 1, need: 6},
            ],
            date,
        };
        params.assignment = params.assignments[4];

        assert.deepEqual(
            assignmentInstructions(params),
            [
                {name: 'create', consumerId: 1, producerId: 1, amount: 2, date},
                {name: 'update', id: 6, amount: 1},
            ]
        );
    });

    test('assigned - merge', () => {
        const date = '2020-04-22T16:30:00.000Z';
        const params = {
            assignments: [
                {id: 1, consumerId: 1, producerId: 2, amount: 1, date},
                {id: 2, consumerId: 1, producerId: 3, amount: 1, date},
                {id: 3, consumerId: 1, producerId: 1, amount: 1, date},
                // Ignores assignments for other producers
                {id: 4, consumerId: 2, producerId: 3, amount: 3, date},
                // Ignores assignments for same producer on other date
                {id: 5, consumerId: 1, producerId: 2, amount: 1, date: '2020-04-22T13:00:00.000Z'},
                {id: 7, consumerId: 2, producerId: 1, amount: 2, date},
            ],
            consumerId: 1,
            consumers: [
                {id: 1, need: 6},
            ],
            date,
        };
        params.assignment = params.assignments[5];

        assert.deepEqual(
            assignmentInstructions(params),
            [
                {name: 'update', id: 3, amount: 3},
                {name: 'delete', id: 7},
            ]
        );
    });

    test('assigned - merge to fulfill', () => {
        const date = '2020-04-22T16:30:00.000Z';
        const params = {
            assignments: [
                {id: 1, consumerId: 1, producerId: 2, amount: 1, date},
                {id: 2, consumerId: 1, producerId: 3, amount: 1, date},
                {id: 3, consumerId: 1, producerId: 1, amount: 1, date},
                // Ignores assignments for other producers
                {id: 4, consumerId: 2, producerId: 3, amount: 3, date},
                // Ignores assignments for same producer on other date
                {id: 5, consumerId: 1, producerId: 2, amount: 1, date: '2020-04-22T13:00:00.000Z'},
                {id: 7, consumerId: 2, producerId: 1, amount: 3, date},
            ],
            consumerId: 1,
            consumers: [
                {id: 1, need: 6},
            ],
            date,
        };
        params.assignment = params.assignments[5];

        assert.deepEqual(
            assignmentInstructions(params),
            [
                {name: 'update', id: 3, amount: 4},
                {name: 'delete', id: 7},
            ]
        );
    });

    test('assigned - merge and split', () => {
        const date = '2020-04-22T16:30:00.000Z';
        const params = {
            assignments: [
                {id: 1, consumerId: 1, producerId: 2, amount: 1, date},
                {id: 2, consumerId: 1, producerId: 3, amount: 1, date},
                {id: 3, consumerId: 1, producerId: 1, amount: 1, date},
                // Ignores assignments for other producers
                {id: 4, consumerId: 2, producerId: 3, amount: 3, date},
                // Ignores assignments for same producer on other date
                {id: 5, consumerId: 1, producerId: 2, amount: 1, date: '2020-04-22T13:00:00.000Z'},
                {id: 7, consumerId: 2, producerId: 1, amount: 4, date},
            ],
            consumerId: 1,
            consumers: [
                {id: 1, need: 6},
            ],
            date,
        };
        params.assignment = params.assignments[5];

        assert.deepEqual(
            assignmentInstructions(params),
            [
                {name: 'update', id: 3, amount: 4},
                {name: 'update', id: 7, amount: 1},
            ]
        );
    });
});
