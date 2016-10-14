import _ from 'underscore';
import moment from 'moment';

export function filterList(list, filter, filter_key) {
  return _.filter(list, item => {
    if (!filter) {
      return true;
    }
    for (let key in item) {
      if (filter_key.indexOf(key) >= 0){
        let value = item[key];
        if (typeof value === 'string') {
          if (value.indexOf(filter) >= 0) {
            return true;
          }
        }
      };
    }
    return false;
  });
}

// from coding.net script ^_^
export function readableDate(date) {
  if (!date) return {};

  let today = () => moment().startOf('day');
  let tomorrow = today().add(1,'days');
  let the_day_after_tomorrow = today().add(2, 'days');
  let yesterday = today().subtract(1,'days');
  let the_day_before_yesterday = today().subtract(2,'days');
  let year = moment(date).year();
  let today_year = moment(today()).year();
  let same_year = year === today_year;
  let data = {};
  let d_date;

  moment.locale('zh-cn');
  if (today().isAfter(date) && same_year) {
    d_date = moment(date).format('MMMDo');
    if (yesterday.isSame(date)) {
      d_date = '昨天';
    } else if (the_day_before_yesterday.isSame(date)) {
      d_date = '前天';
    } else {
      let week = moment(date).week();
      let today_week = today().week();
      if (week === today_week) {
        d_date = moment(date).format('dddd');
      } else if (week + 1 === today_week) {
        d_date = '上周' + moment.weekdaysMin(moment(date));
      }
    }
    data = { date: d_date, clazz:'expired'};
  } else if (today().isSame(date) && same_year) {
    data = { date: '今天', clazz: 'today'};
  } else if (tomorrow.isSame(date) && same_year) {
    data = { date: '明天', clazz: 'tomorrow'};
  } else if (the_day_after_tomorrow.isSame(date) && same_year) {
    data = { date: '后天', clazz: 'default'};
  } else {
    let week = moment(date).week();
    let today_week = today().week();
    if (week === today_week && same_year) {
      d_date = moment(date).format('dddd');
    } else if (week - 1 === today_week && same_year) {
      d_date = '下周' + moment.weekdaysMin(moment(date));
    } else {
      let format = today_year === year ? 'MMMDo' : 'YYYY年MMMDo';
      d_date = moment(date).format(format);
    }
    data = { date: d_date, clazz: year < today_year ? 'expired' : 'default'};
  }
  return data;
}

export function dateFormat(date, type='short'){
  let format;
  switch (type) {
  case 'time':
    format = 'HH:mm:ss';
    break;
  case 'short':
    format = 'YYYY-MM-DD';
    break;
  case 'long':
  case 'full':
    format = 'YYYY-MM-DD HH:mm:ss';
    break;
  case 'calendar':
    format = 'YYYY-MM-DD HH:mm';
    break;
  case 'human':
    let d = readableDate(date);
    return d.date || '';
  default:
    format = type;
  }
  return moment(date).format(format);
}

const reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
const reMsAjax = /^\/Date\((d|-|.*)\)[\/|\\]$/;

export function dateParser(key, value) {
  if (typeof value === 'string') {
    if (reISO.test(value)) {
      return new Date(value);
    }
    if (reMsAjax.test(value)) {
      let b = a[1].split(/[-+,.]/);
      return new Date(b[0] ? +b[0] : 0 - +b[1]);
    }
  }
  return value;
}

export function parseDate(d) {
  return dateParser(undefined, d);
}
