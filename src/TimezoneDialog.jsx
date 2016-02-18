import React, { Component } from 'react';
import * as _ from 'underscore';

const TimezoneDialog = ( props ) => {
  const {
    availableTimezones,
    timezoneCheckStatus,
    onCheckTimezone,
  } = props;

  const onChange = ( domEvent ) => {
    const { target } = domEvent;

    // if there is only one checked, do not allow unchecking
    // because we need at least one gutter available.
    const numChecked = _.countBy( timezoneCheckStatus, ( status ) => status )[ true ];

    if ( false === target.checked && 1 === numChecked ) {
      return;
    }

    onCheckTimezone( target.value, target.checked );
  };

  const createTimezoneCheckBox = ( timezone, index ) => {
    return (
      <li key = { index } >
        <input
          type    = 'checkbox'
          id      = { timezone }
          name    = { timezone }
          value   = { index }
          checked = { timezoneCheckStatus[ index ] }
          onChange= { onChange }
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
