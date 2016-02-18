import React, { Component } from 'react';

const TimezoneDialog = ( props ) => {
  const {
    availableTimezones,
    timezoneCheckStatus,
    onCheckTimezone,
  } = props;

  const createTimezoneCheckBox = ( timezone, index ) => {
    return (
      <li key = { index } >
        <input
          type    = 'checkbox'
          id      = { timezone }
          name    = { timezone }
          value   = { index }
          checked = { timezoneCheckStatus[ index ] }
          onChange= {( domEvent ) => {
            const { target } = domEvent;
            onCheckTimezone( target.value, target.checked );
          } }
        />
        <label htmlFor={ timezone }>{ timezone }</label>
      </li>
    );
  };

  const timezoneCheckBoxes = availableTimezones.map( createTimezoneCheckBox );

  return (
    <div className='rbc-timezone-popup-dialog dropdown'>
      { timezoneCheckBoxes }
    </div>
  );
};

export default TimezoneDialog;
