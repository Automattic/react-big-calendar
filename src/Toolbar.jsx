import React from 'react';
import cn from 'classnames';
import message from './utils/messages';
import { navigate } from './utils/constants';

const renderCalendarListItem = ( itemData ) => {
  return (
      <option key={ itemData.value } value={ itemData.value }> { itemData.name } </option>
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

  render() {
    let {
        messages, label
      , views: viewNames, view
      , isStaff
      , calendarList, onCalendarChange, onClickJoin
      , onClickLeave } = this.props;

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
          	{
	            ( 0 != calendarList.length ) &&
	              <select className='rbc-toolbar-calendar-list' onChange={onCalendarChange}>
	                { calendarList.map( renderCalendarListItem ) }
	              </select>
	          }
	          <div className='select-container'>
	          	<a href='#'>LiveChat</a>
	          	<div className='select hidden'>
	          		<div className='select-calendar-search'>
	          			<input type='text' placeholder='Search' />
	          		</div>
	          		<div className='select-calendar-type'>
	          			<h5>Your calendars</h5>
	          			<ul>
	          				<li><a href='#'>LiveChat</a></li>
	          				<li><a href='#'>LiveChat UTC+</a></li>
	          			</ul>
	          		</div>
	          		<div className='select-calendar-type'>
	          			<h5>Other</h5>
	          			<ul>
	          				<li><a href='#'>Other calendar</a></li>
	          				<li><a href='#'>One more</a></li>
	          				<li><a href='#'>Lipsum</a></li>
	          				<li><a href='#'>Another one</a></li>
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
		          <a href='#'>menu</a>
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
	              onClick={this.navigate.bind(null, navigate.PREVIOUS)}
	            >
	              {messages.previous}
	            </button>
	            <button
	              type='button'
	              onClick={this.navigate.bind(null, navigate.NEXT)}
	            >
	              {messages.next}
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
  }
});

export default Toolbar;
