import React, {useCallback} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Counter from "./Counter";
import {increment, decrement} from "../../actions";

const CounterContainer = () => {
  const counter = useSelector((state) => state.counter, []);
  const dispatch = useDispatch();
  const onIncrement = useCallback(
    () => dispatch(increment()),
    [dispatch]
  );
  const onDecrement = useCallback(
    () => dispatch(decrement()),
    [dispatch]
  );
  return (
    <Counter number={counter} onIncrease={onIncrement} onDecrease={onDecrement} />
  );
};

export default CounterContainer;
