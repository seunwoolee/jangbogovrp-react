import * as actionTypes from 'src/actions';
import {avatar_URL} from "../my_config";

const initialState = {
  loggedIn: false,
  isLoading: false,
  token: '',
  user: {
    id: '',
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    code: '',
  },
};

const sessionLogin = (state, action) => {
  const {data} = action;
  return {
    ...state,
    loggedIn: true,
    token: data.token,
    user: {
      id: data.id,
      name: data.name,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      code: data.code,
    }
  };
};


const pushSave = (state, action) => {
  return {
    ...state,
    endpoint: action.data.endpoint
  }
};

const sessionLogout = (state, action) => ({
  ...state,
  token: null,
  loggedIn: false,
  user: {},
});

const isloading = (state, action) => ({
  ...state,
  isLoading: action.bool
});

const saveSignCount = (state, action) => ({
  ...state,
  todoCount: {
    ...state.todoCount,
    '미결함': action.data[0],
    '수신참조함': action.data[1],
    '상신함': action.data[2],
  },
});

const saveErpCount = (state, action) => ({
  ...state,
  todoCount: {
    ...state.todoCount,
    '채무발생': action.data[0],
    '채무정리': action.data[1],
    '채권발생': action.data[2],
    '채권정리': action.data[3],
    '일반전표': action.data[4]
  },
});

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SESSION_LOGIN:
      return sessionLogin(state, action);
    case actionTypes.SESSION_LOGOUT:
      return sessionLogout(state, action);
    case actionTypes.PUSHSAVE:
      return pushSave(state, action);
    case actionTypes.ISLOADING:
      return isloading(state, action);
    case actionTypes.TODO_COUNT_SIGN:
      return saveSignCount(state, action);
    case actionTypes.TODO_COUNT_ERP:
      return saveErpCount(state, action);
    default:
      return state;
  }
};

export default sessionReducer;
