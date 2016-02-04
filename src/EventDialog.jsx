import React from 'react';

const EventDialog = ( props ) => {
  const {
    calendarName,
    date,
    startTime,
    endTime,
    state,
  } = props;

  return(
      <div
        className='rbc-event-popup-dialog'
        style={ {
          zIndex: 999,
        } }
      >
        <h5>{calendarName}</h5>
        <ul>
          <li>
            <input type='radio' name='state' value='available'
            />
            <span>Avaliable</span>
          </li>
          <li>
            <input type='radio' name='state' value='afk' />
            <span>Unavailable</span>
          </li>
        <hr />
        <a href='#'>Delete</a>
        </ul>
      </div>
  );
};

export default EventDialog;
