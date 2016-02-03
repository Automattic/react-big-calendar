import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import cn from 'classnames';

import { ItemTypes } from './Constants';

const timeSlotTarget = {
  drop( props, monitor ) {
    props.onDropEventCard( {
      date: props.date,
      item: monitor.getItem(),
    } )
  },
  canDrop( props ) {
    return true;
  },
};

function collect( connect, monitor ) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  };
}

const StaffingStatus = ( props ) => {
  const {
    staffing,
    need,
  } = props;

  const text = staffing + '/' + need;

  return (
      <div
        className={cn('rbc-time-slot','staffing-status')}
        style={ {
          height: '20px',
          width: '32px',
        } }
      >
        { text }
      </div>
  );
}

class TimeSlot extends Component {
  constructor( props ) {
    super( props );

    this.state = {
      hovered: false,
    };
  }

  render() {
    const {
      staffingStatus,
      date,
      connectDropTarget,
      isOver,
      canDrop,
    } = this.props;

    const {
      hovered
    } = this.state;

    return connectDropTarget(
      <div
        className={cn('rbc-time-slot', staffingStatus.level)}
        onMouseEnter={ ( event ) => {
          this.setState( {
            hovered: true,
          } );
        } }
        onMouseOut={ ( event ) => {
          this.setState( {
            hovered: false,
          } );
        } }
      >
        { hovered && this._renderStaffingStatus() }
        {
          isOver &&
          <div
            style={ {
              width: '100%',
              height: '100%',
            } }
            className={cn('rbc-time-slot', 'dragging')}
          />
        }
      </div>
    );
  }

  _renderStaffingStatus() {
    const { staffingStatus } = this.props;
    const { hovered } = this.state;

    return (
      <StaffingStatus
        staffing={ staffingStatus.staffing }
        need={ staffingStatus.need }
      />
    );
  }
}

export default DropTarget( ItemTypes.EventCard, timeSlotTarget, collect )( TimeSlot );
