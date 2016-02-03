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
  const itemClassName = 'rbc-event-filter-menu-item';

  return (
    <div className='rbc-event-filter-menu-content'>
     <button className={itemClassName}>{ typeToText( FilterType.You ) }</button>
     <button className={itemClassName}>{ typeToText( FilterType.Available ) }</button>
     <button className={itemClassName}>{ typeToText( FilterType.All ) }</button>
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

    return (
      <Overlay
        rootClose
        placement='bottom'
        container={ this }
        show={ null != showMenu }
        onHide={ () => this.setState( { showMenu: null } ) }
      >
        <FilterMenu />
      </Overlay>
    );
  }
};

export default EventFilterMenu;
