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

export async function createPage(params) {
  return request('/pages', {
    method: 'POST',
    body: params,
    showError: true,
    author: true,
  });
}

export async function getPageDetail(id) {
  return request(`/pages/${id}`, {
    showError: true,
    author: true,
  });
}

export async function updatePage(params) {
  const { id, ...rest } = params;
  return request(`/pages/${id}`, {
    method: 'POST',
    body: rest,
    showError: true,
    author: true,
  });
}

export async function updatePagesState(params) {
  return request('/pages/action', {
    method: 'POST',
    body: params,
    showError: true,
    author: true,
  });
}

/** 博客相关 **/
export async function getBlogs(params) {
  return request('/blogs', {
    body: params,
    showError: true,
    author: true,
  });
}

export async function createBlogs(params) {
  return request('/blogs', {
    method: 'POST',
    body: params,
    showError: true,
    author: true,
  });
}

export async function getBlogsDetail(id) {
  return request(`/blogs/${id}`, {
    showError: true,
    author: true,
  });
}

export async function updateBlogs(params) {
  const { id, ...rest } = params;
  return request(`/blogs/${id}`, {
    method: 'POST',
    body: rest,
    showError: true,
    author: true,
  });
}

export async function updateBlogsState(params) {
  return request('/blogs/action', {
    method: 'POST',
    body: params,
    showError: true,
    author: true,
  });
}

export async function getArticles(params) {
  return request('/article', {
    body: params,
    showError: true,
    author: true,
  });
}

export async function createArticle(params) {
  return request('/article', {
    method: 'POST',
    body: params,
    showError: true,
    author: true,
  });
}

export async function getArticleDetail(id) {
  return request(`/article/${id}`, {
    showError: true,
    author: true,
  });
}

export async function updateArticle(params) {
  const { id, ...rest } = params;
  return request(`/article/${id}`, {
    method: 'POST',
    body: rest,
    showError: true,
    author: true,
  });
}

export async function updateArticlesState(params) {
  return request('/article/action', {
    method: 'POST',
    body: params,
    showError: true,
    author: true,
  });
}


