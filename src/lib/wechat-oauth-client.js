import Oauth2Client from './oauth2-client.js';
import fetch from 'isomorphic-fetch';
import qs from 'qs';
import store from 'store';
import config from 'config';

export default class WechatOAuthClient extends Oauth2Client {

  authorise(authCode) {
    let data = {
      grant_type: 'authorization_code',
      client_id: this.options.wechat_oauth.client_id,
      client_secret: this.options.wechat_oauth.client_secret,
      code: authCode
    };
    return this.request(data)
    .then(res => {
      if (res.status >= 300) {
        return res.json().then(json => {
          throw new ApiError(json);
        });
      }
      return res.json();
    })
    .then(json => {
      this.save(json);
    });
  }

  request(data) {
    let params = {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: qs.stringify(data),
    };
    let url = `${this.options.api_url}wechat-oauth/token`;
    return fetch(url, params);
  }

  static isWechatBroswer() {
    let inProduction = location.host == config.production_domain;
    return inProduction && /MicroMessenger/i.test(window.navigator.userAgent);
  }

  static getAuthCode() {
    let uriInfo = qs.parse(location.search.substr(1));
    let { wechat_authcode } = uriInfo;
    return wechat_authcode;
  }

  static getRandomToken() {
    let uriInfo = qs.parse(location.search.substr(1));
    let random_token = uriInfo.random_token || store.get('wechat_random_token');
    return random_token;
  }

  static storeRandomToken(random_token) {
    return store.set('wechat_random_token', random_token);
  }

}
