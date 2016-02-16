import React, { Component } from 'react';
import moment from 'moment';

const editEvent = ( type, value, target ) => {
  return {
    type: type,
    value: value,
    target: target,
  }
};

const toTimeText = ( date ) => {
  return moment( date ).format( 'hh:mma' );
};

class EventDialog extends Component {

  componentWillUnmount() {
    const {
      event,
      onEventEdited,
    } = this.props;

    const finishedEvent = editEvent( 'finished', null, event );
    onEventEdited( finishedEvent );
  }

  render() {
    const {
      event,
      onEventEditing,
    } = this.props;

    const {
      calendarName,
      start,
      end,
      state,
    } = event;

    const dateText = moment( start ).format( 'll' );
    const timeRangeText = toTimeText( start ) + ' to ' + toTimeText( end );

    const onClickDelete = ( domEvent ) => {
      const deleteEvent = editEvent( 'delete', null, event );
      onEventEditing( deleteEvent );

      domEvent.preventDefault();
      domEvent.stopPropagation();
    };

    const onChangeToAvailable = ( domEvent ) => {
      const availableEvent = editEvent( 'state', 1, event );
      onEventEditing( availableEvent );
    };

    const onChangeToUnavailable = ( domEvent ) => {
      const unavailableEvent = editEvent( 'state', 0, event );
      onEventEditing( unavailableEvent );
    };

    return(
        <div className='rbc-event-popup-dialog'>
          <h5>{calendarName}</h5>
          <p>{dateText}</p>
          <p>{timeRangeText}</p>
          <ul>
            <li>
              <input type='radio' id='available' name='state' value='available' checked={ 1 === state }
                onChange={onChangeToAvailable}
              />
              <label htmlFor='available'>Available</label>
            </li>
            <li>
              <input type='radio' id='unavailable' name='state' value='afk' checked={ 0 === state }
                onChange={onChangeToUnavailable}
              />
              <label htmlFor='unavailable'>Unavailable</label>
            </li>
          </ul>
          <a href='#' className="link-highlight" onClick={onClickDelete}>Delete</a>
        </div>
    );
  }
};

export default EventDialog;
