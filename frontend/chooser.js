import {
	Box,
	FormField,
	Heading,
	SelectButtons,
} from '@airtable/blocks/ui';
import {base} from '@airtable/blocks';
import React, {useState} from 'react';
import Multiselect from './multiselect';

const containerStyle = {
	posisition: 'absoluste',
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

class Assignments {
	constructor() {
		this.pToC = new Map();
		this.cToP = new Map();
	}

	add(consumer, producer) {
		if (this.pToC.has(producer)) {
			this.cToP.get(this.pToC.get(producer)).delete(producer);
		}
		this.pToC.set(producer, consumer);
		
		if (!this.cToP.get(consumer)) {
			this.cToP.set(consumer, new Set());
		}
		this.cToP.get(consumer).add(producer);
	}

	clear(consumer) {
		for (const producer of this.cToP.get(consumer) || []) {
			this.pToC.delete(producer);
		}
		this.cToP.delete(consumer);
	}
}

function Day({date, producers, consumers}) {
	const [assignments] = useState(new Assignments());
	const [x, setX] = useState(0);

	const assign = (consumer, producers) => {
		assignments.clear(consumer.id);
		producers && producers.forEach((producer) => {
			console.log(consumer, producer);
			assignments.add(consumer.id, producer.value);
		});
		setX((x) => x + 1);
	};
	const isOptionDisabled = (producer) => {
		console.log(producer, assignments.pToC.has(producer.value));
		return assignments.pToC.has(producer.value);
	};

	return (
		<div>
			<Heading as="h3" style={{borderBottom: '2px solid #bbb'}}>
				{date}
			</Heading>

			<div style={{display: 'flex'}}>
				{consumers.map((consumer, idx) => (
					<FormField key={consumer.id} margin={2} label={consumer.name}>
						<Multiselect
							onChange={assign.bind(null, consumer)}
							options={producers.map((producer) => ({
								label: producer.name,
								value: producer.id,
							}))} />
					</FormField>
				))}
			</div>
		</div>
	);
}

export default function Chooser({producers, consumers, dates}) {
	producers = restaurants;
	consumers = hospitals;
	dates = sampleDates;

	return (
		<Box padding={2} style={containerStyle}>
			<ProducerList title="Restaurants" producers={producers} />
			<Box marginLeft={4}>
				{dates.map((date) => (
					<Day key={date} date={date} producers={producers} consumers={consumers} />
				))}
			</Box>
		</Box>
	);
};
