import React, {useCallback} from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import {
    Box,
    Heading,
    Icon,
    ProgressBar,
} from '@airtable/blocks/ui';

import assignmentInstructions from './assignment-instructions';
import buildNullAssignments from './build-null-assignments';
import isTimeOfDay from './is-time-of-day';
import Rating from './rating';

function AssignmentDropTarget({as, children, consumerId, onAssign, accept, ...rest}) {
    const El = as || 'div';
    const [, drop] = useDrop({
        accept,
        drop(item) {
            onAssign({sourceAssignmentId: item.id, newConsumerId: consumerId});
        }
    });

    return (
        <El ref={drop} {...rest}>
            {children}
        </El>
    );
}

function AssignmentList({consumerId, style, producers, assignments, display, type}) {
    const items = assignments
        .filter((assignment) => assignment.consumerId === consumerId)
        .map((assignment) => (
            <AssignmentItem
                key={assignment.producerId}
                assignment={assignment}
                producer={producers.find(({id}) => id === assignment.producerId)}
                type={type}
                display={display} />));

    // Sort items by name
    items.sort((itemA, itemB) => {
        return itemA.props.producer.name > itemB.props.producer.name ? 1 : -1;
    });

    return (
        <ul style={{listStyleType: 'none', margin: 0, padding: 0, ...style}}>
            {items}
        </ul>
    );
}

function AssignmentItem({producer, assignment, type, display}) {
    const [, drag] = useDrag({
        item: { id: assignment.id, type }
    });

    return (
        <li
            ref={drag}
            className="clearfix"
            style={{
                cursor: 'pointer',
                border: 'solid 1px #ddd',
                borderRadius: '0.4em',
                padding: '0.5em',
                margin: '0.3em 0',
                backgroundColor: '#fff'
            }}
        >
            <span style={{float: 'left'}}>
                {producer.name} ({assignment.amount}/{producer.capacity})
                {display == 'descriptor' ? <span style={{color: 'gray', marginLeft: '0.5em'}}>{producer.descriptor}</span> : '' }
            </span>


            {display == 'price' || display == 'capacity' ?
                <Rating
                    style={{float: 'right', marginLeft: '1em'}}
                    value={producer[display]}
                    min={producer[`min${display}`]}
                    max={producer[`max${display}`]} />
                : ''}

        </li>
    );
}

function ConsumerRow({
    consumer, time, producers, assignments, onAssign, accept, producerDisplay
}) {
    const provided = assignments.reduce((total, assignment) => {
        return total + assignment.amount;
    }, 0);
    const fulfillment = provided / consumer.need;
    let icon;

    if (fulfillment < 1) {
        icon = 'checkboxUnchecked';
    } else if (fulfillment === 1) {
        icon = 'checkboxChecked';
    } else {
        icon = 'warning';
    }

    const assign = useCallback(
        (data) => onAssign({time, ...data}),
        [time, onAssign]
    );

    return (
        <AssignmentDropTarget
            as="tbody"
            consumerId={consumer.id}
            onAssign={assign}
            accept={accept}>
            <tr style={{backgroundColor: '#ddd'}}>
                <td style={{padding: '0.3em 0 0 0.3em'}}>
                    <Heading as="h4" style={{fontSize: '1em', margin: 0}}>
                        {consumer.name}
                    </Heading>
                </td>
                <td style={{paddingRight: '1em'}}>
                    {time}
                </td>
                <td style={{whiteSpace: 'nowrap', paddingRight: '1em'}}>
                    {provided} / {consumer.need}
                </td>
                <td style={{width: '40%'}}>
                    <Box width={`${100*consumer.need/consumer.maxneed}%`}>
                        <ProgressBar
                            height="1em"
                            progress={fulfillment}
                            barColor="#888"
                        />
                    </Box>
                </td>
                <td style={{padding: '0.3em 0.3em 0 0'}}>
                    <Icon name={icon} />
                </td>
            </tr>
            <tr style={{backgroundColor: '#eee'}}>
                <td colSpan="2" style={{padding: '0.3em 0 0 0.3em'}}>
                    <AssignmentList
                        style={{minHeight: '3em'}}
                        consumerId={consumer.id}
                        producers={producers}
                        assignments={assignments}
                        display={producerDisplay}
                        type={accept}
                    />
                </td>
                <td colSpan="3"></td>
            </tr>
        </AssignmentDropTarget>
    );
}

