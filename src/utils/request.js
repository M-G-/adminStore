import fetch from 'dva/fetch';
import { notification, message } from 'antd';
import { apiRoot } from '../common/globalConfig';
// import { routerRedux } from 'dva/router';
import { obj2Search, getConstructorName, getCookie } from '../utils/utils';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: response.statusText,
  });
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options = {}) {
  const defaultOptions = {
    // credentials: 'include',
  };
  const { showError, author, ...fetchOptions } = options;
  const newOptions = { ...defaultOptions, ...fetchOptions };
  let query = '';
  newOptions.headers = {
    Accept: 'application/json',
    ...newOptions.headers,
  };

  if (author) {
    const authorization = getCookie('_author');
    if (authorization) newOptions.headers.authorization = `Bearer ${authorization}`;
  }

  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    newOptions.headers['content-Type'] = 'application/json; charset=utf-8';
    newOptions.body = JSON.stringify(newOptions.body);
  } else {
    query = getConstructorName(newOptions.body) === 'Object'
      ? `?${obj2Search(newOptions.body)}`
      : newOptions.body || '';
  }

  return fetch(apiRoot + url + query, newOptions)
    .then(checkStatus)
    .then(response => response.json())
    .then((data) => {
      if (!data.status && showError) {
        message.error(data.errors || 'Error');
      }
      if (!data.status && data.errors === 'Unauthorized') {
        // routerRedux.push('/user/login');
        // if (window.authorization) delete window.authorization;
      }
      return data;
    })
    .catch((error) => {
      if (error.code) {
        notification.error({
          message: error.name,
          description: error.message,
        });
      }
      if ('stack' in error && 'message' in error) {
        notification.error({
          message: `请求错误: ${url}`,
          description: error.message,
        });
      }
      return error;
    });
}
