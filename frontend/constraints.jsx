import React from 'react';
import {
	Dialog,
	FormField,
	Heading,
	Input,
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

export default function Constraints({
	onClose, startDate, onStartDateChange, endDate, onEndDateChange, budget,
	onBudgetChange
}) {
	return (
		<Dialog onClose={onClose}>
			<Dialog.CloseButton />
			<Heading as="h3">Schedule constraints</Heading>

			<FormField label="Start date" width="50%" paddingRight={1} style={{float: 'left'}}>
				<Input
					type="date"
					value={trimDate(startDate)}
					onChange={(event) => onStartDateChange(expandDate(event.target.value))}
				/>
			</FormField>

			<FormField label="End date" width="50%" paddingLeft={1} style={{float: 'left'}}>
				<Input
					type="date"
					value={trimDate(endDate)}
					onChange={(event) => onEndDateChange(expandDate(event.target.value))}
				/>
			</FormField>

			<FormField label="Budget">
				<div style={{display: 'block'}}>
					$<Input
						type="number"
						min="0"
						style={{width: 'auto'}}
						value={String(budget)}
						onChange={(event) => {
							onBudgetChange(parseFloat(event.target.value));
						}}
					/>
				</div>
			</FormField>
		</Dialog>
	);
}
