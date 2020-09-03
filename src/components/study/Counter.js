import React from 'react';

// eslint-disable-next-line react/prop-types
const Counter = ({ onIncrease, onDecrease, number }) => {

  return (
    <div>
      <h1>{number}</h1>
      <div>
        {/* eslint-disable-next-line react/button-has-type */}
        <button onClick={onIncrease}>+1</button>
        <button onClick={onDecrease}>-1</button>
      </div>
    </div>
  );
};

export default Counter;
