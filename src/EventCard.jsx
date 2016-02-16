import React, { Component } from 'react';
import Overlay from 'react-overlays/lib/Overlay';
import cn from 'classnames';
import { DragSource } from 'react-dnd';

import { ItemTypes } from './Constants';
import EventDialog from './EventDialog';

const eventCardDragSource = {
  beginDrag( props ) {
    const event = props.event;

    return {
      ...event,
    };
  },
}

function collect( connect, monitor ) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }
}

class EventCard extends Component {
  constructor( props ) {
    super( props );

    this.state = {
      showDialog: false,
    }
  }

  render() {
    const {
      style,
      title,
      onClick,
      onMouseDown,
      onMouseUp,
      classNamePostfix,
      label,
      ownedByCurrentUser,
      eventComponent,
      isSelected,
      lastLeftOffset,
      connectDragSource,
      isDragging,
      event,
    } = this.props;

    const {
      showDialog,
    } = this.state;

    const EventComponent = eventComponent;

    // FIXME: should be access via a new accessor.
    const calendarColorName = 'calendar-color-' + ( event.calendarId % 8 );

    return connectDragSource(
      <div
        style={style}
        title={label + ': ' + title }
        onClick={ ( event ) => {
          this.setState( {
            showDialog: true,
          } )
        } }
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        className={cn('rbc-event', calendarColorName, classNamePostfix, {
          'rbc-selected': isSelected,
          'rbc-event-overlaps': lastLeftOffset !== 0,
          'rbc-event-afk': event.state === 0, //FIXME: should be access via a new accessor.
        })}
      >
        { ownedByCurrentUser && <div className='rbc-event-label'>{label}</div> }
        <div className='rbc-event-content'>
          { EventComponent
            ? <EventComponent event={event} title={title}/>
            : title
          }
        </div>
        { showDialog && this._renderDialog() }
      </div>
    );
  }

  _renderDialog() {
    const {
      event,
      ownedByCurrentUser,
      onEventEditing,
      onEventEdited,
    } = this.props;

    const {
      showDialog,
    } = this.state;

    return (
        <Overlay
          rootClose
          placement='right'
          container={ this }
          show={ showDialog }
          onHide={ () => this.setState( { showDialog: false } ) }
        >
          <EventDialog
            event={ event }
            ownedByCurrentUser={ ownedByCurrentUser }
            onEventEditing={ onEventEditing }
            onEventEdited={ onEventEdited }
          />
        </Overlay>
    );
  }
}

export default DragSource( ItemTypes.EventCard, eventCardDragSource, collect )( EventCard );
