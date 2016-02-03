import React, { Component } from 'react';

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
    <div className='rbc-event-filter-menu'>
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
    const { filterType } = this.state;
    const text = typeToText( filterType );

    return (
      <a
        href='#'
        onClick={ () => {} }
      >
      { text }
      </a>
    );
  }
};

export default EventFilterMenu;
