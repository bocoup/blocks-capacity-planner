import {
	Box,
	Button,
	FormField,
	ProgressBar,
	Select,
} from '@airtable/blocks/ui';
import React, {useMemo, useState} from 'react';
import moment from 'moment';

import buildShifts from './build-shifts';
import priceAssignments from './price-assignments';
import Constraints from './constraints';
import ShiftView from './shift-view';

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

const producerStats = [
	{value: null, label: 'none'},
	{value: 'capacity', label: 'Capacity'},
	{value: 'price', label: 'Price'}
];

export default function Chooser({producers, consumers, assignments, onAssign}) {
	consumers = annotateExtremes(consumers, 'need');
	producers = annotateExtremes(producers, 'capacity');
	producers = annotateExtremes(producers, 'price');

	const [sort, setSort] = useState('name');
	const [producerStat, setProducerStat] = useState(null);
	const [budget, setBudget] = useState(10 * 1000);
	const [startDate, setStartDate] = useState(
		() => moment().set('day', 0).add(1, 'week').format('YYYY-MM-DD')
	);
	const [endDate, setEndDate] = useState(
		() => moment().set('day', 0).add(2, 'week').format('YYYY-MM-DD')
	);
	const [isShowingConstraints, setShowingConstraints] = useState(false);

	const cost = useMemo(
		() => priceAssignments({producers, assignments, startDate, endDate}),
		[producers, assignments, startDate, endDate]
	);

	const barColor = cost / budget <= 1 ? '#32a852' : '#a00';

	const shifts = useMemo(
		() => buildShifts({startDate, endDate, assignments}),
		[startDate, endDate, assignments]
	);

	const constraints = isShowingConstraints ?
		<Constraints
			onClose={() => setShowingConstraints(false)}
			startDate={startDate}
			onStartDateChange={setStartDate}
			endDate={endDate}
			onEndDateChange={setEndDate}
			budget={budget}
			onBudgetChange={setBudget}
		/> : '';

	return (
		<Box style={{flexDirection: 'column', ...containerStyle}}>
			{constraints}

			<Box padding={2} style={{overflowY: 'scroll'}}>
				{shifts.map((shift) => (
					<ShiftView key={shift.date + shift.timeOfDay}
						shift={shift}
						consumers={consumers}
						producers={producers}
						producerStat={producerStat}
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
					<FormField label="Producer statistic">
						<Select options={producerStats} value={producerStat} onChange={setProducerStat} />
					</FormField>
				</Box>

				<Button
					marginRight={3}
					onClick={() => setShowingConstraints(true)}
					>
					Schedule constraints
				</Button>

				<Box flexGrow={1} paddingRight={3}>
					<ProgressBar progress={cost/budget} barColor={barColor} style={{height: '1em'}} />
					${cost} of ${budget}
				</Box>
			</Box>
		</Box>
	);
}