export default function ShiftView({shift, producers, consumers, producerDisplay, onAssign}) {
    const id = `${shift.date} ${shift.timeOfDay}`;
    const nullAssignments = buildNullAssignments(
        shift.date, shift.timeOfDay, producers, shift.assignments
    );
    const assign = ({sourceAssignmentId, time, newConsumerId}) => {
        const source = /^NullAssignment:/.test(sourceAssignmentId) ?
            nullAssignments : shift.assignments;
        const assignment = source.find(({id}) => id === sourceAssignmentId);

        onAssign(assignmentInstructions({
            consumers,
            assignments: shift.assignments,
            assignment,
            consumerId: newConsumerId,
            date: `${shift.date}T${time}:00.000Z`,
        }));
    };
    const consumerRows = consumers.map((consumer) => {
        const time = consumer.times.find(({day, time}) => {
            return day === shift.day && isTimeOfDay(time, shift.timeOfDay);
        });

        if (!time) {
            return null;
        }

        return (
            <ConsumerRow
                key={consumer.id}
                consumer={consumer}
                time={time.time}
                producers={producers}
                assignments={shift.assignments.filter(({consumerId}) => consumerId === consumer.id)}
                accept={id}
                onAssign={assign}
                producerDisplay={producerDisplay} />
        );
    }).filter((row) => !!row);

    // The container's CSS `height` must be explicitly set only in cases where
    // overflow is expected. `max-height` is not appropriate for this situation
    // because it will cause the vertical scroll bar to be assigned to the
    // container itself (as opposed to the child which exceeds the boundary).
    let height, content;
    if (consumerRows.length === 0) {
        height = 'auto';
        content = <p>No consumers found for this period.</p>;
    } else {
        height = '90%';
        content = (
            <div style={{height: '100%', overflowY: 'auto'}}>
                <Box style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: '20%',
                    overflowY: 'auto'
                }}>
                    <AssignmentDropTarget
                        consumerId={null}
                        accept={id}
                        onAssign={assign}
                    >
                        <Heading as="h4" style={{fontSize: '1em', fontWeight: 'bold'}}>
                            Ready to Deliver Restaurants
                        </Heading>

                        <AssignmentList
                            consumerId={null}
                            producers={producers}
                            assignments={nullAssignments}
                            display={producerDisplay}
                            type={id}
                        />
                    </AssignmentDropTarget>
                </Box>

                <table
                    cellSpacing="0"
                    style={{
                        marginLeft: '20%',
                        width: '80%',
                        paddingLeft: '1em',
                        maxHeight: '100%',
                        overflowY: 'auto'
                    }}>
                    <caption style={{textAlign: 'left', fontWeight: 'bold', paddingLeft: '10px', paddingBottom: '10px'}}>Recipients</caption>
                    <thead>
                        <tr>
                            <td style={{textTransform: 'uppercase' }}>Name</td>
                            <td style={{textTransform: 'uppercase' }}>Time</td>
                            <td style={{textTransform: 'uppercase' }}>Amount</td>
                            <td colSpan="2" style={{textTransform: 'uppercase', textAlign: 'center'}}>
                                Fulfillment
                            </td>
                        </tr>
                    </thead>
                    {consumerRows}
                </table>
            </div>
        );
    }

    return (
        <DndProvider backend={Backend}>
            <Box style={{height, display: 'flex', flexDirection: 'column'}}>
                <header className="clearfix">
                    <Heading as="h3" style={{float: 'left'}}>
                        {shift.day} {shift.timeOfDay}
                    </Heading>
                    <span style={{float: 'right'}}>{shift.date}</span>
                </header>

                <Box marginBottom={4} style={{flexGrow: 1, position: 'relative', overflowY: 'auto'}}>
                    {content}
                </Box>
            </Box>
        </DndProvider>
    );
}
