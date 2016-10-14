import _ from 'underscore';
import store from 'store';
import { timestamp, time } from 'lib/utils';
import { TOKEN_EXPIRED } from './oauth2-client';

export const ID_ACCESS_TOKEN = 'access_token';
export const ID_REFRESH_TOKEN = 'refresh_token';
export const token_types = [ID_ACCESS_TOKEN, ID_REFRESH_TOKEN];
export const ACCESS_TOKEN_EXPIRES = 1800;
export const REFRESH_TOKEN_EXPIRES = 3600 * 24 * 15;

export class TokenError extends Error {
  constructor(msg) {
    super(msg);
  }
}

export default class TokenStorage {

  constructor(options) {
    const config = options.oauth;
    this.access_token_expires = config.access_token_expires || ACCESS_TOKEN_EXPIRES;
    this.refresh_token_expires = config.refresh_token_expires || REFRESH_TOKEN_EXPIRES;
  }

  expires(seconds) {
    let t = timestamp();
    t += seconds * 1000;
    //console.log('token expires in', time(t));
    return t;
  }

  isExpired(t) {
    console.log(time(), time(t));
    return timestamp() > t;
  }

  save(token) {
    store.set(ID_ACCESS_TOKEN, {
      token: token.access_token,
      expires: this.expires(this.access_token_expires || token.expires_in),
    });
    store.set(ID_REFRESH_TOKEN, {
      token: token.refresh_token,
      expires: this.expires(this.refresh_token_expires),
    });
  }

  validToken(token, checkExpires) {
    if (!token || !token.expires || !token.token) {
      return null;
    }
    if (checkExpires && this.isExpired(token.expires)) {
      throw new TokenError(TOKEN_EXPIRED);
    } else {
      return token.token;
    }
  }

  getRaw(type) {
    if (!type) {
      type = ID_ACCESS_TOKEN;
    }
    if (!_.contains(token_types, type)) {
      throw new Error('invalid token type: ' + type);
    }
    return store.get(type);
  }

  get(type, checkExpires) {
    if (!type) {
      type = ID_ACCESS_TOKEN;
    }
    if (!_.contains(token_types, type)) {
      throw new Error('invalid token type: ' + type);
    }
    let token = store.get(type);
    return this.validToken(token, checkExpires);
  }

  isTokenExpired(type) {
    let token = this.getRaw(type);
    if (!token || !token.expires) {
      return true;
    }
    return this.isExpired(token.expires);
  }

  remove(type) {
    if (!_.contains(token_types, type)) {
      throw new Error('invalid token type: ' + type);
    }
    store.remove(type);
  }

}
