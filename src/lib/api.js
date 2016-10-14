import fetch from 'isomorphic-fetch';
import _ from 'underscore';
import { browserHistory } from 'react-router';
import { timestamp, log } from './utils';
import Oauth2Client, {
  ERR_INVALID_ACCESS_TOKEN,
  ERR_ACCESS_TOKEN_EXPIRED,
  ERR_INVALID_REFRESH_TOKEN,
} from './oauth2-client';
import { TokenError } from './token-storage';
import qs from 'qs';
import Map from 'es6-map';

export function ApiError(error) {
  this.name = 'ApiError';
  this.code = error.code;
  this.error = error.error;
  this.error_description = error.error_description;
}

export default class APIHandler {

  constructor(options) {
    this.url = options.api_url;
    this.cache = new Map();
    this.isPaused = false;
    this.stack = [];
    this.cacheExpires = 1000;
    this.requests = new Map();
    this.oauth = new Oauth2Client(options);
  }

  download(fileId, token) {
    let url = `/download/file/${fileId}/token/${token}`;
    location.href = this.url + 'api' + url;
  }

  pause() {
    log('api:pause', this.stack.length);
    this.isPaused = true;
  }

  resume() {
    log('api:resume', this.stack.length);
    _.each(this.stack, callback => {
      callback();
    });
    this.stack = [];
    this.isPaused = false;
  }

  pushRequest(callback) {
    log('api:push', this.stack.length);
    if (this.isPaused) {
      this.stack.push(callback);
    } else {
      callback();
    }
  }

  getCache(key) {
    let item = this.cache.get(key);
    if (item === undefined) {
      return undefined;
    }
    if (timestamp() > item.expires) {
      //console.log('cache timeout');
      this.cache.delete(key);
      return undefined;
    }
    //console.log('cache hits:', key);
    return item.data;
  }

  setCache(key, data, options) {
    // console.log('setting cache:', key);
    if (typeof options === 'undefined') {
      options = {};
    } else if (typeof options === 'number') {
      options = { expires: options };
    }
    options = _.defaults(options, {
      expires: this.cacheExpires
    });
    this.cache.set(key, {
      data: data,
      expires: timestamp() + this.cacheExpires
    });
  }

  buildFileData(field, file) {
    let data = new FormData();
    if (_.isArray(file)) {
      _.each(file, f => {
        data.append(field, f);
      });
    } else {
      data.append(field, file);
    }
    return data;
  }

  token(checkExpires) {
    try {
      return this.oauth.token(checkExpires);
    } catch(e) {
      return null;
    }
  }

  gotoLogin() {
    let currentUrl = window.location.href;
    if (!/\/account\/login/.test(currentUrl)) {
      browserHistory.push('/account/login');
    }
  }

  // API request
  // @param <url> the request url
  // @param <options> fetch options or HTTP method
  // @param <data> optional
  //        1. when using post/put/delete, as post data, could be javascript
  //           object(would be converted to JSON) or FormData.
  //        2. when using get, as query string parameters.
  request(url, options, data) {
    let self = this;
    if (_.isString(options)) {
      if (!_.contains(['get', 'post', 'put', 'delete'], options)) {
        throw new Error('unsupported HTTP method: ' + options);
      }
      options = {
        method: options
      };
    }
    let params = _.extend({
      headers: {
        'Accept': 'application/json',
      }
    }, options);

    if (options.method == 'get') {
      if (_.isObject(data) && !_.isEmpty(data)) {
        url += '?' + qs.stringify(data);
      }
      let cached = this.getCache(url);
      if (typeof cached !== 'undefined') {
        return Promise.resolve(_.clone(cached));
      }
      if (this.requests.has(url)) {
        //console.log('find existing request')
        return this.requests.get(url);
      }
    }
    if (_.contains(['post','put','delete'], options.method) && data) {
      if (data instanceof FormData) {
        params.body = data;
      } else {
        params.headers['Content-Type'] = 'application/json';
        params.body = JSON.stringify(data);
      }
    }
    // compose full URL: http://127.0.0.1:3000/api/route/path
    let fullUrl = this.url + 'api' + url;
    let promise = new Promise((resolve, reject) => {
      function makeRequest() {
        let res = undefined;
        let token = self.oauth.token();;

        function refreshAndTryLater() {
          log('api:info', 'token expired, refresh it and try later...');
          if (!self.isPaused) {
            self.oauth.refresh()
            .then(() => {
              self.resume();
            })
            .catch(() => {
              self.gotoLogin();
            });
          }
          self.pause();
          self.pushRequest(() => {
            log('api:info', 'token refreshed, request again!');
            makeRequest();
          });
        }

        if (token) {
          params.headers['Authorization'] = `Bearer ${token}`;
        } else {
          delete params.headers['Authorization'];
        }
        let timer = timestamp();
        fetch(fullUrl, params)
        .then(response => {
          res = response;
          return res.json();
        })
        .then(json => {
          let timeUsed = timestamp() - timer;
          let time = `[${timeUsed} ms]`;
          log('api.req', options.method.toUpperCase(), url, res.status);
          if (res.status >= 400) {
            let err = new ApiError(json);
            self.oauth.parseError(err);
            if (err.oauthError == ERR_INVALID_ACCESS_TOKEN) {
              log('oauth.error', 'invalid access_token, rediret to login page!');
              return self.gotoLogin();
            } else if (err.oauthError == ERR_ACCESS_TOKEN_EXPIRED) {
              log('oauth.info', 'access_token expired, refresh now');
              return refreshAndTryLater();
            } else if (err.oauthError == ERR_INVALID_REFRESH_TOKEN) {
              log('oauth.error', 'invalid or expired refresh_token, rediret to login page!');
              return self.gotoLogin();
            } else {
              throw err;
            }
          }
          if (options.method == 'get') {
            self.setCache(url, json);
          }
          self.requests.delete(url);
          resolve(json);
        })
        .catch(e => {
          console.error(e);
          reject(e);
        });
      }
      makeRequest();
    });

    if (options.method == 'get') {
      this.requests.set(url, promise);
    }
    return promise;
  }

  get(url, data) {
    return this.request(url, 'get', data);
  }

  post(url, data) {
    return this.request(url, 'post', data);
  }

  put(url, data) {
    return this.request(url, 'put', data);
  }

  delete(url, data) {
    return this.request(url, 'delete', data);
  }

}
