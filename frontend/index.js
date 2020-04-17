import {
    Box,
    FormField,
    TablePickerSynced,
    ViewPickerSynced,
    initializeBlock,
    loadCSSFromString,
    useGlobalConfig,
} from '@airtable/blocks/ui';
import {base} from '@airtable/blocks';
import React from 'react';

import DeliveryBuilder from './delivery-builder';
import Chooser from './chooser';

function CapacityPlanner() {
    const globalConfig = useGlobalConfig();
    const recipientsTableId = globalConfig.get('recipientsTableId');
    const recipientsTable = base.getTableByIdIfExists(recipientsTableId);
    const deliveriesTableId = globalConfig.get('deliveriesTableId');
    const deliveriesTable = base.getTableByIdIfExists(deliveriesTableId);
    const recipientsViewId = globalConfig.get('recipientsViewId');
    const recipientsView = recipientsTable &&
        recipientsTable.getViewByIdIfExists(recipientsViewId);

    return <Chooser />;

    return (
        <Box>
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

            <DeliveryBuilder
                deliveriesTable={deliveriesTable}
                recipientsView={recipientsView} />
        </Box>
    );
}

initializeBlock(() => <CapacityPlanner />);
