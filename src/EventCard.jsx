import React, { Component } from 'react';
import Overlay from 'react-overlays/lib/Overlay';
import cn from 'classnames';
import { DragSource } from 'react-dnd';

import { ItemTypes } from './Constants';
import EventDialog from './EventDialog';
import LoadingSpinner from './LoadingSpinner';

const eventCardDragSource = {
  canDrag( props ) {
    const {
      event,
      ownedByCurrentUser,
    } = props;

    return ownedByCurrentUser && ! isSavingBackToServer( event );
  },

  beginDrag( props ) {
    const {
      event,
      onDropEventCard,
    } = props;

    return {
      onDropEventCard: onDropEventCard,
      event: event,
    };
  },
}

function collect( connect, monitor ) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }
}

// TODO:
// A more general way of doing this.
const isSavingBackToServer = ( event ) => {
  return -1 === event.id;
};

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
      upperPartial,
      lowerPartial,
    } = this.props;

    const {
      showDialog,
    } = this.state;

    // FIXME: should be access via a new accessor.
    const calendarColorName = 'calendar-color-' + ( event.calendarId % 8 );

    const styleAfterDragging = Object.assign( {}, style );
    if ( isDragging ) {
      styleAfterDragging.visibility = 'hidden';
    } else {
      styleAfterDragging.visibility = 'visible';
    }

    const isSaving = isSavingBackToServer( event );

    return connectDragSource(
      <div
        style={styleAfterDragging}
        title={ label + ': ' + title }
        onClick={ ( event ) => {
          if ( ownedByCurrentUser && ! isSaving ) {
            const toggledShowDialog = ! showDialog;
            this.setState( {
              showDialog: toggledShowDialog,
            } )
          }
        } }
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        className={cn('rbc-event', calendarColorName, classNamePostfix, {
          'rbc-selected': isSelected,
          'rbc-event-overlaps': lastLeftOffset !== 0,
          'rbc-event-afk': event.state === 0, //FIXME: should be access via a new accessor.
        })}
      >
        { isSaving && <LoadingSpinner /> }
        { ownedByCurrentUser && ! lowerPartial && <div className='rbc-event-label'>{label}</div> }
        <div className='rbc-event-content'>
          { this._renderEventContent() }
        </div>
        { showDialog && this._renderDialog() }
      </div>
    );
  }

  _renderEventContent() {
    const {
      title,
      event,
      eventComponent,
    } = this.props;

    const EventComponent = eventComponent;

    return ( EventComponent ? <EventComponent event={event} title={title}/> : title );
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
