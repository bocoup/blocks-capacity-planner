import React from 'react';
import {base} from '@airtable/blocks';
import {
	Box,
	FormField,
	TablePickerSynced,
	ViewPickerSynced,
	useGlobalConfig,
	useRecordIds,
} from '@airtable/blocks/ui';

export default function Settings() {
	const globalConfig = useGlobalConfig();
	const recipientsTableId = globalConfig.get('recipientsTableId');
	const recipientsTable = base.getTableByIdIfExists(recipientsTableId);
	const deliveriesTableId = globalConfig.get('deliveriesTableId');
	const deliveriesTable = base.getTableByIdIfExists(deliveriesTableId);
	const recipientsViewId = globalConfig.get('recipientsViewId');
	const recipientsView = recipientsTable &&
		recipientsTable.getViewByIdIfExists(recipientsViewId);

	const records = useRecordIds(recipientsView || recipientsTable);

	return (
		<Box padding={2}>
			<FormField label="Deliveries table">
				<TablePickerSynced globalConfigKey="deliveriesTableId" />
			</FormField>

			<div className="clearfix">
				<FormField
					label="Recipients table"
					style={{width: '50%', float: 'left'}}>
					<TablePickerSynced globalConfigKey="recipientsTableId" />
				</FormField>
				<FormField
					label="Recipients view"
					style={{width: '50%', float: 'left'}}>
					<ViewPickerSynced
						shouldAllowPickingNone={true}
						globalConfigKey="recipientsViewId"
						table={recipientsTable} />
				</FormField>
			</div>

			<h3>{records ? records.length : 0} recipients selected</h3>
		</Box>
	);
};
