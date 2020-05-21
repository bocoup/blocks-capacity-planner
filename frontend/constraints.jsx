import React, {useState} from 'react';
import {
    FormField,
    Heading,
    Input,
    Box,
    Text,
    Button
} from '@airtable/blocks/ui';

/**
 * Remove time information from an ISO-8601-formatted string so that it may be
 * used as the value of an HTML "date" input element.
 *
 * @param {string} date
 *
 * @returns {string}
 */
const trimDate = (date) => date.replace(/T.*$/, '');

/**
 * Insert a time specification to a date string as described by an HTML "date"
 * input element so that the string conforms to ISO 8601.
 *
 * @param {string}  date
 *
 * @returns {string}
 */
const expandDate = (date) => date + 'T00:00:00.000Z';

export default function ConfirmConstraints({
    startDate, onStartDateChange, endDate, onEndDateChange, budget,
    onBudgetChange
}) {

    const [formStartDate, setFormStartDate] = useState(startDate);
    const [formEndDate, setFormEndDate] = useState(endDate);
    const [formBudget, setFormBudget] = useState(budget);

    const updateValues = function() {
        onStartDateChange(formStartDate);
        onEndDateChange(formEndDate); 
        onBudgetChange(formBudget);
    };


    return (
        <Box padding="8px">
            <Box display="flex" flexDirection="column" alignItems="center">
                <Heading as="h3">Plan your deliveries for the week</Heading>
                <Text variant="paragraph">Set the dates and budget, then the restaurants and hospitals will show up below. 
                </Text>
                <Text variant="paragraph">
                    Drag the restaurant card from the left column to the hospital section on the right to set a delivery.

                </Text>
            </Box>

            <Box display="flex" alignItems="center" justifyContent="space-between">

                <Box >
                    <Text style={{fontWeight: 800}}>Set the dates</Text>
                    <FormField label="Start date" width="50%" paddingRight={1} style={{float: 'left'}}>
                        <Input
                            style={{width: 'auto'}}
                            type="date"
                            value={trimDate(formStartDate)}
                            onChange={(event) => setFormStartDate(expandDate(event.target.value))}
                        />
                    </FormField>

                    <FormField label="End date" width="50%" paddingLeft={1} style={{float: 'left'}}>
                        <Input
                            style={{width: 'auto'}}
                            type="date"
                            value={trimDate(formEndDate)}
                            onChange={(event) => setFormEndDate(expandDate(event.target.value))}
                        />
                    </FormField>
                </Box>
                <Box>
                    <Text style={{fontWeight: 800}}>Set the budget</Text>
                    <FormField label="Budget" width="100%">
                        <div style={{display: 'block'}}>
                            $<Input
                                type="number"
                                min="0"
                                style={{width: 'auto'}}
                                value={String(formBudget)}
                                onChange={(event) => 
                                    setFormBudget(parseFloat(event.target.value))}
                            />
                        </div>
                    </FormField>
                </Box>
                <Box >
                    <Text style={{fontWeight: 800}}>Set the warning if delivery is too far</Text>
                    <FormField label="Maximum miles away" width="100%">
                        <div style={{display: 'block', color: 'lightgrey'}}>
                            <Input
                                type="number"
                                min="0"
                                style={{width: 'auto'}}
                                value=""
                                placeholder="n/a"
                                disabled={true}
                            /> mi.
                        </div>
                    </FormField>
                </Box>
                <Box>
                    <Button style={{borderRadius:"23px", backgroundColor:"#2F80ED", color:"#F2F2F2"}}
                        minWidth="5vw"
                        marginRight={3}
                        onClick={() => updateValues()}
                    >
                        Confirm
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
