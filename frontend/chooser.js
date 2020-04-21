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
import fillOrders from './fill-orders';
import Constraints from './constraints';
import Shift from './shift';

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

const purchaseStrategies = [
	{value: 'cheap', label: 'Cheap'},
	{value: 'fair', label: 'Fair'}
];

function useAssignments(initial) {
	const [assignments, setAssignments] = useState(Object.freeze(initial));
	const assign = (date, consumerId, producerId) => {
		const newAssignments = assignments
			.filter((assignment) => {
				return !(
					assignment.date === date &&
					assignment.producerId === producerId
				);
			});

		if (consumerId !== null) {
			newAssignments.push({date, consumerId, producerId});
		}

		setAssignments(Object.freeze(newAssignments));
	};

	return [assignments, assign];
}

const makeWindows = (startDate, endDate) => {
	const current = moment(startDate);
	const end = moment(endDate);
	const elements = [];

	if (!current.isValid() || !end.isValid() || current > end) {
		return elements;
	}

	while (!current.isSame(end, 'day')) {
		const date = current.format('YYYY-MM-DD');
		elements.push(
			{date, timeOfDay: 'afternoon'}, {date, timeOfDay: 'evening'}
		);
		current.add(1, 'day');
	}

	return elements;
};

export default function Chooser({producers, consumers}) {
	consumers = annotateExtremes(consumers, 'need');
	producers = annotateExtremes(producers, 'capacity');
	producers = annotateExtremes(producers, 'price');

	const [sort, setSort] = useState('name');
	const [producerStat, setProducerStat] = useState(null);
	const [strategy, setStrategy] = useState('cheap');
	const [assignments, assign] = useAssignments([]);
	const [budget, setBudget] = useState(10 * 1000);
	const [startDate, setStartDate] = useState(
		() => moment().set('day', 0).add(1, 'week').format('YYYY-MM-DD')
	);
	const [endDate, setEndDate] = useState(
		() => moment().set('day', 0).add(2, 'week').format('YYYY-MM-DD')
	);
	const [isShowingConstraints, setShowingConstraints] = useState(false);

	const windows = useMemo(
		() => makeWindows(startDate, endDate),
		[startDate, endDate]
	);
	const cost = fillOrders({strategy, assignments, producers, consumers})
		.reduce((total, order) => {
			const producer = producers.find(({id}) => id === order.producerId);
			return total + producer.price * order.quantity;
		}, 0);

	const barColor = cost / budget <= 1 ? '#32a852' : '#a00';

	const shifts = buildShifts(windows, producers, consumers);

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
				{shifts.map(({window, producers, consumers}) => (
					<Shift key={window.date + window.timeOfDay}
						date={`${window.date} ${window.timeOfDay}`}
						producers={producers}
						consumers={consumers}
						producerStat={producerStat}
						onAssign={assign} />
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

				<Box paddingRight={3}>
					<FormField label="Purchase strategy">
						<Select options={purchaseStrategies} value={strategy} onChange={setStrategy} />
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

				<Button icon="thumbsUp" variant="primary" disabled={true}>
					Apply Schedule
				</Button>
			</Box>
		</Box>
	);
}
