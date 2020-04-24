import React from 'react';
import {base} from '@airtable/blocks';
import {
	Box,
	FormField,
	Select,
	TablePickerSynced,
	ViewPickerSynced,
	useGlobalConfig,
	useRecordIds,
} from '@airtable/blocks/ui';

const timezoneDescription = 'The time zone by which all dates should be interpreted. Support for local times is not yet implemented.';

export default function Settings() {
	const globalConfig = useGlobalConfig();
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

	const consumerIds = useRecordIds(consumersView || consumersTable);
	const producerIds = useRecordIds(producersView || producersTable);

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

			<h3>{consumerIds ? consumerIds.length : 0} consumers selected</h3>

			<div className="clearfix">
				<FormField
					label="Producers table"
					style={{width: '50%', float: 'left'}}>
					<TablePickerSynced globalConfigKey="producersTableId" />
				</FormField>
				<FormField
					label="Producers view"
					style={{width: '50%', float: 'left'}}>
					<ViewPickerSynced
						shouldAllowPickingNone={true}
						globalConfigKey="producersViewId"
						table={producersTable} />
				</FormField>
			</div>

			<h3>{producerIds ? producerIds.length : 0} consumers selected</h3>

			<FormField label="Time zone" description={timezoneDescription}>
				<Select
					value="utc"
					disabled={true}
					options={[
						{label: 'UTC', value: 'utc'},
						{label: 'Local', value:'local'},
					]}
					/>
			</FormField>
		</Box>
	);
}
