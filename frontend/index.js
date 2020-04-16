import {
    Box,
    Text,
    Button,
    initializeBlock,
} from '@airtable/blocks/ui';
import {base} from '@airtable/blocks';
import React, {useState} from 'react';

async function DeliveryBuilder({onProgress}) {
  // based on https://community.airtable.com/t/create-recurring-orders/28661
  const ordersTable = base.getTable('Orders');
  const deliveriesTable = base.getTable('Deliveries');
  const orders = ordersTable.selectRecords();

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
          onProgress(`⚠️ Skipping "${name}" because it does not have a start date.)`);
          continue;
      }
      if (!endDateString) {
          onProgress(`⚠️ Skipping "${name}" because it does not have an end date.)`);
          continue;
      }
      if (!daysOfWeek) {
          onProgress(`⚠️ Skipping "${name}" because it have any "Days of week" to schedule.)`);
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

      onProgress(`Creating ${deliveriesToCreate.length} deliveries for "${name}".`);

      // Only up to 50 records can be created at one time, so do it in batches.
      while (deliveriesToCreate.length > 0) {
          deliveriesTable.createRecordsAsync(deliveriesToCreate.slice(0, 50));
          deliveriesToCreate = deliveriesToCreate.slice(50);
      }
  }

  onProgress('✅ Done!');

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

function useArray() {
    const [count, setCount] = useState(0);
    const [array] = useState([]);
    return [array, (element) => {
        array.push(element);
        setCount((count) => count + 1);
    }];
}

function CapacityPlanner() {
    const [messages, pushMessage] = useArray();

    return (
        <Box>
        <Button onClick={() => DeliveryBuilder({onProgress: pushMessage})} variant="primary" icon="bolt">
            Generate Deliveries
        </Button>
        <ul>
            {messages.map((message, idx) => <li><Text key={idx}>{message}</Text></li>)}
        </ul>
        </Box>
    );
}

initializeBlock(() => <CapacityPlanner />);
