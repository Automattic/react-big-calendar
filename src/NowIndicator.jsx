import React from 'react';

const NowIndicator = ( props ) => {
  const { topOffset } = props;

  return (
    <div
      className='rbc-now-indicator'
      style={ {
        width: '100%',
        height: '2px',
        backgroundColor: 'red',
        position: 'absolute',
        top: topOffset + '%',
        zIndex: 999,
      } }
    />
  );
};

export default NowIndicator;
