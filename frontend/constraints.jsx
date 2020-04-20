import React, {useCallback, useState} from 'react';
import {
	Dialog,
	FormField,
	Heading,
	Input,
} from '@airtable/blocks/ui';

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
					value={startDate}
					onChange={(event) => onStartDateChange(event.target.value)}
					/>
			</FormField>

			<FormField label="End date" width="50%" paddingLeft={1} style={{float: 'left'}}>
				<Input
					type="date"
					value={endDate}
					onChange={(event) => onEndDateChange(event.target.value)}
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
