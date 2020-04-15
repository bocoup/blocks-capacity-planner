import {
    Box,
    Text,
    Button,
    initializeBlock,
} from '@airtable/blocks/ui';
import {base} from '@airtable/blocks';
import React from 'react';

async function DeliveryBuilder() {
  // based on https://community.airtable.com/t/create-recurring-orders/28661
  const ordersTable = base.getTable('Orders');
  const deliveriesTable = base.getTable('Deliveries');
  const orders = ordersTable.selectRecords();
  let msgs = [];

  await orders.loadDataAsync();

  const dayOfWeekToNumber = {
      Sun: 0,
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
  };

  for (const order of orders.records) {
      if (order.getCellValue('Deliveries')) {
          // Skip it, the deliveries were already created.
          continue;
      }

      const name = order.name;
      const startDateString = order.getCellValue('Start Date');
      const endDateString = order.getCellValue('End Date');
      const daysOfWeek = order.getCellValue('Days of week');

      if (!startDateString) {
          msgs.push(<Text>⚠️ Skipping &quot;${name}&quot; because it does not have a start date.)</Text>);
          continue;
      }
      if (!endDateString) {
          msgs.push(<Text>⚠️ Skipping &quot;${name}&quot; because it does not have an end date.)</Text>);
          continue;
      }
      if (!daysOfWeek) {
          msgs.push(<Text>⚠️ Skipping &quot;${name}&quot; because it have any &quot;Days of week&quot; to schedule.)</Text>);
          continue;
      }

      const daysOfWeekSet = new Set();
      for (const dayOfWeek of daysOfWeek) {
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

      msgs.push(<Text>Creating ${deliveriesToCreate.length} deliveries for &quot;${name}&quot;.</Text>);

      // Only up to 50 records can be created at one time, so do it in batches.
      while (deliveriesToCreate.length > 0) {
          deliveriesTable.createRecordsAsync(deliveriesToCreate.slice(0, 50));
          deliveriesToCreate = deliveriesToCreate.slice(50);
      }
  }

  msgs.push(<Text>✅ Done!</Text>);

  return msgs;

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

}

function CapacityPlanner() {
    return (
      <Box
        position="absolute"
        top={0}
        bottom={0}
        left={0}
        right={0}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Button onClick={DeliveryBuilder} variant="primary" icon="bolt">
        Generate Deliveries
        </Button>

      </Box>
    );
}

initializeBlock(() => <CapacityPlanner />);
