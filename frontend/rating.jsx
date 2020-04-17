import React from 'react';
import {
	Tooltip,
} from '@airtable/blocks/ui';

const filled = '\u2022';
const empty = '\u25e6';

export default function Rating({style, value, max, min}) {
	const percent = (value - min) / (max - min);
	const number = Math.ceil(percent * 5);

	return (
		<Tooltip content={`min: ${min} / max: ${max}`}>
			<span style={style}>
				{value}

				<span style={{
					fontSize: '2em',
					verticalAlign: 'middle',
					lineHeight: 0,
					marginLeft: '0.2em'}}
				>
					{filled}
					{number > 1 ? filled : empty}
					{number > 2 ? filled : empty}
					{number > 3 ? filled : empty}
					{number > 4 ? filled : empty}
				</span>
			</span>
		</Tooltip>
	);
};
