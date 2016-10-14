import fetch from 'isomorphic-fetch';

export default function fetch_demo() {
  let arg=arguments[1];
  if(localStorage.getItem('access_token')){
    arg.headers=Object.assign(arg.headers||{},{'Authorization':`Bearer ${localStorage.getItem('access_token')}`});
  }
  return fetch.apply(fetch,[arguments[0],arg]);
}
