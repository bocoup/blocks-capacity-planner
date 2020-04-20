import React, {useCallback, useState} from 'react';
import {
	Dialog,
	FormField,
	Heading,
	Input,
} from '@airtable/blocks/ui';

export default function Constraints({onClose, budget, onBudgetChange}) {
	return (
		<Dialog onClose={onClose}>
			<Dialog.CloseButton />
			<Heading as="h3">Schedule constraints</Heading>

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
