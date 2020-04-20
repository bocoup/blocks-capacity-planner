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
	const recipientsTableId = globalConfig.get('recipientsTableId');
	const recipientsTable = base.getTableByIdIfExists(recipientsTableId);
	const deliveriesTableId = globalConfig.get('deliveriesTableId');
	const deliveriesTable = base.getTableByIdIfExists(deliveriesTableId);
	const recipientsViewId = globalConfig.get('recipientsViewId');
	const recipientsView = recipientsTable &&
		recipientsTable.getViewByIdIfExists(recipientsViewId);

	useSettingsButton(() => setIsShowingSettings(!isShowingSettings));

	const records = useRecords(recipientsView || recipientsTable, {
		fields: ['Name', 'Delivery Times', 'Number of Meals']
	});

	if (isShowingSettings) {
		return <Settings />;
	}

	if (!recipientsTable) {
		return (
			<Box padding={2}>
				<p>This block must be configured before it may be used.</p>

				<Button onClick={() => setIsShowingSettings(true)}>
					Configure
				</Button>
			</Box>
		);
	}

	const consumers = records.map((record) => ({
		id: record.id,
		name: record.name,
		need: record.getCellValue('Number of Meals'),
		// This is a linked record. Although `selectLinkedRecordsFromCell` is
		// technically more appropriate, it can't be used in a synchronous
		// context. Instead, operate on each record's name (which is available
		// immediately) to infer the relevant values.
		times: (record.getCellValue('Delivery Times') || []).map((record) => {
			const [day, time] = record.name.split(/\s*@\s*/);
			return {day, time};
		}),
	}));

	return <Chooser consumers={consumers} />;
}

initializeBlock(() => <CapacityPlanner />);
