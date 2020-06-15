import React from 'react';
import {base} from '@airtable/blocks';
import {
    Box,
    FormField,
    Select,
    FieldPickerSynced,
    TablePickerSynced,
    ViewPickerSynced,
    useGlobalConfig,
    useRecordIds,
} from '@airtable/blocks/ui';
import {FieldType} from '@airtable/blocks/models';

const timezoneDescription = 'The time zone by which all dates should be interpreted. Support for local times is not yet implemented.';
const fieldStyle = {
    display: 'inline-block',
    width: '20em',
    marginRight: '2em',
};

export default function Settings({consumerName, producerName, assignmentName}) {
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
    const assignmentsTableId = globalConfig.get('assignmentsTableId');
    const assignmentsTable = base.getTableByIdIfExists(assignmentsTableId);

    const consumerIds = useRecordIds(consumersView || consumersTable);
    const producerIds = useRecordIds(producersView || producersTable);

    return (
        <Box padding={2}>
            <h1 style={{margin: '0 0 1em 0'}}>
                Configuration
            </h1>

            <fieldset style={{marginBottom: '1em'}} aria-describedby="deliveries-description">
                <legend>{assignmentName} Table</legend>
                
                <p
                    style={{maxWidth: '40em'}}
                    id="deliveries-description">
                    Specify the table where you want your planned deliveries to go.
                    You will need to specify the column names in your table so that 
                    your planning data is populated correctly.
                </p>

                <FormField
                    label="Table"
                    style={{width: '48%'}}>
                    <TablePickerSynced globalConfigKey="assignmentsTableId" />
                </FormField>


                <FormField
                    label={`Field for "${consumerName}"`}
                    style={fieldStyle}>
                    <FieldPickerSynced
                        globalConfigKey="assignments:consumer"
                        allowedTypes={[FieldType.MULTIPLE_RECORD_LINKS]}
                        table={assignmentsTable}
                    />
                </FormField>

                <FormField
                    label={`Field for "${producerName}"`}
                    style={fieldStyle}>
                    <FieldPickerSynced
                        globalConfigKey="assignments:producer"
                        allowedTypes={[FieldType.MULTIPLE_RECORD_LINKS]}
                        table={assignmentsTable}
                    />
                </FormField>

                <FormField
                    label={'Field for "Size"'}
                    style={fieldStyle}>
                    <FieldPickerSynced
                        globalConfigKey="assignments:amount"
                        allowedTypes={[FieldType.NUMBER]}
                        table={assignmentsTable}
                    />
                </FormField>

                <FormField
                    label={'Field for "Time"'}
                    style={fieldStyle}>
                    <FieldPickerSynced
                        globalConfigKey="assignments:date"
                        allowedTypes={[FieldType.DATE_TIME]}
                        table={assignmentsTable}
                    />
                </FormField>

                <FormField
                    label={'Field for "Region"'}
                    style={fieldStyle}>
                    <FieldPickerSynced
                        globalConfigKey="assignments:region"
                        allowedTypes={[FieldType.MULTIPLE_RECORD_LINKS]}
                        table={assignmentsTable}
                    />
                </FormField>
            </fieldset>

            <fieldset style={{marginBottom: '1em'}} aria-describedby="consumers-description">
                <legend>{consumerName} Table</legend>

                <p
                    style={{maxWidth: '40em'}}
                    id="consumers-description">
                    Specify which table to pull hospital/recipient information from. 
                    Since recipient tables for chapters are set up differently, specify 
                    which columns provide relevant information (like number of meals).
                </p>

                <FormField
                    label="Table"
                    style={{width: '48%', display: 'inline-block', marginRight: '4%'}}>
                    <TablePickerSynced globalConfigKey="consumersTableId" />
                </FormField>

                <FormField
                    label="Chapter View"
                    style={{width: '48%', display: 'inline-block'}}>
                    <div style={{'font-size': 'x-small', 'padding-bottom': '5px'}}>
                        This is required if you want to see data only for your chapter.
                    </div>
                    <ViewPickerSynced
                        shouldAllowPickingNone={true}
                        globalConfigKey="consumersViewId"
                        table={consumersTable} />
                </FormField>

                <FormField
                    label={'Demand'}
                    style={fieldStyle}>
                    <FieldPickerSynced
                        globalConfigKey="consumers:need"
                        allowedTypes={[FieldType.NUMBER]}
                        table={consumersTable}
                    />
                </FormField>

                <FormField
                    label={'Delivery Times'}
                    style={fieldStyle}>
                    <FieldPickerSynced
                        globalConfigKey="consumers:times"
                        allowedTypes={[FieldType.MULTIPLE_RECORD_LINKS]}
                        table={consumersTable}
                    />
                </FormField>

                <FormField
                    label={'Field for "Region"'}
                    style={fieldStyle}>
                    <FieldPickerSynced
                        globalConfigKey="consumers:region"
                        allowedTypes={[FieldType.MULTIPLE_RECORD_LINKS]}
                        table={consumersTable}
                    />
                </FormField>

                <h3>
                    {consumerIds ? consumerIds.length : 0} {consumerName} selected
                </h3>
            </fieldset>

            <fieldset style={{marginBottom: '1em'}} aria-describedby="producers-description">
                <legend>{producerName} Table</legend>

                <p
                    style={{maxWidth: '40em'}}
                    id="producers-description">
                    Specify which table to pull restaurant information from. 
                    Since restaurant tables for chapters are set up differently, 
                    specify which columns provide relevant information (like number of meals).
                </p>


                <FormField
                    label="Table"
                    style={{width: '48%', display: 'inline-block', marginRight: '4%'}}>
                    <TablePickerSynced globalConfigKey="producersTableId" />
                </FormField>

                <FormField
                    label="Chapter View"
                    style={{width: '48%', display: 'inline-block'}}>
                    <div style={{'font-size': 'x-small', 'padding-bottom': '1em'}}>
                        This is required if you want to see data only for your chapter.
                    </div>
                    <ViewPickerSynced
                        shouldAllowPickingNone={true}
                        globalConfigKey="producersViewId"
                        table={producersTable} />
                </FormField>

                <FormField
                    label={'Field for "Capacity"'}
                    style={fieldStyle}>
                    <FieldPickerSynced
                        globalConfigKey="producers:capacity"
                        allowedTypes={[FieldType.NUMBER]}
                        table={producersTable}
                    />
                </FormField>

                <FormField
                    label={'Field for "Price"'}
                    style={fieldStyle}>
                    <FieldPickerSynced
                        globalConfigKey="producers:price"
                        allowedTypes={[FieldType.CURRENCY]}
                        table={producersTable}
                    />
                </FormField>

                <FormField
                    label={'Field for "Availability"'}
                    style={fieldStyle}>
                    <FieldPickerSynced
                        globalConfigKey="producers:times"
                        allowedTypes={[FieldType.MULTIPLE_RECORD_LINKS]}
                        table={producersTable}
                    />
                </FormField>

                <FormField
                    label={'Additional Attributes'}
                    style={fieldStyle}>
                    <div style={{'font-size': 'x-small', 'padding-bottom': '1em'}}>
                        Use this to specify additional attributes that are
                        part of your decision making process, such as &apos;Cuisine&apos;.
                    </div>
                    <FieldPickerSynced
                        globalConfigKey="producers:descriptor"
                        allowedTypes={[FieldType.SINGLE_LINE_TEXT]}
                        table={producersTable}
                    />
                </FormField>

                <h3>
                    {producerIds ? producerIds.length : 0} {producerName} selected
                </h3>
            </fieldset>

            <fieldset>
                <legend>Miscellaneous</legend>

                <FormField
                    label="Time zone"
                    description={timezoneDescription}
                    style={fieldStyle}>
                    <Select
                        value="utc"
                        disabled={true}
                        options={[
                            {label: 'UTC', value: 'utc'},
                            {label: 'Local', value:'local'},
                        ]}
                    />
                </FormField>
            </fieldset>
        </Box>
    );
}
