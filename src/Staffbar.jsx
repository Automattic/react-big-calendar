import React from 'react';
import * as _ from 'underscore';

import message from './utils/messages';
import Gravatar from './Gravatar';

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

const StaffToggle = ( props ) => {
  const { onStaffToggle } = props;

  return (
    <a
      href='#'
      onClick={ onStaffToggle }
    > Show you
    </a>
  );
};

const Staffbar = ( props ) => {
  const { me, isStaff, others, onStaffToggle } = props;

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
        <StaffToggle
          onStaffToggle={ onStaffToggle }
        />
      </span>
    </div>
  );
};

export default Staffbar;
