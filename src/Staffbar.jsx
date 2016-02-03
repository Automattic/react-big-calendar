import React from 'react';
import * as _ from 'underscore';

import message from './utils/messages';
import Gravatar from './Gravatar';
import EventFilterMenu from './EventFilterMenu';

const createGravatar = ( props, key ) => {
  if ( null == props ) {
    return null;
  }

  const { email, size, defaultImage } = props;

  return (
    <span className='rbc-staffbar-staffs-staff' key={ key }>
      <Gravatar
        email={ email }
        size={ size }
        defaultImage={ defaultImage }
      />
    </span>
  );
};

const Staffbar = ( props ) => {
  const {
    me,
    isStaff,
    others,
    onStaffToggle,
    onPickFilterYou,
    onPickFilterAvailable,
    onPickFilterAll,
  } = props;

  return (
    <div className='rbc-staffbar'>
      {
        isStaff &&
        <span className='rbc-staffbar-me'>
          { createGravatar( me, others.length ) }
        </span>
      }
      <span className='rbc-staffbar-staffs'>
        { _.map( others, createGravatar ) }
      </span>
      <span className='rbc-staffbar-buttons'>
        <EventFilterMenu
          onPickFilterYou={ onPickFilterYou }
          onPickFilterAvailable= { onPickFilterAvailable }
          onPickFilterAll = { onPickFilterAll }
        />
      </span>
    </div>
  );
};

export default Staffbar;
