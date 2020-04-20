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
	const consumersTableId = globalConfig.get('consumersTableId');
	const consumersTable = base.getTableByIdIfExists(consumersTableId);
	const deliveriesTableId = globalConfig.get('deliveriesTableId');
	const deliveriesTable = base.getTableByIdIfExists(deliveriesTableId);
	const consumersViewId = globalConfig.get('consumersViewId');
	const consumersView = consumersTable &&
		consumersTable.getViewByIdIfExists(consumersViewId);

	const records = useRecordIds(consumersView || consumersTable);

	return (
		<Box padding={2}>
			<FormField label="Deliveries table">
				<TablePickerSynced globalConfigKey="deliveriesTableId" />
			</FormField>

			<div className="clearfix">
				<FormField
					label="Consumers table"
					style={{width: '50%', float: 'left'}}>
					<TablePickerSynced globalConfigKey="consumersTableId" />
				</FormField>
				<FormField
					label="Consumers view"
					style={{width: '50%', float: 'left'}}>
					<ViewPickerSynced
						shouldAllowPickingNone={true}
						globalConfigKey="consumersViewId"
						table={consumersTable} />
				</FormField>
			</div>

			<h3>{records ? records.length : 0} consumers selected</h3>
		</Box>
	);
};
