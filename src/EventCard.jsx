import React, { Component } from 'react';
import cn from 'classnames';

class EventCard extends Component {
  render() {
    const {
      style,
      title,
      onClick,
      classNamePostfix,
      label,
      eventComponent,
      isSelected,
      lastLeftOffset,
    } = this.props;

    const EventComponent = eventComponent;

    return (
      <div
        style={style}
        title={label + ': ' + title }
        onClick={onClick}
        className={cn('rbc-event', classNamePostfix, {
          'rbc-selected': isSelected,
          'rbc-event-overlaps': lastLeftOffset !== 0
        })}
      >
        <div className='rbc-event-label'>{label}</div>
        <div className='rbc-event-content'>
          { EventComponent
            ? <EventComponent event={event} title={title}/>
            : title
          }
        </div>
      </div>
    )
  }
}

export default EventCard;
