import {
    Button,
    FormField,
    Input,
    Text,
    useRecordIds,
} from '@airtable/blocks/ui';
import React, {useState} from 'react';
import moment from 'moment';

import expandDates from './expand-dates';

function useList() {
    const [array, setArray] = useState(Object.freeze([]));
    return [array, {
        clear() {
            setArray(Object.freeze([]));
        },
        push(element) {
            setArray((current) => Object.freeze(current.concat(element)));
        }
    }];
}

async function * build({startDate, endDate, recipients, deliveriesTable}) {
  await recipients.loadDataAsync();

  for (const recipient of recipients.records) {
      const name = recipient.name;
      // TODO: parameterize field name
      const deliveryTimes = await recipient.selectLinkedRecordsFromCellAsync(
          'Delivery Times'
      );
      const deliveries = expandDates(
          startDate,
          endDate,
          deliveryTimes.records.map((record) => ({
              day: record.getCellValueAsString('Day of Week'),
              time: record.getCellValueAsString('Time')
          }))
      ).map((date) => ({
          fields: {
            'Delivery Scheduled': moment(date).utc().format(),
            Hospital: [{id: recipient.id}]
          }
      }));

      yield { count: deliveries.length, recipient: name };

      // Only up to 50 records can be created at one time, so do it in batches.
      while (deliveries.length > 0) {
          deliveriesTable.createRecordsAsync(deliveries.slice(0, 50));
          deliveries = deliveries.slice(50);
      }
  }
}

export default function DeliveryBuilder({recipientsView, deliveriesTable, children}) {
  const [messages, {push: pushMessage, clear: clearMessages}] = useList();
  const recipients = recipientsView && recipientsView.selectRecords();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const recipientIds = useRecordIds(recipientsView);
  const isDisabled = !startDate || !endDate;

  const onClick = async () => {
      clearMessages();

      for await (const message of build({recipients, startDate, endDate, deliveriesTable})) {
          pushMessage(message);
      }
  };

  return <div>
        <div>
            <FormField label="Start date" style={{width: '50%', float: 'left'}}>
                <Input
                    type="date"
                    onChange={(event) => setStartDate(event.target.value)}
                    value={startDate}
                    />
            </FormField>
            <FormField label="End date" style={{width: '50%', float: 'left'}}>
                <Input
                    type="date"
                    onChange={(event) => setEndDate(event.target.value)}
                    value={endDate}
                    />
            </FormField>
        </div>

        <Button
            disabled={isDisabled}
            onClick={onClick}
            variant="primary"
            icon="bolt">
          Generate Deliveries for {recipientIds.length} Recipients
        </Button>

        <table>
            <thead>
                <tr>
                    <td># Created</td>
                    <td>Recipient</td>
                </tr>
            </thead>
            <tbody>
                {messages.map(({count, recipient}, idx) => (
                    <tr key={idx}>
                        <td>{count}</td>
                        <td>{recipient}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>;
};
