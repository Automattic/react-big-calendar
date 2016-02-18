import React, { Component } from 'react';

const TimezoneDialog = ( props ) => {
  const {
    availableTimezones,
    checkedTimezones,
  } = props;

  const createTimezoneCheckBox = ( timezone, index ) => {
    return (
      <li key = { index } >
        <input
          type    = 'checkbox'
          id      = { timezone }
          name    = { timezone }
          value   = { timezone }
          checked = { -1 !== checkedTimezones.findIndex( ( cand ) => cand === timezone ) }
          onChange= {() => {} }
        />
        <label htmlFor={ timezone }>{ timezone }</label>
      </li>
    );
  };

  const timezoneCheckBoxes = availableTimezones.map( createTimezoneCheckBox );

  return (
    <div className='rbc-timezone-popup-dialog'>
      { timezoneCheckBoxes }
    </div>
  );
};

export default TimezoneDialog;
