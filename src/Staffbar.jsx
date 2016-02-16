import React from 'react';
import * as _ from 'underscore';

import message from './utils/messages';
import Gravatar from './Gravatar';
import EventFilterMenu from './EventFilterMenu';

const createGravatar = ( [ staff, cellWidth, cellPos ], key ) => {
  const { email, size, defaultImage } = staff;

  return (
    <span className='rbc-staffbar-staffs-staff' key={ key }
      style={ {
        position: 'absolute',
        left: cellPos,
        width: cellWidth,
      } }
    >
      <Gravatar
        email={ email }
        size={ size }
        defaultImage={ defaultImage }
      />
    </span>
  );
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
    onPickFilterYou,
    onPickFilterAvailable,
    onPickFilterAll,
  } = props;

  return (
    <div className='rbc-staffbar'>
      { staffsToGravatars( [ me, ...others ], staffLayout ) }
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
