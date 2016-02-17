import React from 'react';
import * as _ from 'underscore';

import message from './utils/messages';
import Gravatar from './Gravatar';
import EventFilterMenu from './EventFilterMenu';

const createStaffSpan = ( cellWidth, cellPos, key, innerElement ) => {
  return (
    <span className='rbc-staffbar-staffs-staff' key={ key }
      style={ {
        left: cellPos,
        width: cellWidth,
      } }
    >
      { innerElement }
    </span>
  );
}

const createGravatar = ( [ staff, cellWidth, cellPos ], key ) => {
  if ( null == staff ) {
    return createStaffSpan( cellWidth, cellPos, key );
  }

  const { email, size, defaultImage } = staff;

  const gravatar = (
    <Gravatar
      email={ email }
      size={ size }
      defaultImage={ defaultImage }
    />
  );

  return createStaffSpan( cellWidth, cellPos, key, gravatar );
};

const staffsToGravatars = ( staffs, staffLayout ) => {
  const {
    cellWidths,
    cellPos,
  } = staffLayout;

  const staffAndLayout = _.zip( staffs, cellWidths, cellPos );

  return (
    <span className='rbc-staffbar-staffs'>
      { _.map( staffAndLayout, createGravatar ) }
    </span>
  );
};

const Staffbar = ( props ) => {
  const {
    me,
    isStaff,
    others,
    staffLayout,
    onStaffToggle,
    onPickFilterCurrentUserOnly,
    onPickFilterAvailable,
    onPickFilterAll,
  } = props;

  let staffs;
  if ( isStaff ) {
    staffs = [ me, ...others ];
  } else {
    staffs = [ null, ...others ];
  }

  return (
    <div className='rbc-staffbar'>
      { staffsToGravatars( staffs, staffLayout ) }
      <span className='rbc-staffbar-buttons'>
        <EventFilterMenu
          onPickFilterCurrentUserOnly={ onPickFilterCurrentUserOnly }
          onPickFilterAvailable= { onPickFilterAvailable }
          onPickFilterAll = { onPickFilterAll }
        />
      </span>
    </div>
  );
};

export default Staffbar;
