import React, { Component } from 'react';
import Overlay from 'react-overlays/lib/Overlay';

import EventFilterMode from './EventFilterMode';

const FilterText = {
  [ EventFilterMode.CurrentUserOnly ]: 'Show you',
  [ EventFilterMode.Available ]: 'Show available',
  [ EventFilterMode.All ]: 'Show all',
};

const typeToText = ( type ) => {
  return FilterText[ type ];
};

const FilterMenu = ( props ) => {
  const {
    onClickCurrentUserOnly,
    onClickAvailable,
    onClickAll,
  } = props;
  const itemClassName = 'rbc-event-filter-menu-item';

  return (
    <div className='rbc-event-filter-menu-content dropdown dropdown-right'
      style={ {
        position: 'absolute',
        zIndex: 999,
      } }
    >
    <ul>
      <li><a href='#' className={itemClassName} onClick={onClickCurrentUserOnly}> { typeToText( EventFilterMode.CurrentUserOnly ) } </a></li>
      <li><a href='#' className={itemClassName} onClick={onClickAvailable}> { typeToText( EventFilterMode.Available ) } </a></li>
      <li><a href='#' className={itemClassName} onClick={onClickAll}> { typeToText( EventFilterMode.All ) } </a></li>
    </ul>
    </div>
  );
};

class EventFilterMenu extends Component {
  constructor( props ) {
    super( props );

    this.state = {
      showMenu: false,
    };
  }

  render() {
    const { eventFilterMode } = this.props;
    const { showMenu } = this.state;
    const text = typeToText( eventFilterMode );

    return (
      <div className='rbc-event-filter-menu dropdown-container dropdown-arrow'>
        <a
          href='#'
          onClick={ ( event ) => {
            const toggled = ! showMenu;
            this.setState( {
              showMenu: toggled,
            } );
          } }
        >
        { text }
        </a>
        { showMenu && this._renderMenu() }
      </div>
    );
  }

  _renderMenu() {
    const { showMenu } = this.state;
    const {
      onPickFilterCurrentUserOnly,
      onPickFilterAvailable,
      onPickFilterAll,
    } = this.props;

    const dismiss = () => {
      this.setState( {
        showMenu: false,
      } );
    };

    return (
      <Overlay
        rootClose
        placement='bottom'
        container={ this }
        show={ showMenu }
        onHide={ () => {} }
      >
        <FilterMenu
          onClickCurrentUserOnly = { ( event ) => {
            onPickFilterCurrentUserOnly && onPickFilterCurrentUserOnly();

            this.setState( {
              eventFilterMode: EventFilterMode.CurrentUserOnly,
            } )

            dismiss();
          } }
          onClickAvailable = { ( event ) => {
            onPickFilterAvailable && onPickFilterAvailable();

            this.setState( {
              eventFilterMode: EventFilterMode.Available,
            } )

            dismiss();
          } }
          onClickAll = { ( event ) => {
            onPickFilterAll && onPickFilterAll();

            this.setState( {
              eventFilterMode: EventFilterMode.All,
            } )

            dismiss();
          } }
        />
      </Overlay>
    );
  }
};

export default EventFilterMenu;
