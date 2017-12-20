// import { stringify } from 'qs';
import request from '../utils/request';

export async function searchItems(params) {
  return request('/products/search', {
    body: params,
    showError: true,
    author: true,
  });
}

export async function addToStore(params) {
  return request('/products/push_store', {
    method: 'POST',
    body: params,
    showError: true,
    author: true,
  });
}

export async function getAddress() {
  return request('/business/address', {
    showError: true,
    author: true,
  });
}

export async function updateAddress(params) {
  return request('/business/address', {
    method: 'POST',
    body: params,
    showError: true,
    author: true,
  });
}

export async function getGeoTreeData({ level, id }) {
  const api = ['country', 'state', 'city'];
  const param = ['', 'country_id', 'state_id'];
  const body = level ? { [`${param[level]}`]: id } : {};
  return request(`/geo/${api[level]}`, {
    body,
    showError: true,
    author: true,
  });
}

export async function getAllItems(params) {
  return request('/products/index', {
    body: params,
    showError: true,
    author: true,
  });
}

export async function changeItems(params) {
  return request('/products/action', {
    method: 'POST',
    body: params,
    showError: true,
    author: true,
  });
}

export async function getGroups(params) {
  return request('/collections', {
    body: params,
    showError: true,
    author: true,
  });
}

export async function createGroup(params) {
  return request('/collections', {
    method: 'POST',
    body: params,
    showError: true,
    author: true,
  });
}

export async function changeGroups(params) {
  return request('/collections/action', {
    method: 'POST',
    body: params,
    showError: true,
    author: true,
  });
}

export async function getGroupDetail(id) {
  return request(`/collections/${id}`, {
    showError: true,
    author: true,
  });
}

export async function updateGroup(params) {
  const { id, ...rest } = params;
  return request(`/collections/${id}`, {
    method: 'POST',
    body: rest,
    showError: true,
    author: true,
  });
}

/** Old Code ⬇️ **/
/*

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}
*/
