import React, { Component } from 'react';
import Overlay from 'react-overlays/lib/Overlay';

import TimezoneDialog from './TimezoneDialog';

class TimezoneButton extends Component {
  constructor( props ) {
    super( props );

    this.state = {
      showDialog: false,
    }
  }

  render() {
    const {
      timezoneName,
      checkedTimezones,
      availableTimezones,
    } = this.props;

    const {
      showDialog,
    } = this.state;

    return (
      <span>
        <a href='#'
          onClick = { ( e ) => {
            const toggled = ! showDialog;
            this.setState( {
              showDialog: toggled,
            } );

            e.preventDefault();
            e.stopPropagation();
          } }
        > { timezoneName }
        </a>
        { showDialog && this._renderDialog() }
      </span>
    );
  }

  _renderDialog() {
    const {
      checkedTimezones,
      availableTimezones,
    } = this.props;

    const {
      showDialog,
    } = this.state;

    return (
      <Overlay
        rootClose
        placement='bottom'
        container={ this }
        show={ showDialog }
        onHide={ () => this.setState( { showDialog: false } ) }
      >
        <TimezoneDialog
          checkedTimezones = { checkedTimezones }
          availableTimezones = { availableTimezones }
        />
      </Overlay>
    );
  }
}

export default TimezoneButton;
