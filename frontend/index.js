import {
	Box,
	Button,
	initializeBlock,
	useGlobalConfig,
	useSettingsButton,
} from '@airtable/blocks/ui';
import {base} from '@airtable/blocks';
import React, {useState} from 'react';

import Chooser from './chooser';
import Settings from './settings';

function CapacityPlanner() {
	const [isShowingSettings, setIsShowingSettings] = useState(false);
	const globalConfig = useGlobalConfig();
	const recipientsTableId = globalConfig.get('recipientsTableId');
	const recipientsTable = base.getTableByIdIfExists(recipientsTableId);
	const deliveriesTableId = globalConfig.get('deliveriesTableId');
	const deliveriesTable = base.getTableByIdIfExists(deliveriesTableId);
	const recipientsViewId = globalConfig.get('recipientsViewId');
	const recipientsView = recipientsTable &&
		recipientsTable.getViewByIdIfExists(recipientsViewId);

	useSettingsButton(() => setIsShowingSettings(!isShowingSettings));

	if (isShowingSettings) {
		return <Settings />;
	}

	if (!recipientsView) {
		return (
			<Box padding={2}>
				<p>This block must be configured before it may be used.</p>

				<Button onClick={() => setIsShowingSettings(true)}>
					Configure
				</Button>
			</Box>
		);
	}

	return <Chooser />;
}

initializeBlock(() => <CapacityPlanner />);
