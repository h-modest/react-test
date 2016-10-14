import _ from 'underscore';
import moment from 'moment';

export function timestamp(t) {
  if (t) {
    return +new Date(t);
  } else {
    return +new Date();
  }
}

export function time(t) {
  if (t) {
    return new Date(t);
  } else {
    return new Date();
  }
}

export function formatValidationErrors(inspectorError) {
  return inspectorError;
}

export function dataCombine(target, source, key) {
  return _.map(target, item => {
    let id = item[key];
    let ext = _.findWhere(source, {[key]: id});
    return _.extend({}, ext, item);
  });
}

export function log(type, ...messages) {
  let t = moment();
  let time = t.format('HH:mm:ss.SSS');
  if (_.isUndefined(type)) {
    type = 'common';
  }
  let logger;
  if (/err/.test(type)) {
    logger = 'error';
  } else if (/info/.test(type)) {
    logger = 'info';
  } else {
    logger = 'log';
  }
  let params = [
    '%c[' + time + '] %c' + type + '%c',
    'color: blue',
    'color: #999',
    'color: #000',
  ];
  console[logger].apply(console, params.concat(messages));
}

log.error = (message) => {
  log('error', message);
};

log.info = (message) => {
  log('info', message);
};

log.log = (message) => {
  log('log', message);
};

export function randomId() {
  return Math.floor((timestamp() + Math.random()) * 1000) + '';
}

export function getUrl(type, object) {
  let url;
  switch(type) {
  case 'company':
    url = `/oa/company/${object._id}/desktop`;
    break;
  case 'project':
    url = `/oa/company/${object.company_id}/desktop/project/${object._id}/list`;
    break;
  case 'task':
    url = `/oa/company/${object.company_id}/desktop/project/${object.project_id}/list/task/${object._id}/detail`;
    break;
  case 'request':
    url = '/oa/user/request/all';
    break;
  case 'approval.item':
    url = `/oa/company/${object.company_id}/feature/approval/detail/${object._id}`;
    break;
  case 'announcement':
    url = `/oa/company/${object.company_id}/feature/announcement/${object.type}/${object._id}`;
    break;
  case 'schedule':
    url = `/oa/company/${object.company_id}/feature/schedule/${object._id}`;
    break;
  case 'default':
    url = null;
  }
  if (/undefined/.test(url)) {
    return null;
  }
  return url;
}

export function extname(filename) {
  let pos = filename.lastIndexOf('.');
  return filename.substring(pos + 1);
}

export function getFileIcon(filename) {
  const icons = {
    'txt': 'text',
    'zip': 'zip',
    'jpg': 'image',
    'jpeg': 'image',
    'png': 'image',
    'gif': 'image',
    'doc': 'word',
    'docx': 'word',
    'wps': 'word',
    'xls': 'excel',
    'xlsx': 'excel',
    'et': 'excel',
    'ppt': 'powerpoint',
    'pptx': 'powerpoint',
    'dps': 'powerpoint',
    'pdf': 'pdf',
  };
  let ext = extname(filename);
  let icon = icons[ext];
  let className = `fa fa-file${icon ? '-' + icon : ''}-o`;
  return className;
}

export function isDocFile(filename) {
  const docExts = 'pdf|doc|docx|xls|xlsx|ppt|pptx|wps|et|dps'.split('|');
  let ext = extname(filename);
  return _.contains(docExts, ext);
}
export function getCdnThumbnail(url, size) {
  if (!/^\d+$/.test(size)) {
    throw new Error('getCdnThumbnail: invalid thumbnail size');
  }
  let find = /\/thumbnail\/\d+/;
  let replace = `/thumbnail/${size}`;
  if (find.test(url)) {
    return url.replace(find, replace);
  } else {
    if (!/\?/.test(url)) {
      url += '?imageMogr2';
    }
    return url + replace;
  }
}
