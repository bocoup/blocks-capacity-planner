import React from 'react';
import {base} from '@airtable/blocks';
import {
	Box,
	FormField,
	TablePickerSynced,
	ViewPickerSynced,
	useGlobalConfig,
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

	return (
		<Box padding={2}>
			<FormField label="Deliveries table">
				<TablePickerSynced globalConfigKey="deliveriesTableId" />
			</FormField>
			<FormField
				label="Recipients table"
				style={{width: '50%', float: 'left'}}>
				<TablePickerSynced globalConfigKey="recipientsTableId" />
			</FormField>
			<FormField
				label="Recipients view"
				style={{width: '50%', float: 'left'}}>
				<ViewPickerSynced
					globalConfigKey="recipientsViewId"
					table={recipientsTable} />
			</FormField>
		</Box>
	);
};
