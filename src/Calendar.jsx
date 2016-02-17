import React, { PropTypes } from 'react';
import uncontrollable from 'uncontrollable';
import cn from 'classnames';
import {
    accessor
  , elementType
  , dateFormat
  , views as componentViews } from './utils/propTypes';

import localizer from './localizer'
import { notify } from './utils/helpers';
import { navigate, views } from './utils/constants';
import dates from './utils/dates';
import defaultFormats from './formats';
import viewLabel from './utils/viewLabel';
import moveDate from './utils/move';
import VIEWS from './Views';
import Toolbar from './Toolbar';
import Staffbar from './Staffbar';
import EventFilterMode from './EventFilterMode';

import omit from 'lodash/object/omit';
import defaults from 'lodash/object/defaults';

function viewNames(_views){
  return !Array.isArray(_views) ? Object.keys(_views) : _views
}

function isValidView(view, { views: _views }) {
  let names = viewNames(_views)
  return names.indexOf(view) !== -1
}

let now = new Date();

const computeStaffLayout = ( me, others ) => {
  const meWidth = 180;
  const cellWidth = 36;

  const base = {
    cellWidths: [ meWidth ],
    cellPos   : [ 0 ],
    idToIndex : {
      [ me.id ] : 0,
    }
  };

  const result = others.reduce(
      ( base, staff, index ) => {
        const nCells = base.cellWidths.length;
        const prevWidth = base.cellWidths[ nCells - 1 ];
        const prevPos   = base.cellPos[ nCells - 1 ];

        base.idToIndex[ staff.id ] = nCells;
        base.cellPos.push( prevPos + prevWidth );
        base.cellWidths.push( cellWidth );

        return base;
      },
      base
  );

  return result;
};

const displayFilters = {
  [ EventFilterMode.CurrentUserOnly ]: ( events, me ) => {
    return events.filter( ( e ) => e.userId === me.id );
  },
  [ EventFilterMode.Available ]: ( events, me ) => {
    return events.filter( ( e ) => e.state === 1 ); // YACK!
  },
  [ EventFilterMode.All ]: ( events, me ) => {
    return events;
  },
};

// the current version simply let the CSS to do the trick.
// I left this function here simply for retaining the flexibility for future adjustments.
const computeCurrentUserOnlyLayout = ( me, others ) => {
  return null;
};

const computeEventLayout = {
  [ EventFilterMode.CurrentUserOnly ]: computeCurrentUserOnlyLayout,

  // Yep, these two are identical to the layout needed by Staffbar.
  [ EventFilterMode.Available ]: computeStaffLayout,
  [ EventFilterMode.All ]: computeStaffLayout,
};

/**
 * react-big-calendar is full featured Calendar component for managing events and dates. It uses
 * modern `flexbox` for layout making it super responsive and performant. Leaving most of the layout heavy lifting
 * to the browser.
 *
 * Big Calendar is unopiniated about editing and moving events, prefering to let you implement it in a way that makes
 * the most sense to your app. It also tries not to be prescriptive about your event data structures, just tell it
 * how to find the start and end datetimes and you can pass it whatever you want.
 */

const staffShape = PropTypes.shape( {
  email: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.number,
} );

