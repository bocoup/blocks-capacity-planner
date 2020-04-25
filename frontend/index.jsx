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

/**
 * Apply an operation to a record in a table.
 *
 * @param {object} operation - plain object specifying the action to be taken
 * @param {string} operation.name - one of "create", "delete", or "update"
 * @param {airtable.Table} consumersTable - table describing all available
 *                                          consumers; the records in this
 *                                          table will not be modified
 * @param {airtable.Table} deliveriesTable - table describing all available
 *                                           deliveries; this is the table upon
 *                                           which the operation is applied
 * @param {object} assignmentFields - a mapping of semantic field names to
 *                                    Airtable Field identifiers
 * @param {object} consumerFields - a mapping of semantic field names to
 *                                  Airtable Field identifiers
 */
const execute = async ({
	operation, consumersTable, deliveriesTable, assignmentFields, consumerFields
}) => {
	if (operation.name === 'create') {
		// The "deliveries" table has many views which filter according to the
		// "Region" field. Infer the appropriate value for this field by
		// querying the "Chapter" field of the new delivery's consumer. This
		// ensures that newly-created records appear in the relevant views of
		// the "deliveries" table.
		const queryResult = consumersTable.selectRecords({
			fields: [consumerFields.region]
		});
		let region;

		await queryResult.loadDataAsync();

		try {
			const record = queryResult.getRecordById(operation.consumerId);
			region = record.getCellValue(consumerFields.region);
		} finally {
			queryResult.unloadData();
		}

		deliveriesTable.createRecordAsync({
			[assignmentFields.date]: operation.date,
			[assignmentFields.consumer]: [{id: operation.consumerId}],
			[assignmentFields.producer]: [{id: operation.producerId}],
			[assignmentFields.amount]: operation.amount,
			[assignmentFields.region]: region,
		});
	} else if (operation.name === 'delete') {
		deliveriesTable.deleteRecordAsync(operation.id);
	} else if (operation.name === 'update') {
		deliveriesTable.updateRecordAsync(operation.id, {
			[assignmentFields.amount]: operation.amount
		});
	}
};

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
	const assignmentFields = {
		consumer: globalConfig.get('assignments:consumer'),
		producer: globalConfig.get('assignments:producer'),
		amount: globalConfig.get('assignments:amount'),
		date: globalConfig.get('assignments:date'),
		region: globalConfig.get('assignments:region'),
	};
	const consumerFields = {
		need: globalConfig.get('consumers:need'),
		times: globalConfig.get('consumers:times'),
		region: globalConfig.get('consumers:region'),
	};
	const producerFields = {
		capacity: globalConfig.get('producers:capacity'),
		price: globalConfig.get('producers:price'),
		times: globalConfig.get('producers:times'),
	};

	useSettingsButton(() => setIsShowingSettings(!isShowingSettings));

	const assignmentRecords = useRecords(deliveriesTable, {
		fields: Object.values(assignmentFields)
	});
	const consumerRecords = useRecords(consumersView || consumersTable, {
		fields: Object.values(consumerFields)
	});
	const producerRecords = useRecords(producersView || producersTable, {
		fields: Object.values(producerFields)
	});

	if (isShowingSettings) {
		return <Settings />;
	}

	const hasAllRequired = [
			deliveriesTable,
			consumersTable, producersTable,
			...Object.values(assignmentFields),
			...Object.values(consumerFields),
			...Object.values(producerFields),
		].every((item) => !!item);

	if (!hasAllRequired) {
		return (
			<Box
				position="absolute"
				top={0}
				left={0}
				right={0}
				bottom={0}
				display="flex"
				padding={2}
				flexDirection="column"
				alignItems="center"
				textAlign="center"
				justifyContent="center">
				<p>
					Some of the configuration required by this block has not
					been provided.
				</p>

				<Button onClick={() => setIsShowingSettings(true)}>
					Open the configuration page
				</Button>
			</Box>
		);
	}

	const consumers = consumerRecords.map((record) => ({
		id: record.id,
		name: record.name,
		need: record.getCellValue(consumerFields.need),
		// "Delivery Times" is a linked record. Although
		// `selectLinkedRecordsFromCell` is technically more appropriate, it
		// can't be used in a synchronous context. Instead, operate on each
		// record's name (which is available immediately) to infer the relevant
		// values.
		times: (record.getCellValue(consumerFields.times) || []).map((record) => {
			const [day, time] = record.name.split(/\s*@\s*/);
			return {day, time};
		}),
	}));
	const consumerIds = new Set(consumers.map(({id}) => id));

	const producers = producerRecords.map((record) => ({
		id: record.id,
		name: record.name,
		capacity: record.getCellValue(producerFields.capacity),
		price: record.getCellValue(producerFields.price),
		// "Shifts" is a linked record. Although `selectLinkedRecordsFromCell`
		// is technically more appropriate, it can't be used in a synchronous
		// context. Instead, operate on each record's name (which is available
		// immediately) to infer the relevant values.
		times: (record.getCellValue(producerFields.times) || []).map((record) => {
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
			consumerId: getLinkedId(record, assignmentFields.consumer),
			producerId: getLinkedId(record, assignmentFields.producer),
			amount: record.getCellValue(assignmentFields.amount),
			date: record.getCellValue(assignmentFields.date),
		}))
		.filter(({consumerId, producerId}) => {
			return consumerIds.has(consumerId) && producerIds.has(producerId);
		});

	return <Chooser
		consumers={consumers}
		producers={producers}
		assignments={assignments}
		onAssign={(operations) => {
			operations.forEach((operation) => {
				execute({
					operation,
					consumersTable,
					deliveriesTable,
					assignmentFields,
					consumerFields,
				});
			});
		}}
		/>;
}

initializeBlock(() => <CapacityPlanner />);
