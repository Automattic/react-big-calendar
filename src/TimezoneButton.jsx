import React, { Component } from 'react';

class TimezoneButton extends Component {
  constructor( props ) {
    super( props );
  }

  render() {
    const {
      timezoneName,
    } = this.props;

    return (
      <a href='#'> { timezoneName } </a>
    );
  }
}

export default TimezoneButton;
