import React, { Component } from 'react';
import Overlay from 'react-overlays/lib/Overlay';

const FilterType = {
  You: 0,
  Available: 1,
  All: 2,
};

const FilterText = {
  [ FilterType.You ]: 'Show you',
  [ FilterType.Available ]: 'Show available',
  [ FilterType.All ]: 'Show all',
};

const typeToText = ( type ) => {
  return FilterText[ type ];
};

const FilterMenu = ( props ) => {
  const {
    onClickYou,
    onClickAvailable,
    onClickAll,
  } = props;
  const itemClassName = 'rbc-event-filter-menu-item';

  return (
    <div className='rbc-event-filter-menu-content'
      style={ {
        position: 'absolute',
        zIndex: 999,
      } }
    >
    <ul>
      <li><a href='#' className={itemClassName} onClick={onClickYou}> { typeToText( FilterType.You ) } </a></li>
      <li><a href='#' className={itemClassName} onClick={onClickAvailable}> { typeToText( FilterType.Available ) } </a></li>
      <li><a href='#' className={itemClassName} onClick={onClickAll}> { typeToText( FilterType.All ) } </a></li>
    </ul>
    </div>
  );
};

class EventFilterMenu extends Component {
  constructor( props ) {
    super( props );

    this.state = {
      filterType: FilterType.You,
    };
  }

  render() {
    const { showMenu, filterType } = this.state;
    const text = typeToText( filterType );

    return (
      <div className='rbc-event-filter-menu'>
        <a
          href='#'
          onClick={ ( event ) => {
            this.setState( {
              showMenu: {}
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
      onPickFilterYou,
      onPickFilterAvailable,
      onPickFilterAll,
    } = this.props;

    return (
      <Overlay
        rootClose
        placement='bottom'
        container={ this }
        show={ null != showMenu }
        onHide={ () => this.setState( { showMenu: null } ) }
      >
        <FilterMenu
          onClickYou = { ( event ) => {
            onPickFilterYou && onPickFilterYou();

            this.setState( {
              filterType: FilterType.You,
            } )
          } }
          onClickAvailable = { ( event ) => {
            onPickFilterAvailable && onPickFilterAvailable();

            this.setState( {
              filterType: FilterType.Available,
            } )
          } }
          onClickAll = { ( event ) => {
            onPickFilterAll && onPickFilterAll();

            this.setState( {
              filterType: FilterType.All,
            } )
          } }
        />
      </Overlay>
    );
  }
};

export default EventFilterMenu;
