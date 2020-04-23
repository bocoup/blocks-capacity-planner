import {
	Box,
	Button,
	initializeBlock,
	loadCSSFromString,
	useGlobalConfig,
	useRecords,
	useSettingsButton,
} from '@airtable/blocks/ui';
import {base} from '@airtable/blocks';
import React, {useState} from 'react';

import Chooser from './chooser';
import Settings from './settings';

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

function CapacityPlanner() {
	const [isShowingSettings, setIsShowingSettings] = useState(false);
	const globalConfig = useGlobalConfig();
	const deliveriesTableId = globalConfig.get('deliveriesTableId');
	const deliveriesTable = base.getTableByIdIfExists(deliveriesTableId);
	const consumersTableId = globalConfig.get('consumersTableId');
	const consumersTable = base.getTableByIdIfExists(consumersTableId);
	const consumersViewId = globalConfig.get('consumersViewId');
	const consumersView = consumersTable &&
		consumersTable.getViewByIdIfExists(consumersViewId);
	const producersTableId = globalConfig.get('producersTableId');
	const producersTable = base.getTableByIdIfExists(producersTableId);
	const producersViewId = globalConfig.get('producersViewId');
	const producersView = producersTable &&
		producersTable.getViewByIdIfExists(producersViewId);

	useSettingsButton(() => setIsShowingSettings(!isShowingSettings));

	const assignmentRecords = useRecords(deliveriesTable, {
		fields: ['Delivery Scheduled', 'Hospital', 'Restaurant', 'Number of Meals']
	});
	const consumerRecords = useRecords(consumersView || consumersTable, {
		fields: ['Name', 'Delivery Times', 'Number of Meals']
	});
	const producerRecords = useRecords(producersView || producersTable, {
		fields: ['Name', 'Shifts', 'Projected Price/Meal', 'Max Meals']
	});

	if (isShowingSettings) {
		return <Settings />;
	}

	if (!deliveriesTable || !consumersTable || !producersTable) {
		return (
			<Box padding={2}>
				<p>This block must be configured before it may be used.</p>

				<Button onClick={() => setIsShowingSettings(true)}>
					Configure
				</Button>
			</Box>
		);
	}

	const consumers = consumerRecords.map((record) => ({
		id: record.id,
		name: record.name,
		need: record.getCellValue('Number of Meals'),
		// "Delivery Times" is a linked record. Although
		// `selectLinkedRecordsFromCell` is technically more appropriate, it
		// can't be used in a synchronous context. Instead, operate on each
		// record's name (which is available immediately) to infer the relevant
		// values.
		times: (record.getCellValue('Delivery Times') || []).map((record) => {
			const [day, time] = record.name.split(/\s*@\s*/);
			return {day, time};
		}),
	}));
	const consumerIds = new Set(consumers.map(({id}) => id));

	const producers = producerRecords.map((record) => ({
		id: record.id,
		name: record.name,
		capacity: record.getCellValue('Max Meals'),
		price: record.getCellValue('Projected Price/Meal'),
		// "Shifts" is a linked record. Although `selectLinkedRecordsFromCell`
		// is technically more appropriate, it can't be used in a synchronous
		// context. Instead, operate on each record's name (which is available
		// immediately) to infer the relevant values.
		times: (record.getCellValue('Shifts') || []).map((record) => {
			const [day, timeOfDay] = record.name.split(/\s+/);
			return {day, timeOfDay};
		}),
	}));
	const producerIds = new Set(producers.map(({id}) => id));

	const getLinkedId = (record, name) => {
		const value = record.getCellValue(name);
		return Array.isArray(value) ? value[0] && value[0].id : value && value.id;
	};
	const assignments = assignmentRecords
		.map((record) => ({
			id: record.id,
			consumerId: getLinkedId(record, 'Hospital'),
			producerId: getLinkedId(record, 'Restaurant'),
			amount: record.getCellValue('Number of Meals'),
			date: record.getCellValue('Delivery Scheduled'),
		}))
		.filter(({consumerId, producerId}) => {
			return consumerIds.has(consumerId) && producerIds.has(producerId);
		});

	const assign = (operations) => {
		operations.forEach(async (operation) => {
			if (operation.name === 'create') {
				const queryResult = consumersTable.selectRecords({fields: ['Chapter']});
				let chapters;

				await queryResult.loadDataAsync();

				try {
					const record = queryResult.getRecordById(operation.consumerId);
					chapters = record.getCellValue('Chapter');
				} finally {
					queryResult.unloadData();
				}
				deliveriesTable.createRecordAsync({
					'Delivery Scheduled': operation.date,
					Hospital: [{id: operation.consumerId}],
					Restaurant: [{id: operation.producerId}],
					'Number of Meals': operation.amount,
					'Region': chapters,
				});
			} else if (operation.name === 'delete') {
				deliveriesTable.deleteRecordAsync(operation.id);
			} else if (operation.name === 'update') {
				deliveriesTable.updateRecordAsync(operation.id, {
					'Number of Meals': operation.amount
				});
			}
		});
	};

	return <Chooser
		consumers={consumers}
		producers={producers}
		assignments={assignments}
		onAssign={assign}
		/>;
}

initializeBlock(() => <CapacityPlanner />);
