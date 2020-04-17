import {
	Box,
	Button,
	FormField,
	Heading,
	ProgressBar,
	SelectButtons,
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

function Day({date, producers, consumers}) {
	let assign;
	[producers, assign] = useProducers(producers);

	const unassigned = producers.filter(({assignment}) => assignment === null);

	return (
		<DndProvider backend={Backend}>
			<Heading as="h3" style={{borderBottom: '2px solid #bbb'}}>
				{date}
			</Heading>

			<Box display="flex" marginBottom={4}>
				<ProducerDropZone producers={unassigned} ownerId={null} assign={assign} accept={date}>
					<Heading as="h3">Restaurants</Heading>
				</ProducerDropZone>

				<div style={{display: 'flex', flexGrow: 1}}>
					{consumers.map((consumer) => <Consumer key={consumer.id} consumer={consumer} producers={producers} assign={assign} accept={date}/>)}
				</div>
			</Box>
		</DndProvider>
	);
}

function ProducerDropZone({children, producers, ownerId, assign, accept}) {
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
				{producers.map((producer) => <Producer key={producer.id} producer={producer} type={accept} />)}
			</ul>
		</div>
	);
}

function Producer({producer, type}) {
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
			<Rating
				style={{float: 'right', marginLeft: '1em'}}
				value={producer.capacity}
				min={producer.mincapacity}
				max={producer.maxcapacity} />
		</li>
	);
}

function Consumer({consumer, producers, assign, accept}) {
	const assigned = producers.filter((producer) => producer.assignment === consumer.id);
	return (
		<ProducerDropZone
			producers={assigned}
			ownerId={consumer.id}
			assign={assign}
			accept={accept}
			>
			<Heading as="h3" style={{fontSize: '1em'}}>{consumer.name}</Heading>
			<p>Need: <Rating value={consumer.need} max={consumer.maxneed} min={consumer.minneed} /></p>
		</ProducerDropZone>
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

export default function Chooser({producers, consumers, dates}) {
	producers = restaurants;
	consumers = hospitals;
	dates = sampleDates;

	consumers = annotateExtremes(consumers, 'need');
	producers = annotateExtremes(producers, 'capacity');
	producers = annotateExtremes(producers, 'price');

	return (
		<Box style={{flexDirection: 'column', ...containerStyle}}>
			<Box padding={2} style={{overflowY: 'scroll'}}>
				{dates.map((date) => (
					<Day key={date} date={date} producers={producers} consumers={consumers} />
				))}
			</Box>
			<Box padding={3} alignItems="right">
				<ProgressBar progress={0.4} barColor='#32a852' />
				Budget: $400 of $1000
				<Button icon="thumbsUp" variant="primary">Apply Schedule</Button>
			</Box>
		</Box>
	);
};
