import {
    Box,
    Button,
    FormField,
    Input,
    TablePickerSynced,
    Text,
    ViewPickerSynced,
    initializeBlock,
    loadCSSFromString,
    useGlobalConfig,
} from '@airtable/blocks/ui';
import {base} from '@airtable/blocks';
import React, {useState} from 'react';
import expandDates from './expand-dates';

const dayOfWeekToNumber = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
};

function useArray() {
    const [count, setCount] = useState(0);
    const [array] = useState([]);
    return [array, (element) => {
        array.push(element);
        setCount((count) => count + 1);
    }];
}

function getDateFromString(dateString) {
    // Assumes dateString is yyyy-mm-dd
    const parts = dateString.split('-').map(part => parseFloat(part));
    const date = new Date();
    date.setFullYear(parts[0]);
    date.setMonth(parts[1] - 1);
    date.setDate(parts[2]);
    date.setHours(0, 0, 0, 0);
    return date;
}

function getStringFromDate(date) {
    // Returns yyyy-mm-dd string.
    return [
        date.getFullYear(),
        (date.getMonth() + 1).toString().padStart(2, '0'),
        date.getDate().toString().padStart(2, '0'),
    ].join('-');
}

async function build({startDate, endDate, recipients, onProgress}) {
  await recipients.loadDataAsync();

  for (const recipient of recipients.records) {
      const name = recipient.name;
      // TODO: parameterize field name
      const deliveryTimes = await recipient.selectLinkedRecordsFromCellAsync(
          'Delivery Times'
      );
      if (deliveryTimes.records.length === 0) {
          onProgress(`Skipping "${name}" because it has zero delivery times.`);
          continue;
      }

      const deliveries = expandDates(
          startDate,
          endDate,
          deliveryTimes.records.map((record) => ({
              day: record.getCellValueAsString('Day of Week'),
              time: record.getCellValueAsString('Time')
          }))
      );

      const daysOfWeekSet = new Set();
      for (const time of deliveryTimes) {
          if (!dayOfWeekToNumber.hasOwnProperty(dayOfWeek.name)) {
              throw new Error(`Unexpected day of week: ${dayOfWeek.name}`);
          }
          daysOfWeekSet.add(dayOfWeekToNumber[dayOfWeek.name]);
      }

      const endDate = getDateFromString(endDateString);
      let deliveriesToCreate = [];
      for (
          let currentDate = getDateFromString(startDateString);
          currentDate <= endDate;
          currentDate.setDate(currentDate.getDate() + 1)
      ) {
          if (daysOfWeekSet.has(currentDate.getDay())) {
              deliveriesToCreate.push({
                  fields: {
                      'Delivery Scheduled': getStringFromDate(currentDate),
                      Restaurant: order.getCellValue('Restaurant'),
                      Hospital: order.getCellValue('Hospital'),
                      Order: [{id: order.id}],
                  },
              });
          }
      }

      onProgress(`Creating ${deliveriesToCreate.length} deliveries for "${name}".`);

      // Only up to 50 records can be created at one time, so do it in batches.
      console.log(`creating ${deliveriesToCreate.length} deliveries`);
      while (deliveriesToCreate.length > 0) {
          //deliveriesTable.createRecordsAsync(deliveriesToCreate.slice(0, 50));
          deliveriesToCreate = deliveriesToCreate.slice(50);
      }
  }

  onProgress('✅ Done!');
}

function DeliveryBuilder({recipientsView, deliveriesTable, children}) {
  const [messages, pushMessage] = useArray();
  const recipients = recipientsView && recipientsView.selectRecords();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  return <div>
        <div>
            <FormField label="Start date" style={{width: '50%', float: 'left' }}>
                <Input
                    type="date"
                    onChange={(event) => setStartDate(event.target.value)}
                    value={startDate}
                    />
            </FormField>
            <FormField label="End date" style={{width: '50%', float: 'left' }}>
                <Input
                    type="date"
                    onChange={(event) => setEndDate(event.target.value)}
                    value={endDate}
                    />
            </FormField>
        </div>

        <Button
            onClick={() => build({recipients, startDate, endDate, onProgress: pushMessage})}
            variant="primary"
            icon="bolt">
          {children}
        </Button>

        <ul>
            {messages.map((message, idx) => <li><Text key={idx}>{message}</Text></li>)}
        </ul>
    </div>;

}

function CapacityPlanner() {
    const globalConfig = useGlobalConfig();
    const recipientsTableId = globalConfig.get('recipientsTableId');
    const recipientsTable = base.getTableByIdIfExists(recipientsTableId);
    const recipientsViewId = globalConfig.get('recipientsViewId');
    const recipientsView = recipientsTable &&
        recipientsTable.getViewByIdIfExists(recipientsViewId);

    return (
        <Box>
        <TablePickerSynced globalConfigKey="recipientsTableId" />
        <ViewPickerSynced
            globalConfigKey="recipientsViewId"
            table={recipientsTable} />

        <DeliveryBuilder
            recipientsView={recipientsView}>
            Generate Deliveries
        </DeliveryBuilder>
        </Box>
    );
}

initializeBlock(() => <CapacityPlanner />);
