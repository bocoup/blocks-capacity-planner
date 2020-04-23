import React, {useCallback, useState} from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import {
	Box,
	Heading,
	Icon,
	ProgressBar,
} from '@airtable/blocks/ui';

import assignmentInstructions from './assignment-instructions';
import buildNullAssignments from './build-null-assignments';
import isTimeOfDay from './is-time-of-day';
import Rating from './rating';

function ProducerDropZone({as, children, consumerId, onAssign, accept, ...rest}) {
	const El = as || 'div';
	const [, drop] = useDrop({
		accept,
		drop(item) {
			onAssign({sourceAssignmentId: item.id, newConsumerId: consumerId});
		}
	});

	return (
		<El ref={drop} {...rest}>
			{children}
		</El>
	);
}

function ProducerList({consumerId, style, producers, assignments, stat, type}) {
	const items = assignments
		.filter((assignment) => assignment.consumerId === consumerId)
		.map((assignment) => (
			<AssignmentItem
				key={assignment.producerId}
				assignment={assignment}
				producer={producers.find(({id}) => id === assignment.producerId)}
				type={type}
				stat={stat} />));

	return (
		<ul style={{listStyleType: 'none', margin: 0, padding: 0, ...style}}>
			{items}
		</ul>
	);
}

function AssignmentItem({producer, assignment, type, stat}) {
	const [, drag] = useDrag({
		item: { id: assignment.id, type }
	});

	return (
		<li
			ref={drag}
			className="clearfix"
			style={{
				cursor: 'pointer',
				border: 'solid 1px #ddd',
				borderRadius: '0.4em',
				padding: '0.5em',
				margin: '0.3em 0',
				backgroundColor: '#fff'
			}}
			>
			<span style={{float: 'left'}}>{producer.name} ({assignment.amount}/{producer.capacity})</span>
			{stat ?
				<Rating
					style={{float: 'right', marginLeft: '1em'}}
					value={producer[stat]}
					min={producer[`min${stat}`]}
					max={producer[`max${stat}`]} />
				: ''}
		</li>
	);
}

function ConsumerRow({
	consumer, time, producers, assignments, onAssign, accept, producerStat
}) {
	const provided = assignments.reduce((total, assignment) => {
		return total + assignment.amount;
	}, 0);
	const fulfillment = provided / consumer.need;
	let icon;

	if (fulfillment < 1) {
		icon = 'checkboxUnchecked';
	} else if (fulfillment === 1) {
		icon = 'checkboxChecked';
	} else {
		icon = 'warning';
	}

	const assign = useCallback(
		(data) => onAssign({time, ...data}),
		[time, onAssign]
	);

	return (
		<ProducerDropZone
			as="tbody"
			consumerId={consumer.id}
			onAssign={assign}
			accept={accept}>
			<tr style={{backgroundColor: '#ddd'}}>
				<td style={{padding: '0.3em 0 0 0.3em'}}>
					<Heading as="h4" style={{fontSize: '1em', margin: 0}}>
						{consumer.name}
					</Heading>
				</td>
				<td style={{paddingRight: '1em'}}>
					{time}
				</td>
				<td style={{whiteSpace: 'nowrap', paddingRight: '1em'}}>
					{provided} / {consumer.need}
				</td>
				<td style={{width: '40%'}}>
					<Box width={`${100*consumer.need/consumer.maxneed}%`}>
						<ProgressBar
							height="1em"
							progress={fulfillment}
							barColor="#888"
							/>
					</Box>
				</td>
				<td style={{padding: '0.3em 0.3em 0 0'}}>
					<Icon name={icon} />
				</td>
			</tr>
			<tr style={{backgroundColor: '#eee'}}>
				<td colSpan="2" style={{padding: '0.3em 0 0 0.3em'}}>
					<ProducerList
						style={{minHeight: '3em'}}
						consumerId={consumer.id}
						producers={producers}
						assignments={assignments}
						stat={producerStat}
						type={accept}
					/>
				</td>
				<td colSpan="3"></td>
			</tr>
		</ProducerDropZone>
	);
}

export default function ShiftView({shift, producers, consumers, producerStat, onAssign}) {
	const id = `${shift.date} ${shift.timeOfDay}`;
	const nullAssignments = buildNullAssignments(
		shift.date, shift.timeOfDay, producers, shift.assignments
	);
	const assign = ({sourceAssignmentId, time, newConsumerId}) => {
		const source = /^NullAssignment:/.test(sourceAssignmentId) ?
			nullAssignments : shift.assignments;
		const assignment = source.find(({id}) => id === sourceAssignmentId);

		onAssign(assignmentInstructions({
			consumers,
			assignments: shift.assignments,
			assignment,
			consumerId: newConsumerId,
			date: `${shift.date}T${time}:00.000Z`,
		}));
	};
	const consumerRows = consumers.map((consumer) => {
		const time = consumer.times.find(({day, time}) => {
			return day === shift.day && isTimeOfDay(time, shift.timeOfDay);
		});

		if (!time) {
			return null;
		}

		return (
			<ConsumerRow
				key={consumer.id}
				consumer={consumer}
				time={time.time}
				producers={producers}
				assignments={shift.assignments.filter(({consumerId}) => consumerId === consumer.id)}
				accept={id}
				onAssign={assign}
				producerStat={producerStat} />
		);
	});

	return (
		<DndProvider backend={Backend}>
			<header className="clearfix">
				<Heading as="h3" style={{float: 'left'}}>
					{shift.day} {shift.timeOfDay}
				</Heading>
				<span style={{float: 'right'}}>{shift.date}</span>
			</header>

			<Box marginBottom={4} style={{position: 'relative'}}>
				<Box style={{
					position: 'absolute',
					top: 0,
					bottom: 0,
					left: 0,
					width: '20%',
					overflowY: 'auto'
				}}>
				<ProducerDropZone
					consumerId={null}
					accept={id}
					onAssign={assign}
				>
					<Heading as="h4" style={{fontSize: '1em'}}>unassigned</Heading>

					<ProducerList
						consumerId={null}
						producers={producers}
						assignments={nullAssignments}
						stat={producerStat}
						type={id}
						/>
				</ProducerDropZone>
				</Box>

				<table
					cellSpacing="0"
					style={{marginLeft: '20%', width: '80%', paddingLeft: '1em'}}>
					<thead>
						<tr>
							<td>Name</td>
							<td>Time</td>
							<td colSpan="3" style={{textAlign: 'center'}}>
								Fulfillment
							</td>
						</tr>
					</thead>
					{consumerRows}
				</table>
			</Box>
		</DndProvider>
	);
}
