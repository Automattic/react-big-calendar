import React from 'react';
import { findDOMNode } from 'react-dom';
import Selection, { getBoundsForNode } from './Selection';
import cn from 'classnames';

import dates from './utils/dates';
import { isSelected } from './utils/selection';
import localizer from './localizer'

import { notify } from './utils/helpers';
import { accessor } from './utils/propTypes';
import { accessor as get } from './utils/accessors';

import EventCard from './EventCard';
import EventDialog from './EventDialog';
import TimeSlot from './TimeSlot';
import NowIndicator from './NowIndicator';

function snapToSlot(date, step){
  var roundTo = 1000 * 60 * step;
  return new Date(Math.floor(date.getTime() / roundTo) * roundTo)
}

function positionFromDate(date, min, step){
  return dates.diff(min, dates.merge(min, date), 'minutes')
}

function overlaps(event, events, { startAccessor, endAccessor }, last) {
  let eStart = get(event, startAccessor);
  let offset = last;

  function overlap(eventB){
    return dates.lt(eStart, get(eventB, endAccessor))
  }

  if (!events.length) return last - 1
  events.reverse().some(prevEvent => {
    if (overlap(prevEvent)) return true
    offset = offset - 1
  })

  return offset
}

let DaySlot = React.createClass({

  propTypes: {
    events: React.PropTypes.array.isRequired,
    step: React.PropTypes.number.isRequired,
    min: React.PropTypes.instanceOf(Date).isRequired,
    max: React.PropTypes.instanceOf(Date).isRequired,

    allDayAccessor: accessor.isRequired,
    startAccessor: accessor.isRequired,
    endAccessor: accessor.isRequired,

    selectable: React.PropTypes.bool,
    eventOffset: React.PropTypes.number,

    onSelectSlot: React.PropTypes.func.isRequired,
    onSelectEvent: React.PropTypes.func.isRequired,

    onDropEventCard: React.PropTypes.func.isRequired,
  },

  getInitialState() {
    return { selecting: false };
  },


  componentDidMount() {
    this.props.selectable
      && this._selectable();

    this._updateNowIntervalId = setInterval( () => {
      this.setState( {} ); // FIXME: is there any better way to trigger an view update?
    }, 600000 ); // update at every 10 mins;
  },

  componentWillUnmount() {
    this._teardownSelectable();

    clearInterval( this._updateNowIntervalId );
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectable && !this.props.selectable)
      this._selectable();
    if (!nextProps.selectable && this.props.selectable)
      this._teardownSelectable();
  },

  render() {
    let {
        min, max, step, start, end
      , selectRangeFormat, culture
      , staffingStatusFunc
      , staffLayout
      , onDropEventCard
      , ...props } = this.props;

    let totalMin = dates.diff(min, max, 'minutes');
    let numSlots = Math.ceil(totalMin / step);
    let children = [];

    for (var i = 0; i < numSlots; i++) {
      const slotDate = dates.add( min, step * i, 'minutes' );
      const staffingStatus = staffingStatusFunc( slotDate );

      children.push(
        <TimeSlot
          key={i}
          staffingStatus={staffingStatus}
          date={slotDate}
          onDropEventCard={onDropEventCard}
        />
      );
    }

    this._totalMin = totalMin;

    let { selecting, startSlot, endSlot } = this.state
       , style = this._slotStyle(startSlot, endSlot, 0)

    let selectDates = {
      start: this.state.startDate,
      end: this.state.endDate
    };

    // Only show NowIndicator for the current day.
    const now = new Date();
    const currentBeginOfDay = dates.startOf( now, 'day' );
    const showNowIndicator = currentBeginOfDay.getTime() === min.getTime();
    const nowPosProportion = ( positionFromDate( now, min, step ) / totalMin ) * 100;

    return (
      <div {...props} className={cn('rbc-day-slot', props.className)}>
        { children }
        { this.renderEvents(numSlots, totalMin, staffLayout) }
        {
          selecting &&
            <div className='rbc-slot-selection' style={style}>
              <span>
              { localizer.format(selectDates, selectRangeFormat, culture) }
              </span>
            </div>
        }
        {
          showNowIndicator &&
          <NowIndicator topOffset={nowPosProportion} />
        }
      </div>
    );
  },

  renderEvents(numSlots, totalMin, staffLayout) {
    let {
        events, step, min, culture, eventPropGetter
      , selected, eventTimeRangeFormat, eventComponent
      , displayFilterFunc, onEventEditing, onEventEdited
      , startAccessor, endAccessor, titleAccessor } = this.props;

    const {
      cellWidths,
      cellPos,
      idToIndex,
    } = staffLayout;

    let lastLeftOffset = 0;

    events.sort((a, b) => +get(a, startAccessor) - +get(b, startAccessor))

    const filteredEvents = displayFilterFunc( events );

    return filteredEvents.map((event, idx) => {
      let start = get(event, startAccessor)
      let end = get(event, endAccessor)
      let startSlot = positionFromDate(start, min, step);
      let endSlot = positionFromDate(end, min, step);

      lastLeftOffset = Math.max(0,
        overlaps(event, events.slice(0, idx), this.props, lastLeftOffset + 1))

      let style = this._slotStyle(startSlot, endSlot, lastLeftOffset)

      let title = get(event, titleAccessor)
      let label = localizer.format({ start, end }, eventTimeRangeFormat, culture);
      let _isSelected = isSelected(event, selected);

      if (eventPropGetter)
        var { style: xStyle, className } = eventPropGetter(event, start, end, _isSelected);


      let pauseSelector = () => {
        return ( event ) => {
          if ( this._selector ) {
            this._selector.pause();
          }
        }
      }

      let resumeSelector = () => {
        return ( event ) => {
          if ( this._selector ) {
            this._selector.resume();
          }
        }
      }

      const eventCellIndex = idToIndex[ event.userId ];
      const eventWidth = cellWidths[ eventCellIndex ] - 1; // to leave a small spacing between EventCards.
      const eventPos = cellPos[ eventCellIndex ];

      const alignToStaffStyle = {
        left: eventPos,
        width: eventWidth,
      }

      return (
        <EventCard
          key={'evt_' + idx}
          style={{...xStyle, ...style, ...alignToStaffStyle }}
          title={title}
          onClick={this._select.bind(null, event)}
          onMouseDown={pauseSelector()}
          onMouseUp={resumeSelector()}
          onEventEditing={onEventEditing}
          onEventEdited={onEventEdited}
          classNamePostfix={className}
          eventComponent={eventComponent}
          label={label}
          event={event}
        />
      );
    })
  },

  _slotStyle(startSlot, endSlot, leftOffset){

    endSlot = Math.max(endSlot, startSlot + this.props.step) //must be at least one `step` high

    let eventOffset = this.props.eventOffset || 10
      , isRtl = this.props.rtl;

    let top = ((startSlot / this._totalMin) * 100);
    let bottom = ((endSlot / this._totalMin) * 100);
    let per = leftOffset === 0 ? 0 : leftOffset * eventOffset;
    let rightDiff = (eventOffset / (leftOffset + 1));

    return {
      top: top + '%',
      height: bottom - top + '%',
      [isRtl ? 'right' : 'left']: per + '%',
      width: (leftOffset === 0 ? (100 - eventOffset) : (100 - per) - rightDiff) + '%',
      overflow: 'visible',
    }
  },

  _selectable(){
    let node = findDOMNode(this);
    let selector = this._selector = new Selection(()=> findDOMNode(this))

    let selectionState = ({ x, y }) => {
      let { step, min, max } = this.props;
      let { top, bottom } = getBoundsForNode(node)

      let mins = this._totalMin;

      let range = Math.abs(top - bottom)

      let current = (y - top) / range;

      current = snapToSlot(minToDate(mins * current, min), step)

      if (!this.state.selecting)
        this._initialDateSlot = current

      let initial = this._initialDateSlot;

      if (dates.eq(initial, current, 'minutes'))
        current = dates.add(current, step, 'minutes')

      let start = dates.max(min, dates.min(initial, current))
      let end = dates.min(max, dates.max(initial, current))

      return {
        selecting: true,
        startDate: start,
        endDate: end,
        startSlot: positionFromDate(start, min, step),
        endSlot: positionFromDate(end, min, step)
      }
    }

    selector.on('selecting',
      box => this.setState(selectionState(box)))

    selector.on('selectStart',
      box => this.setState(selectionState(box)))

    selector
      .on('click', ({ x, y }) => {
        this._clickTimer = setTimeout(()=> {
          this._selectSlot(selectionState({ x, y }))
        })

        this.setState({ selecting: false })
      })

    selector
      .on('select', () => {
        this._selectSlot(this.state)
        this.setState({ selecting: false })
      })
  },

  _teardownSelectable() {
    if (!this._selector) return
    this._selector.teardown();
    this._selector = null;
  },

  _selectSlot({ startDate, endDate, endSlot, startSlot }) {
    let current = startDate
      , slots = [];

    while (dates.lte(current, endDate)) {
      slots.push(current)
      current = dates.add(current, this.props.step, 'minutes')
    }

    notify(this.props.onSelectSlot, {
      slots,
      start: startDate,
      end: endDate
    })
  },

  _select(event){
    clearTimeout(this._clickTimer);
    notify(this.props.onSelectEvent, event)
  }
});


function minToDate(min, date){
  var dt = new Date(date)
    , totalMins = dates.diff(dates.startOf(date, 'day'), date, 'minutes');

  dt = dates.hours(dt, 0);
  dt = dates.minutes(dt, totalMins + min);
  dt = dates.seconds(dt, 0)
  return dates.milliseconds(dt, 0)
}

export default DaySlot;