let Calendar = React.createClass({

  propTypes: {
    /**
     * The current date value of the calendar. Determines the visible view range
     *
     * @controllable onNavigate
     */
    date: PropTypes.instanceOf(Date),

    /**
     * The current view of the calendar.
     *
     * @default 'month'
     * @controllable onView
     */
    view: PropTypes.string,

    /**
     * An array of event objects to display on the calendar
     */
    events: PropTypes.arrayOf(PropTypes.object),

    /**
     * Callback fired when the `date` value changes.
     *
     * @controllable date
     */
    onNavigate: PropTypes.func,

    /**
     * Callback fired when the `view` value changes.
     *
     * @controllable date
     */
    onView: PropTypes.func,

    /**
     * A callback fired when a date selection is made. Only fires when `selectable` is `true`.
     *
     * ```js
     * function(
     *   slotInfo: object {
     *     start: date,
     *     end: date,
     *     slots: array<date>
     *   }
     * )
     * ```
     */
    onSelectSlot: PropTypes.func,

    /**
     * Callback fired when a calendar event is selected.
     *
     * ```js
     * function(event: object)
     * ```
     */
    onSelectEvent: PropTypes.func,

    /**
     * An array of built-in view names to allow the calendar to display.
     *
     * @type Calendar.views
     * @default ['month', 'week', 'day', 'agenda']
     */
    views: componentViews,

    /**
     * Determines whether the toolbar is displayed
     */
    toolbar: PropTypes.bool,

    /**
     * Show truncated events in an overlay when you click the "+_x_ more" link.
     */
    popup: PropTypes.bool,

    /**
     * Distance in pixels, from the edges of the viewport, the "show more" overlay should be positioned.
     *
     * ```js
     * <BigCalendar popupOffset={30}/>
     * <BigCalendar popupOffset={{x: 30, y: 20}}/>
     * ```
     */
    popupOffset: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.shape({ x: PropTypes.number, y: PropTypes.number })
    ]),
    /**
     * Allows mouse selection of ranges of dates/times.
     */
    selectable: PropTypes.bool,

    /**
     * switch the calendar to a `right-to-left` read direction.
     */
    rtl: PropTypes.bool,

    /**
     * Optionally provide a function that returns an object of className or style props
     * to be applied to the the event node.
     *
     * ```js
     * function(
     * 	event: object,
     * 	start: date,
     * 	end: date,
     * 	isSelected: bool
     * ) -> { className: string?, style: object? }
     * ```
     */
    eventPropGetter: PropTypes.func,

    /**
     * Accessor for the event title, used to display event information. Should
     * resolve to a `renderable` value.
     *
     * @type {(func|string)}
     */
    titleAccessor: accessor,

    /**
     * Determines whether the event should be considered an "all day" event and ignore time.
     * Must resolve to a `boolean` value.
     *
     * @type {(func|string)}
     */
    allDayAccessor: accessor,

    /**
     * The start date/time of the event. Must resolve to a JavaScript `Date` object.
     *
     * @type {(func|string)}
     */
    startAccessor: accessor,

    /**
     * The end date/time of the event. Must resolve to a JavaScript `Date` object.
     *
     * @type {(func|string)}
     */
    endAccessor: accessor,

    /**
     * Constrains the minimum _time_ of the Day and Week views.
     */
    min: PropTypes.instanceOf(Date),

    /**
     * Constrains the maximum _time_ of the Day and Week views..
     */
    max: PropTypes.instanceOf(Date),

    /**
     * Localizer specific formats, tell the Calendar how to format and display dates.
     */
    formats: PropTypes.shape({
      /**
       * Format for the day of the month heading in the Month view.
       */
      dateFormat,

      /**
       * A day of the week format for Week and Day headings
       */
      dayFormat: dateFormat,
      /**
       * Week day name format for the Month week day headings.
       */
      weekdayFormat: dateFormat,

      /**
       * Toolbar header format for the Month view.
       */
      monthHeaderFormat: dateFormat,
      /**
       * Toolbar header format for the Week views.
       */
      weekHeaderFormat: dateFormat,
      /**
       * Toolbar header format for the Day view.
       */
      dayHeaderFormat: dateFormat,

      /**
       * Toolbar header format for the Agenda view.
       */
      agendaHeaderFormat: dateFormat,

      /**
       * A time range format for selecting time slots.
       */
      selectRangeFormat: dateFormat,


      agendaDateFormat: dateFormat,
      agendaTimeFormat: dateFormat,
      agendaTimeRangeFormat: dateFormat
    }),

    /**
     * Customize how different sections of the calendar render by providing custom Components.
     * In particular the `Event` component can be specified for the entire calendar, or you can
     * provide an individual component for each view type.
     *
     * ```jsx
     * let components = {
     *   event: MyEvent, // used by each view (Month, Day, Week)
     *   agenda: {
     *   	 event: MyAgendaEvent // with the agenda view use a different component to render events
     *   }
     * }
     * <Calendar components={components} />
     * ```
     */
    components: PropTypes.shape({
      event: elementType,

      agenda: PropTypes.shape({
        date: elementType,
        time: elementType,
        event: elementType
      }),

      day: PropTypes.shape({ event: elementType }),
      week: PropTypes.shape({ event: elementType }),
      month: PropTypes.shape({ event: elementType })
    }),

    /**
     * String messages used throughout the component, override to provide localizations
     */
    messages: PropTypes.shape({
      allDay: PropTypes.string,
      previous: PropTypes.string,
      next: PropTypes.string,
      today: PropTypes.string,
      month: PropTypes.string,
      week: PropTypes.string,
      day: PropTypes.string,
      agenda: PropTypes.string,
      showMore: PropTypes.func,

      join: PropTypes.string,
      joined: PropTypes.string,
      leave: PropTypes.string,
    }),

    // southp:
    // Properties from us go here
    //
    me: staffShape,

    others: PropTypes.arrayOf( staffShape ),
    /**
     * A list of name/value pair representing a calendar each.
     */
    calendarList: PropTypes.shape( {
      current: PropTypes.shape( { id: PropTypes.number, name: PropTypes.string } ),
      mine: PropTypes.arrayOf( PropTypes.shape( {
        id: PropTypes.number,
        name: PropTypes.string,
      } ) ),
      others: PropTypes.arrayOf( PropTypes.shape( {
        id: PropTypes.number,
        name: PropTypes.string,
      } ) ),
    } ),

    /**
     * A flag indicating whether the viewer is a staff of this calendar or not.
     */
    isStaff: PropTypes.bool,

    /**
     * Callback fired when the value of dropdown calendar boxchanges.
     *
     */
    onCalendarChange: PropTypes.func,

    /**
     * Callback fired when clicking the join button.
     *
     */
    onClickJoin: PropTypes.func,
    onClickLeave: PropTypes.func,

    /**
     * Callback fired when dropping a EventCard
     *
     */
    onDropEventCard: PropTypes.func,

    /**
     * A function for computing staffing status given a Date object.
     */
    staffingStatusFunc: PropTypes.func,

    /**
     * Callback fired when edit an event via EventDialog
     *
     */
    onEventEditing: PropTypes.func,

    /**
     * Callback fired when a user finished editing an event via EventDialog
     *
     */
    onEventEdited: PropTypes.func,
  },

  getDefaultProps() {
    return {
      popup: false,
      toolbar: true,
      view: views.MONTH,
      views: [views.MONTH, views.WEEK, views.DAY, views.AGENDA],
      date: now,

      titleAccessor: 'title',
      allDayAccessor: 'allDay',
      startAccessor: 'start',
      endAccessor: 'end',

      me: {},
      others: [],

      isStaff: false,
      calendarList: [],

      staffingStatusFunc: () => {},
    };
  },

  getInitialState() {
    return {
      eventFilterMode: EventFilterMode.CurrentUserOnly,
    };
  },

  render() {
    let {
        view, toolbar, events
      , culture
      , components = {}
      , formats = {}
      , style
      , className
      , date: current
      , me
      , others
      , calendarList
      , isStaff
      , staffingStatusFunc
      , ...props } = this.props;

    let {
      eventFilterMode,
    } = this.state;

    formats = defaultFormats(formats)

    let View = VIEWS[view];
    let names = viewNames(this.props.views)

    let elementProps = omit(this.props, Object.keys(Calendar.propTypes))

    let viewComponents = defaults(
      components[view] || {},
      omit(components, names)
    )

    // Filtering events and deciding layout

    let filteredEvents;
    let eventLayout;

    if ( view === 'day' ) {
      filteredEvents = displayFilters[ eventFilterMode ]( events, me );
      eventLayout = computeEventLayout[ eventFilterMode ]( me, others );

    } else { // weekly view
      filteredEvents = displayFilters[ EventFilterMode.CurrentUserOnly ]( events, me );
      eventLayout = computeEventLayout[ eventFilterMode ]( me, others );
    }

    const staffLayout = computeStaffLayout( me, others );

    return (
      <div {...elementProps}
        className={cn('rbc-calendar', className, {
          'rbc-rtl': props.rtl
        })}
        style={style}
      >
        { toolbar &&
          <Toolbar
            date={current}
            view={view}
            views={names}
            label={viewLabel(current, view, formats, culture)}
            isStaff={isStaff}
            calendarList={calendarList}
            onClickJoin={this._clickJoin}
            onClickLeave={this._clickLeave}
            onCalendarChange={this._calendarChange}
            onViewChange={this._view}
            onNavigate={this._navigate}
            messages={this.props.messages}
          />
        }
        { 'day' == view &&
          <Staffbar
            me={me}
            others={others}
            isStaff={isStaff}
            staffLayout={staffLayout}
            eventFilterMode={eventFilterMode}
            onPickFilterCurrentUserOnly={ () => {
              this.setState( {
                eventFilterMode: EventFilterMode.CurrentUserOnly,
              } )
            } }
            onPickFilterAvailable={ () => {
              this.setState( {
                eventFilterMode: EventFilterMode.Available,
              } )
            } }
            onPickFilterAll={ () => {
              this.setState( {
                eventFilterMode: EventFilterMode.All,
              } )
            } }
          />
        }
        <View
          ref='view'
          {...props}
          {...formats}
          me={me} // FIXME: this name is bad. currentUser is better.
          culture={culture}
          formats={undefined}
          events={filteredEvents}
          eventLayout={eventLayout}
          date={current}
          components={viewComponents}
          staffingStatusFunc={staffingStatusFunc}
          showDateHeader={'day' !== view}
          onNavigate={this._navigate}
          onHeaderClick={this._headerClick}
          onSelectEvent={this._select}
          onSelectSlot={this._selectSlot}
          onShowMore={this._showMore}
          onDropEventCard={this._dropEventCard}
          onEventEditing={this._eventEditing}
          onEventEdited={this._eventEdited}
        />
      </div>
    );
  },

  _navigate(action, newDate) {
    let { view, date, onNavigate } = this.props;

    date = moveDate(action, newDate || date, view)

    onNavigate(date, view)

    if (action === navigate.DATE)
      this._viewNavigate(date)
  },

  _viewNavigate(nextDate){
    let { view, date, culture } = this.props;

    if (dates.eq(date, nextDate, view, localizer.startOfWeek(culture))) {
      this._view(views.DAY)
    }
  },

  _view(view){
    if (view !== this.props.view && isValidView(view, this.props))
      this.props.onView(view)
  },

  _select(event){
    notify(this.props.onSelectEvent, event)
  },

  _selectSlot(slotInfo){
    notify(this.props.onSelectSlot, slotInfo)
  },

  _headerClick(date){
    let { view } = this.props;

    if ( view === views.MONTH || view === views.WEEK)
      this._view(views.day)

    this._navigate(navigate.DATE, date)
  },

  _clickJoin(event) {
    notify( this.props.onClickJoin, event );
  },

  _clickLeave(event) {
    notify( this.props.onClickLeave, event );
  },

  _calendarChange(event) {
    notify( this.props.onCalendarChange, event );
  },

  _dropEventCard(event) {
    notify( this.props.onDropEventCard, event );
  },

  _eventEditing(event) {
    notify( this.props.onEventEditing, event );
  },

  _eventEdited(event) {
    notify( this.props.onEventEdited, event );
  },
});

export default uncontrollable(Calendar, { view: 'onView', date: 'onNavigate', selected: 'onSelectEvent' })
