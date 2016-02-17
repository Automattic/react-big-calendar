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
    <div className='rbc-event-filter-menu-content dropdown dropdown-right'
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
      showMenu: false,
    };
  }

  render() {
    const { showMenu, filterType } = this.state;
    const text = typeToText( filterType );

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
      onPickFilterYou,
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
          onClickYou = { ( event ) => {
            onPickFilterYou && onPickFilterYou();

            this.setState( {
              filterType: FilterType.You,
            } )

            dismiss();
          } }
          onClickAvailable = { ( event ) => {
            onPickFilterAvailable && onPickFilterAvailable();

            this.setState( {
              filterType: FilterType.Available,
            } )

            dismiss();
          } }
          onClickAll = { ( event ) => {
            onPickFilterAll && onPickFilterAll();

            this.setState( {
              filterType: FilterType.All,
            } )

            dismiss();
          } }
        />
      </Overlay>
    );
  }
};

export default EventFilterMenu;
