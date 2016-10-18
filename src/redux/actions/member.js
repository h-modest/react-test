import {
  SET_MEMBER_LIST,
} from 'redux/constant';

export function setUserList(userList) {
  return {
    type: SET_MEMBER_LIST,
    iuserList,
  };
}

//拉取用户列表
export function loadUserListRemote() {
  return (dispatch) => {
    return API.get('/member/list')
    .then( userList => dispatch(setUserInfo(userList)));
  };
}
