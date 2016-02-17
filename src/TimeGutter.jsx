import React from 'react';
import cn from 'classnames';
import dates from './utils/dates';
import localizer from './localizer'

import moment from 'moment-timezone';

let TimeGutter = React.createClass({

  propTypes: {
    step: React.PropTypes.number.isRequired,
    min: React.PropTypes.instanceOf(Date).isRequired,
    max: React.PropTypes.instanceOf(Date).isRequired
  },

  render() {
    let { min, max, step, timeGutterFormat, culture, timezoneName } = this.props;
    let today = new Date()
    let totalMin = dates.diff(min, max, 'minutes')
    let numSlots = Math.ceil(totalMin / step)
    let date = min;
    let children = []; //<div key={-1} className='rbc-time-slot rbc-day-header'>&nbsp;</div>

    // TODO:
    // Providing a customized format function may not a clean way to do the trick.
    // The point is to generate time strings according to `timezoneName`.
    const formatFunc = ( value, culture, localizer ) => {
      let actualTimezone;
      if ( 'Local' === timezoneName ) {
        actualTimezone = moment.tz.guess();
      } else {
        actualTimezone = timezoneName;
      }
      return moment( value ).tz( actualTimezone ).format( timeGutterFormat );
    };

    for (var i = 0; i < numSlots; i++) {
      let isEven = (i % 2) === 0;
      let next = dates.add(date, step, 'minutes');
      children.push(
        <div key={i}
          className={cn('rbc-time-slot', {
            'rbc-now': dates.inRange(today, date, next, 'minutes')
          })}
        >
        { isEven && (
            <span>{localizer.format(date, formatFunc, culture )}</span>
          )
        }
        </div>
      )

      date = next
    }

    return (
      <div className='rbc-time-gutter'>
        {children}
      </div>
    );
  }
});

export default TimeGutter
