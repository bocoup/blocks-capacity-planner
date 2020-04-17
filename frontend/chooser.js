import {
	Box,
	Button,
	FormField,
	Heading,
	Icon,
	ProgressBar,
	Select,
	loadCSSFromString,
} from '@airtable/blocks/ui';
import {base} from '@airtable/blocks';
import React, {useState} from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';

import Rating from './rating';

const containerStyle = {
	position: 'absolute',
	top: 0,
	right: 0,
	bottom: 0,
	left: 0,

	display: 'flex',
};

const sampleDates = [
	'Sunday 2020-04-19',
	'Monday 2020-04-20',
	'Tuesday 2020-04-21',
	'Wednesday 2020-04-22',
	'Thursday 2020-04-23',
	'Friday 2020-04-24',
	'Saturday 2020-04-25',
];

const hospitals = [
	{name: 'Mass General Hospital', need: 50},
	{name: 'South Shore Hospital', need: 30},
	{name: 'Brigham and Women\'s', need: 40},
].map((hospital, id) => Object.assign(hospital, {id}));

const restaurants = [
	{name: 'Cici\'s', capacity: 20, price: 15},
	{name: 'Gio\'s', capacity: 20, price: 10},
	{name: 'Main Street Deli', capacity: 30, price: 10},
	{name: 'The Lobster Stop', capacity: 20, price: 35},
	{name: 'Napoli\'s', capacity: 40, price: 10},
	{name: 'Denley\'s', capacity: 50, price: 10},
	{name: 'Little Duck', capacity: 20, price: 15},
	{name: 'The Fat Cat', capacity: 30, price: 25},
	{name: 'The Four\'s', capacity: 70, price: 20},
].map((restaurant, id) => Object.assign(restaurant, {id}));

loadCSSFromString(`
	.clearfix:after {
		content: "\\00A0";
		display: block;
		clear: both;
		visibility: hidden;
		line-height: 0;
		height: 0;
	}
	.clearfix {display: block}
`);

const useProducers = (_producers) => {
	const [producers, setProducers] = useState(() => _producers.map((producer) => Object.assign({}, producer, {assignment: null})));
	const assign = (producerId, consumerId) => {
		setProducers(producers.map((producer) => {
			return Object.assign(
				{},
				producer,
				producer.id === producerId ? {assignment: consumerId} : null
			);
		}));
	};

	return [producers, assign];
};

function Day({date, producers, consumers, producerStat}) {
	let assign;
	[producers, assign] = useProducers(producers);

	const unassigned = producers.filter(({assignment}) => assignment === null);

	return (
		<DndProvider backend={Backend}>
			<Heading as="h3" style={{borderBottom: '2px solid #bbb'}}>
				{date}
			</Heading>

			<Box display="flex" marginBottom={4}>
				<ProducerDropZone producers={unassigned} ownerId={null} assign={assign} accept={date} stat={producerStat}>
					<Heading as="h3" style={{fontSize: '1em'}}>unassigned</Heading>
				</ProducerDropZone>

				<table style={{width: '100%', marginLeft: '1em'}}>
					<tbody>
						{consumers.map((consumer) => <Consumer key={consumer.id} consumer={consumer} producers={producers} assign={assign} accept={date} producerStat={producerStat} />)}
					</tbody>
				</table>
			</Box>
		</DndProvider>
	);
}

function ProducerDropZone({children, producers, ownerId, assign, accept, stat}) {
	const [, drop] = useDrop({
		accept,
		drop(item) {
			assign(item.id, ownerId);
		}
	});

	return (
		<div
			ref={drop}
			>
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

function Consumer({consumer, producers, assign, accept, producerStat}) {
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
					ownerId={consumer.id}
					assign={assign}
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

export default function Chooser({producers, consumers, dates}) {
	producers = restaurants;
	consumers = hospitals;
	dates = sampleDates;

	consumers = annotateExtremes(consumers, 'need');
	producers = annotateExtremes(producers, 'capacity');
	producers = annotateExtremes(producers, 'price');

	const [sort, setSort] = useState('name');
	const [producerStat, setProducerStat] = useState(null);

	return (
		<Box style={{flexDirection: 'column', ...containerStyle}}>
			<Box padding={2} style={{overflowY: 'scroll'}}>
				{dates.map((date) => (
					<Day key={date}
						date={date}
						producers={producers}
						consumers={consumers}
						producerStat={producerStat} />
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

				<Box flexGrow={1} paddingRight={3}>
					<ProgressBar progress={0.4} barColor='#32a852' />
					Budget: $400 of $1000
				</Box>

				<Button icon="thumbsUp" variant="primary">Apply Schedule</Button>
			</Box>
		</Box>
	);
};
