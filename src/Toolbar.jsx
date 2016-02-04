import React from 'react';
import cn from 'classnames';
import message from './utils/messages';
import { navigate } from './utils/constants';

import iconCog from './img/icon-cog.svg';
import chevronLeft from './img/chevron-left.svg';
import chevronRight from './img/chevron-right.svg';

const renderCalendarListItem = ( calendar ) => {
  return (
      <li key={ calendar.id } >
        <a href='#'> { calendar.name } </a>
      </li>
  );
};

const JoinButton = ( props ) => {
  const { isStaff, onClickJoin, onClickLeave, joinMsg, joinedMsg, leaveMsg } = props;

  const callback = isStaff ? onClickLeave : onClickJoin;
  const msg      = isStaff ? leaveMsg     : joinMsg;

  return (
      <button
        type='button'
        onClick={ callback }
      >
        { msg }
      </button>
  );
};


let Toolbar = React.createClass({

  getInitialState() {
    return {
      showCalendarList: false,
    }
  },

  render() {
    let {
        messages, label
      , views: viewNames, view
      , isStaff
      , calendarList, onCalendarChange, onClickJoin
      , onClickLeave } = this.props;

    const {
      showCalendarList,
    } = this.state;

    const selectClassName = 'select' + ( showCalendarList ? '' : ' hidden' );

    messages = message(messages)

    return (
      <div className='rbc-toolbar'>
        <div className='rbc-toolbar-header'>
          <span className='rbc-toolbar-label'>
            { label }
          </span>
        </div>
        <div className='rbc-toolbar-tools'>
          <div className='rbc-toolbar-calendars'>
	          <div className='select-container'>
	          	<a href='#' onClick={ this._onClickCalendarList }> { calendarList.current.name }</a>
	          	<div className={ selectClassName }>
	          		<div className='select-calendar-search'>
	          			<input type='text' placeholder='Search' />
	          		</div>
	          		<div className='select-calendar-type'>
	          			<h5>Your calendars</h5>
                  <ul>
                  { calendarList.mine.map( renderCalendarListItem ) }
                  </ul>
	          		</div>
	          		<div className='select-calendar-type'>
	          			<h5>Other</h5>
	          			<ul>
                    { calendarList.others.map( renderCalendarListItem ) }
	          			</ul>
	          		</div>
	          	</div>
	          </div>
	          <JoinButton
	            isStaff={isStaff}
	            onClickJoin={onClickJoin}
	            onClickLeave={onClickLeave}
	            joinMsg={messages.join}
	            joinedMsg={messages.joined}
	            leaveMsg={messages.leave}
	          />
	          <div className='dropdown-container'>
		          <a href='#' className='icon'><img src={ iconCog } /></a>
		          <div className='dropdown dropdown-left hidden'>
		          	<ul>
		          		<li><a href='#'>Leave calendar</a></li>
		          		<li className='dropdown-separator'><a href='#'>General settings</a></li>
		          		<li><a href='#'>Create a calendar</a></li>
		          		<li><a href='#'>Edit this calendar</a></li>
		          		<li className='dropdown-separator dropdown-highlight'><a href='#'>Delete this calendar</a></li>
		          	</ul>
		          </div>
		         </div>
	      	</div>

          <div className='rbc-toolbar-navigate'>
	          <span className='rbc-btn-group'>
	            <button
	              type='button'
	              onClick={this.navigate.bind(null, navigate.TODAY)}
	            >
	              {messages.today}
	            </button>
	          </span>
	          <span className='rbc-btn-group'>
	            <button
	              type='button'
	              className='button-img'
	              onClick={this.navigate.bind(null, navigate.PREVIOUS)}
	            >
	              <img src={ chevronLeft } />
	            </button>
	            <button
	              type='button'
	              className='button-img'
	              onClick={this.navigate.bind(null, navigate.NEXT)}
	            >
	              <img src={ chevronRight } />
	            </button>
	          </span>

	          <span className='rbc-btn-group'>
	            {
	              viewNames.map(name =>
	                <button type='button' key={name}
	                  className={cn({'rbc-active': view === name})}
	                  onClick={this.view.bind(null, name)}
	                >
	                  {messages[name]}
	                </button>
	              )
	            }
	          </span>
	      	</div>
        </div>
      </div>
    );
  },

  navigate(action){
    this.props.onNavigate(action)
  },

  view(view){
    this.props.onViewChange(view)
  },

  _onClickCalendarList( event ) {
    this.setState( {
      showCalendarList: ! this.state.showCalendarList,
    } )
  }
});

export default Toolbar;
