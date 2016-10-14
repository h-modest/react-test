import {
  SET_MEMBER_LIST,
} from 'redux/constant';

const initialState = {
  userList: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
  case SET_MEMBER_LIST:
    return { ...state, userList: action.list };
  default:
    return state;
  }
}
