/* eslint-disable prefer-destructuring,no-param-reassign,no-plusplus,radix,no-mixed-operators,no-shadow,no-empty,max-len,no-console */
import moment from 'moment';

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - (day * oneDay);

    return [moment(beginTime), moment(beginTime + ((7 * oneDay) - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`), moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000)];
  }

  if (type === 'year') {
    const year = now.getFullYear();

    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
  }
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach((node) => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟'],
  ];
  let num = Math.abs(n);
  let s = '';
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(num * 10 * (10 ** index)) % 10] + item).replace(/零./, '');
  });
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
}

/**
 * 把search字符串转为对象
 * @author MG
 * @param search <string|undefined> search字符串
 * @return object search字符串转换成的对象,没有传参时返回本页面url的search的对象
 * */
export function search2Obj(search) {
  const str = search || window.location.search;
  if (typeof str !== 'string' || !str) {
    return {};
  }
  const obj = {};
  const arr = str.slice(1).split('&');

  arr.forEach((item) => {
    const a = item.split('=');
    obj[a[0]] = a[1];
  });

  return obj;
}

/**
 * 把对象转为search字符串
 * @author MG
 * @param obj <object>
 * @return string
 * */
export function obj2Search(obj) {
  const res = [];
  try {
    for (const name in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, name)) {
        res.push(`${name}=${obj[name]}`);
      }
    }
  } catch (e) {}

  return res.length ? res.join('&') : '';
}

/**
 * 获取元素相对于页面的位置
 * @author MG
 * @param ele <DOM object>
 * @return object {top:*,left:*}
 * */
export function getDomPosition(ele) {
  let left = 0;
  let top = 0;
  while (ele) {
    left += ele.offsetLeft;
    top += ele.offsetTop;
    ele = ele.offsetParent;
  }
  return { left, top };
}

/**
 * 获取任意值的构造函数名
 * @author MG
 * @param obj <任意值>
 * @return string 除[undefined]和[null]返回他本身外,其他值都返回其构造函数名(字符串)
 *
 * @example getConstructorName(null)  >>>  null
 * @example getConstructorName({})  >>>  'Object'
 * @example getConstructorName([])  >>>  'Array'
 * @example getConstructorName(new FormData)  >>>  'FormData'
 * */
export function getConstructorName(obj) {
  if (obj === 0) return 'Number';
  return obj && obj.constructor && obj.constructor.toString().match(/function\s*([^(]*)/)[1];
}

/**
 * 设置cookie
 * @author MG
 * @param name <string> 名
 * @param value <string> 值
 * @param iDay <number> 天数
 * @param domain <string> 域名
 * */
export function setCookie(name, value, iDay, domain) {
  const oDate = new Date();
  oDate.setDate(oDate.getDate() + iDay);
  document.cookie = `${name}=${value};path=/;expires=${oDate}${domain ? `;domain=${domain}` : ''}`;
}
/**
 * 获取cookie
 * @author MG
 * @param name <string> 名
 * @return string 值
 * */
export function getCookie(name) {
  const arr = document.cookie.split('; ');
  for (let i = 0; i < arr.length; i++) {
    const arr2 = arr[i].split('=');
    if (arr2[0] === name) {
      return arr2[1];
    }
  }
  return '';
}
/**
 * 删除cookie
 * @author MG
 * @param name <string> 名
 * @param domain <string> 域名
 * */
export function removeCookie(name, domain) {
  setCookie(name, '1', -1, domain);
}
/**
 * 取n到m的随机数 [n,m]
 * @author MG
 * @param n <number> 整数, m > n
 * @param m <number> 整数, m > n
 * @return number n到m之间的任意整数,包含n和m
 * */
export function random(n, m) {
  return parseInt(Math.random() * (m - n + 1) + n);
}
/**
 * 格式化价格：把字符串(或数字)转化成最多包含两位小数的数
 * @author MG
 * @param price <string|number> 要被格式化的数
 * @param zeroPadding <boolean> 小数部分是否补零，补零后返回的是字符串
 * @param min <number> 最小数
 * @param max <number> 最大数
 * @return NaN|number|string
 * **/
export function formatPrice(price, zeroPadding, min, max) {
  let src = parseFloat(price);
  if (isNaN(src)) return src;
  if ((min || min === 0) && src < min) src = min;
  if ((max || max === 0) && src > max) src = max;
  src = Math.round(src * 100) / 100;
  if (zeroPadding) {
    src = parseInt(src) === src ? `${src}.00` : (`${src}00`).match(/^\d*\.\d{2}/)[0];
  }
  return src;
}
/**
 * 拷贝json数据
 * @author MG
 * @param obj <object|array>
 * @return obj <object|array>
 * */
export function copyJson(obj) {
  const name = getConstructorName(obj);
  if (name === 'Object' || name === 'Array') {
    return JSON.parse(JSON.stringify(obj));
  } else {
    console.warn('copyJson函数的参数不是对象或数组');
    return null;
  }
}
/**
 * 把时间戳转换为时间对象
 * @author MG
 * @param n <number> 时间戳，精确到毫秒的时间数字
 * @return obj <date,time>
 * **/
export function formatTime(n) {
  let obj = {
    date: '',
    time: '',
    dateTime: '',
  };

  const zeroPadding = n => (n - 0 >= 10 ? n : `0${n}`);

  try {
    const D = new Date(n);

    const hours = zeroPadding(D.getHours());
    const minutes = zeroPadding(D.getMinutes());
    const seconds = zeroPadding(D.getSeconds());
    const year = D.getFullYear();
    const month = zeroPadding(D.getMonth() + 1);
    const day = zeroPadding(D.getDate());
    const time = `${hours}:${minutes}:${seconds}`;
    const date = `${year}-${month}-${day}`;

    obj = {
      date,
      time,
      dateTime: `${date} ${time}`,
    };
  } catch (err) {}

  return obj;
}

/**
 * 类名格式化()
 * @author MG
 * @param data Object
 * @return String
 * **/
export function className(data) {
  return getConstructorName(data) === 'Object' ? Object.keys(data).filter(item => data[item]).join(' ') : '';
}

/**
 * 文案格式化
 * @author MG
 * @param data Object
 * @return String
 * **/
export function textToggle(data) {
  return getConstructorName(data) === 'Object' ? Object.keys(data).filter(item => data[item]).join(' ') : '';
}
