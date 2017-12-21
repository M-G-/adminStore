// import { stringify } from 'qs';
import request from '../utils/request';

/** 地址相关 **/
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

/** 商品相关 **/
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

/** 集合相关 **/
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

/** 页面相关 **/
export async function getPages(params) {
  return request('/pages', {
    body: params,
    showError: true,
    author: true,
  });
}
