import React from 'react';
import moment from 'moment';

const createEditingEvent = ( type, value, target ) => {
  return {
    type: type,
    value: value,
    target: target,
  }
};

const toTimeText = ( date ) => {
  return moment( date ).format( 'hh:mma' );
};

const EventDialog = ( props ) => {
  const {
    event,
    onEventEditing,
  } = props;

  const {
    calendarName,
    startTime,
    endTime,
    state,
  } = event;

  const dateText = moment( startTime ).format( 'll' );
  const timeRangeText = toTimeText( startTime ) + ' to ' + toTimeText( endTime );

  const onClickDelete = ( domEvent ) => {
    const deleteEvent = createEditingEvent( 'delete', null, event );
    onEventEditing( deleteEvent );

    domEvent.preventDefault();
    domEvent.stopPropagation();
  };

  const onChangeToAvailable = ( domEvent ) => {
    const availableEvent = createEditingEvent( 'state', 1, event );
    onEventEditing( availableEvent );
  };

  const onChangeToUnavailable = ( domEvent ) => {
    const unavailableEvent = createEditingEvent( 'state', 0, event );
    onEventEditing( unavailableEvent );
  };

  return(
      <div
        className='rbc-event-popup-dialog'
        style={ {
          position: 'absolute',
          top: '20px',
          left: '10px',
        } }
      >
        <h5>{calendarName}</h5>
        <p>{dateText}</p>
        <p>{timeRangeText}</p>
        <ul>
          <li>
            <input type='radio' name='state' value='available' checked={ 1 === state }
              onChange={onChangeToAvailable}
            />
            <span>Avaliable</span>
          </li>
          <li>
            <input type='radio' name='state' value='afk' checked={ 0 === state }
              onChange={onChangeToUnavailable}
            />
            <span>Unavailable</span>
          </li>
        <hr />
        <a href='#' onClick={onClickDelete}>Delete</a>
        </ul>
      </div>
  );
};

export default EventDialog;
