import {
	Box,
	Button,
	FormField,
	Heading,
	ProgressBar,
	SelectButtons,
} from '@airtable/blocks/ui';
import {base} from '@airtable/blocks';
import React, {useState} from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';

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
	'Mass General Hospital',
	'South Shore Hospital',
	'Brigham and Women\'s',
].map((name, index) => ({id: index, name}));

const restaurants = [
	'Cici\'s',
	'Gio\'s',
	'Main Street Deli',
	'The Lobster Stop',
	'Napoli\'s',
	'Denley\'s',
	'Little Duck',
	'The Fat Cat',
	'The Four\'s',
].map((name, index) => ({id: index, name}));

function ProducerList({title, producers}) {
	return (
		<div>
			<Heading as="h3">{title}</Heading>

			<FormField label="Sort">
				<SelectButtons
					value="period"
					options={[
						{value: 'period', label: 'This period'},
						{value: 'avg', label: 'Average since joining'}
					]}
					size="small"
				/>
			</FormField>

			<ul>
				{producers.map((producer) => (
					<li key={producer.id}>
						{producer.name}
					</li>
				))}
			</ul>
		</div>
	);
}

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
		<div>
			<DndProvider backend={Backend}>
				<Heading as="h3" style={{borderBottom: '2px solid #bbb'}}>
					{date}
				</Heading>

				<ProducerDropZone
					title="unassigned"
					accept={date}
					producers={unassigned}
					ownerId={null}
					assign={assign}
					/>

				<div style={{display: 'flex'}}>
					{consumers.map((consumer) => <Consumer key={consumer.id} consumer={consumer} producers={producers} assign={assign} accept={date}/>)}
				</div>
			</DndProvider>
		</div>
	);
}

function ProducerDropZone({title, producers, ownerId, assign, accept}) {
	const [, drop] = useDrop({
		accept,
		drop(item) {
			assign(item.id, ownerId);
		}
	});

	return (
		<div
			ref={drop}
			style={{backgroundColor: '#eee', padding: '1em', margin: '1em', width: '100%', display: 'inline-block'}}
			>
			<Heading as="h3" style={{fontSize: '1em', marginTop: 0}}>{title}</Heading>

			{producers.map((producer) => <Producer key={producer.id} producer={producer} type={accept} />)}
		</div>
	);
}

function Producer({producer, type}) {
	const [, drag] = useDrag({
		item: { id: producer.id, type }
	});
	return (
		<span
			ref={drag}
			style={{cursor: 'pointer', border: 'solid 1px #ddd', borderRadius: '0.4em', padding: '0.2em', margin: '0.2em'}}
			>
			{producer.name}
		</span>
	);
}

function Consumer({consumer, producers, assign, accept}) {
	const assigned = producers.filter((producer) => producer.assignment === consumer.id);
	return (
		<ProducerDropZone
			title={consumer.name}
			producers={assigned}
			ownerId={consumer.id}
			assign={assign}
			accept={accept} />
	);
}

export default function Chooser({producers, consumers, dates}) {
	producers = restaurants;
	consumers = hospitals;
	dates = sampleDates;

	return (
		<Box style={{flexDirection: 'column', ...containerStyle}}>
			<Box padding={2} style={{flexGrow: 1, display: 'flex', overflowY: 'scroll'}}>
				<ProducerList title="Restaurants" producers={producers} />
				<Box marginLeft={4}>
					{dates.map((date) => (
						<Day key={date} date={date} producers={producers} consumers={consumers} />
					))}
				</Box>
			</Box>
			<Box padding={3} alignItems="right">
				<ProgressBar progress={0.4} barColor='#32a852' />
				Budget: $400 of $1000
				<Button icon="thumbsUp" variant="primary">Apply Schedule</Button>
			</Box>
		</Box>
	);
};
