import React, {useCallback, useState} from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import {
	Box,
	Heading,
	Icon,
	ProgressBar,
} from '@airtable/blocks/ui';

import Rating from './rating';

const useProducers = (_producers) => {
	const [producers, setProducers] = useState(
		() => Object.freeze(_producers.map((producer) => Object.freeze(Object.assign({}, producer, {assignment: null}))))
	);
	const assign = useCallback(
		(consumerId, producerId) => {
			setProducers(Object.freeze(producers.map((producer) => {
				return Object.freeze(Object.assign(
					{},
					producer,
					producer.id === producerId ? {assignment: consumerId} : null
				));
			})));
		},
		[producers]
	);

	return [producers, assign];
};

function ProducerDropZone({children, producers, onAssign, accept, stat}) {
	const [, drop] = useDrop({
		accept,
		drop(item) {
			onAssign(item.id);
		}
	});

	return (
		<div ref={drop}>
			{children}

			<ul style={{listStyleType: 'none', margin: 0, padding: 0}}>
				{producers.map((producer) => <Producer key={producer.id} producer={producer} type={accept} stat={stat} />)}
			</ul>
		</div>
	);
}

function Producer({producer, type, stat}) {
	const [, drag] = useDrag({
		item: { id: producer.id, type }
	});

	return (
		<li
			ref={drag}
			className="clearfix"
			style={{cursor: 'pointer', border: 'solid 1px #ddd', borderRadius: '0.4em', padding: '0.2em', margin: '0.2em'}}
			>
			<span style={{float: 'left'}}>{producer.name}</span>
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

function Consumer({consumer, producers, onAssign, accept, producerStat}) {
	const assign = useCallback(
		(producerId) => {
			onAssign(consumer.id, producerId);
		},
		[onAssign, consumer.id]
	);

	const assigned = producers.filter((producer) => producer.assignment === consumer.id);
	const provided = assigned.reduce((total, producer) => total + producer.capacity, 0);
	const fulfillment = provided / consumer.need;
	let icon;

	if (fulfillment < 1) {
		icon = 'checkboxUnchecked';
	} else if (fulfillment === 1) {
		icon = 'checkboxChecked';
	} else {
		icon = 'warning';
	}

	return (
		<tr>
			<td width="50%">
				<ProducerDropZone
					producers={assigned}
					onAssign={assign}
					accept={accept}
					stat={producerStat}
					>
					<Heading as="h3" style={{fontSize: '1em'}}>{consumer.name}</Heading>
				</ProducerDropZone>
			</td>
			<td style={{width:'10%', textAlign: 'center'}}>
				{provided} / {consumer.need}
			</td>
			<td style={{width: 'calc(40% - 30px)'}}>
				<Box width={`${100*consumer.need/consumer.maxneed}%`}>
					<ProgressBar progress={fulfillment} barColor="#888" />
				</Box>
			</td>
			<td style={{width: '30px', textAlign: 'center'}}>
				<Icon name={icon} />
			</td>
		</tr>
	);
}


export default function Shift({date, producers, consumers, producerStat, onAssign}) {
	let internalAssign;
	[producers, internalAssign] = useProducers(producers);
	const assign = useCallback(
		(consumerId, producerId) => {
			internalAssign(consumerId, producerId);
			onAssign(date, consumerId, producerId);
		},
		[date, onAssign, internalAssign]
	);
	const unassign = useCallback(
		(producerId) => {
			internalAssign(null, producerId);
			onAssign(date, null, producerId);
		},
		[date, onAssign, internalAssign]
	);

	const unassigned = producers.filter(({assignment}) => assignment === null);

	return (
		<DndProvider backend={Backend}>
			<Heading as="h3" style={{borderBottom: '2px solid #bbb'}}>
				{date}
			</Heading>

			<Box display="flex" marginBottom={4}>
				<ProducerDropZone
					producers={unassigned}
					onAssign={unassign}
					accept={date}
					stat={producerStat}
				>
					<Heading as="h3" style={{fontSize: '1em'}}>unassigned</Heading>
				</ProducerDropZone>

				<table style={{width: '100%', marginLeft: '1em'}}>
					<tbody>
						{consumers.map((consumer) => (
							<Consumer
								key={consumer.id}
								consumer={consumer}
								producers={producers}
								onAssign={assign}
								accept={date}
								producerStat={producerStat} />
						))}
					</tbody>
				</table>
			</Box>
		</DndProvider>
	);
}
