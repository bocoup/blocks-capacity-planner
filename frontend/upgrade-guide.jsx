import React, { useState } from 'react';
import {
    Button,
    Dialog,
    Heading,
    loadCSSFromString,
    Tooltip
} from '@airtable/blocks/ui';

loadCSSFromString(`
    .upgrade-guide {
        max-width: 90vw;
        max-height: 90vh;
        display: flex;

        flex-direction: column;
    }

    .upgrade-guide h2 {
        margin: 0;
    }

    .upgrade-guide .contents {
        flex-grow: 1;
        overflow-y: auto;
    }
`);

export default function UpgradeGuide({displayText, ...otherProps}) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <React.Fragment>
            <Tooltip
                content="Upgrade guide">
                <Button
                    onClick={() => setIsDialogOpen(true)}
                    icon="book"
                    aria-label="Upgrade guide"
                    {...otherProps}
                >
                    {displayText ? 'Upgrade guide' : ''}
                </Button>
            </Tooltip>

            {isDialogOpen && (
                <Dialog
                    onClose={() => setIsDialogOpen(false)}
                    className="upgrade-guide"
                >
                    <header>
                        <Heading>Upgrade guide</Heading>
                        <Dialog.CloseButton />
                    </header>
                    {contents}
                </Dialog>
            )}
        </React.Fragment>
    );
}

/* eslint-disable react/no-unescaped-entities */
const contents = <div className="contents">
    <p>
        Occassionally, using a new release of the Capacity Planner block
        requires making some change to your base or the block's settings. This
        guide explains each release and what must be done to support it.
    </p>

    <h2>Version 1.1</h2>
    <time>2020-05-18</time>
    <p>
        <b>Enhancement:</b> replace "afternoon" and "evening" shifts with
        "breakfast," "lunch," "dinner," and "late night" shifts.
    </p>

    <p>
        <b>To upgrade:</b> change the restaurant "availability" values from
        (for example) "Sunday evening" to "Sunday dinner".
    </p>

    <h2>Version 1.0</h2>
    <time>2020-04-15</time>

    <p>Initial release.</p>
</div>;
