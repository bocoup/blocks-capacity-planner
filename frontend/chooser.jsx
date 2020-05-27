import {
    Box,
    FormField,
    ProgressBar,
    Select,
    Tooltip,
    Button
} from '@airtable/blocks/ui';
import React, {useMemo, useState} from 'react';
import moment from 'moment';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';

import buildShifts from './build-shifts';
import priceAssignments from './price-assignments';
import Constraints from './constraints';
import ShiftView from './shift-view';
import assignmentsCopy from './assignments-copy';

const containerStyle = {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,

    display: 'flex',
};

function annotateExtremes(collection, propertyName) {
    const all = collection.map((item) => item[propertyName]);
    const extremes = {
        [`max${propertyName}`]: Math.max(...all),
        [`min${propertyName}`]: Math.min(...all),
    };
    return collection.map((item) => Object.assign({}, item, extremes));
}

const sortOptions = [
    {value: 'name', label: 'Name'},
    {value: 'capacity', label: 'Capacity'},
    {value: 'price', label: 'Price'}
];

const producerDisplayOptions = [
    {value: null, label: 'none'},
    {value: 'capacity', label: 'Capacity'},
    {value: 'price', label: 'Price'},
    {value: 'descriptor', label: 'Descriptor'}
];

export default function Chooser({producers, consumers, assignments, onBulkAssign, onAssign}) {
    consumers = annotateExtremes(consumers, 'need');
    producers = annotateExtremes(producers, 'capacity');
    producers = annotateExtremes(producers, 'price');

    const [sort, setSort] = useState('name');
    const [producerDisplay, setProducerDisplay] = useState(null);
    const [budget, setBudget] = useState(10 * 1000);
    const [startDate, setStartDate] = useState(
        () => moment().set('day', 0).startOf('day').utc().startOf('day').add(1, 'week').format()
    );
    const [endDate, setEndDate] = useState(
        () => moment().set('day', 0).startOf('day').utc().startOf('day').add(2, 'week').format()
    );

    const cost = useMemo(
        () => priceAssignments({producers, assignments, startDate, endDate}),
        [producers, assignments, startDate, endDate]
    );

    const barColor = cost / budget <= 1 ? '#32a852' : '#a00';

    const shifts = useMemo(
        () => buildShifts({startDate, endDate, assignments}),
        [startDate, endDate, assignments]
    );

    const areAssignmentsPresentWithinConstraints = assignments
        .some((assignment) => {
            return assignment.date >= startDate && assignment.date <= endDate
        });

    const areConstraintsGreaterThanAWeek = moment.utc(startDate).add(7, 'days') < moment.utc(endDate);

    const isCopyDisabled = areAssignmentsPresentWithinConstraints || areConstraintsGreaterThanAWeek;

    const copyAssignments = () => onBulkAssign(assignmentsCopy({assignments, startDate, endDate}), consumers);

    return (
        <DndProvider backend={Backend}>
            <Box style={{flexDirection: 'column', ...containerStyle}}>
                <Constraints
                    startDate={startDate}
                    onStartDateChange={setStartDate}
                    endDate={endDate}
                    onEndDateChange={setEndDate}
                    budget={budget}
                    onBudgetChange={setBudget}
                />
                <Box padding={2} style={{overflowY: 'scroll'}}>
                    {shifts.map((shift) => (
                        <ShiftView key={shift.date + shift.timeOfDay}
                            shift={shift}
                            consumers={consumers}
                            producers={producers}
                            producerDisplay={producerDisplay}
                            onAssign={onAssign} />
                    ))}
                </Box>

                <Box padding={3} display="flex" alignItems="right">
                    <Box paddingRight={3}>
                        <FormField label="Sort producers">
                            <Select disabled={true} options={sortOptions} value={sort} onChange={setSort} />
                        </FormField>
                    </Box>

                    <Box paddingRight={3}>
                        <FormField label="Producer display">
                            <Select options={producerDisplayOptions} value={producerDisplay} onChange={setProducerDisplay} />
                        </FormField>
                    </Box>

                    <Tooltip
                        content={areAssignmentsPresentWithinConstraints ? "To enable, remove assignments from current schedule." : (areConstraintsGreaterThanAWeek ? "To enable, reduce scheduled constraints to a week." : '')}

                    >
                        {/* This extra div is needed because otherwise the Tooltip isn't shown when the Button is disabled. However, adding it throws a warning. */}
                        <div>
                            <Button
                                marginRight={3}
                                disabled={isCopyDisabled}
                                onClick={copyAssignments}
                            >
                                                            Copy Previous Schedule
                            </Button>
                        </div>
                    </Tooltip>

                    <Box flexGrow={1} paddingRight={3}>
                        <ProgressBar progress={cost/budget} barColor={barColor} style={{height: '1em'}} />
                        ${cost} of ${budget}
                    </Box>
                </Box>
            </Box>
        </DndProvider>
    );
}
