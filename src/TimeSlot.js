import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import cn from 'classnames';

import { ItemTypes } from './Constants';

const timeSlotTarget = {
  drop( props, monitor ) {
    console.log("YAAAAAA!", props, monitor.getItem() );
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

class TimeSlot extends Component {
  render() {
    const {
      staffingLevel,
      date,
      connectDropTarget,
      isOver,
      canDrop,
    } = this.props;

    return connectDropTarget(
      <div
        className={cn('rbc-time-slot', staffingLevel)}
      >
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
}

export default DropTarget( ItemTypes.EventCard, timeSlotTarget, collect )( TimeSlot );
