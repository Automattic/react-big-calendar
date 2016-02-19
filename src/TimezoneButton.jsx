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
      timezoneCheckStatus,
      availableTimezones,
    } = this.props;

    const {
      showDialog,
    } = this.state;

    return (
      <div className="timezone-select">
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
      </div>
    );
  }

  _renderDialog() {
    const {
      timezoneCheckStatus,
      availableTimezones,
      onCheckTimezone,
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
          timezoneCheckStatus = { timezoneCheckStatus }
          availableTimezones = { availableTimezones }
          onCheckTimezone = { onCheckTimezone }
        />
      </Overlay>
    );
  }
}

export default TimezoneButton;
