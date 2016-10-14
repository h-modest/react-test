import _ from 'underscore';
import Promise from 'bluebird';
import fetch from 'isomorphic-fetch';
import qs from 'qs';

import { timestamp, log } from './utils';

import TokenStorage, { ID_ACCESS_TOKEN, ID_REFRESH_TOKEN } from './token-storage';
import { ApiError } from './api';

export const INVALID_TOKEN_ERROR = 'invalid_token';
export const INVALID_GRANT_ERROR = 'invalid_grant';
export const INVALID_REQUEST_ERROR = 'invalid_request';

export const regRefresh = /refresh/i;
export const regInvalid = /invalid/i;
export const regExpired = /expired/i;
export const regNotFound = /token was not found/i;

export const ERR_INVALID_ACCESS_TOKEN = 'ERR_INVALID_ACCESS_TOKEN';
export const ERR_ACCESS_TOKEN_EXPIRED = 'ERR_ACCESS_TOKEN_EXPIRED';
export const ERR_INVALID_REFRESH_TOKEN = 'ERR_INVALID_REFRESH_TOKEN';

export default class Oauth2Client {

  constructor(options) {
    this.options = options;
    this.store = new TokenStorage(options);
    this.refresh_timer = null;
    this.init();
  }

  init() {
    let token = this.store.getRaw();
    if (token) {
      if (this.store.isExpired(token.expires)) {
        this.refresh();
      } else {
        this.autoRefresh(token.expires);
      }
    }
  }

  token(checkExpires) {
    return this.store.get(ID_ACCESS_TOKEN, checkExpires);
  }

  autoRefresh(t) {
    let timeout;
    if (t) {
      timeout = t - timestamp();
    } else {
      timeout = this.store.access_token_expires * 1000;
    }
    timeout -= 10000;
    if (timeout < 0) {
      throw new Error('autoRefresh(): timeout error');
    }
    log('oauth', 'token will be refreshed in', timeout/1000, 's');
    clearTimeout(this.refresh_timer);
    this.refresh_timer = setTimeout(() => {
      log('oauth', 'auto refreshing token!');
      this.refresh();
    }, timeout);
  }

  save(data) {
    log('oauth', 'got new token:', data.access_token);
    this.autoRefresh();
    this.store.save(data);
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
    let url = `${this.options.api_url}oauth/token`;
    return fetch(url, params);
  }

  authorise(id, password) {
    let data = {
      grant_type: 'password',
      client_id: this.options.oauth.client_id,
      client_secret: this.options.oauth.client_secret,
      username: id,
      password: password,
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

  refresh() {
    let refreshToken = this.store.get(ID_REFRESH_TOKEN);
    if (!refreshToken) {
      return Promise.reject(new Error('refresh_token not exists'));
    }
    let data = {
      grant_type: ID_REFRESH_TOKEN,
      client_id: this.options.oauth.client_id,
      client_secret: this.options.oauth.client_secret,
      refresh_token: refreshToken,
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

  revoke() {
    return Promise.all([
      this._revoke(ID_ACCESS_TOKEN),
      this._revoke(ID_REFRESH_TOKEN),
    ]);
  }

  _revoke(type) {
    let token = this.store.get(type);
    if (!token) {
      return true;
    }
    let data = {
      token: token,
      token_type_hint: type,
    };
    let params = {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: qs.stringify(data),
    };
    let url = `${this.options.api_url}oauth/revoke`;
    return fetch(url, params)
    .then(res => {
      if (res.status >= 300) {
        return res.json().then(json => {
          throw new ApiError(json);
        });
      }
      this.store.remove(type);
      return true;
    });
  }

  parseError(err) {
    if (!(err instanceof ApiError)) {
      return err;
    }
    let desc = err.error_description;
    if (!_.isString(desc)) {
      return err;
    }
    desc = desc.toLowerCase();
    if (err.error == INVALID_TOKEN_ERROR) {
      if (regInvalid.test(desc)) {
        err.oauthError = ERR_INVALID_ACCESS_TOKEN;
      } else if (regExpired.test(desc)) {
        err.oauthError = ERR_ACCESS_TOKEN_EXPIRED;
      }
    } else if (err.error == INVALID_REQUEST_ERROR && regNotFound.test(desc)) {
      err.oauthError = ERR_INVALID_ACCESS_TOKEN;
    } else if (err.error == INVALID_GRANT_ERROR && regRefresh.test(desc)) {
      err.oauthError = ERR_INVALID_REFRESH_TOKEN;
    }
    return err;
  }

}
