import { message } from 'antd';
import { routerRedux } from 'dva/router';
import {
  getBlogs,
  createBlogs,
  getBlogsDetail,
  updateBlogs,
  updateBlogsState,

  getArticles,
  createArticle,
  getArticleDetail,
  updateArticle,
  updateArticlesState,
} from '../services/api';

export default {
  namespace: 'blog',

  state: {

    /** 博客分类 **/
    blogsLoading: false,
    updateBlogsStateLoading: false,
    blogs: [],
    blogsPaging: {
      current: 1,
      pageSize: 100,
      total: 100,
    },
    blogsSelectedRowKeys: [],
    createBlogsLoading: false,

    /** 文章列表 **/
    articlesLoading: false,
    updateArticlesStateLoading: false,
    articles: [],
    articlesPaging: {
      current: 1,
      pageSize: 10,
      total: 10,
    },
    articlesSelectedRowKeys: [],

    /** 文章详情 **/
    createArticleLoading: false,
    articleDetailLoading: false,
    articleDetail: null,
    updateArticleLoading: false,

  },

  effects: {

    /** 博客分类 **/
    *getBlogs({ payload }, { call, put, select }) {
      yield put({
        type: 'changeLoading',
        payload: {
          key: 'blogsLoading',
          value: true,
        },
      });
      const paging = yield select(state => state.blog.blogsPaging);

      const params = { per_pagesize: paging.pageSize, page: paging.current, ...payload };

      const response = yield call(getBlogs, params);
      if (response.status) {
        yield put({
          type: 'updateAllBlogs',
          payload: response.data,
        });
      } else {
        yield put({
          type: 'changeLoading',
          payload: {
            key: 'blogsLoading',
            value: false,
          },
        });
      }
    },
    *createBlogs({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: {
          key: 'createBlogsLoading',
          value: true,
        },
      });
      const { goDetail, ...params } = payload;
      const response = yield call(createBlogs, params);
      if (response.status) {
        message.success('创建成功');
        // if (goDetail) yield put(routerRedux.push(`/mall/blog/${response.data.article_id}`));
      }
      yield put({
        type: 'changeLoading',
        payload: {
          key: 'createBlogsLoading',
          value: false,
        },
      });
    },

    /** 文章 **/
    *getArticles({ payload }, { call, put, select }) {
      yield put({
        type: 'changeLoading',
        payload: {
          key: 'ArticlesLoading',
          value: true,
        },
      });
      const paging = yield select(state => state.blog.articlesPaging);

      const params = { per_pagesize: paging.pageSize, page: paging.current, ...payload };

      const response = yield call(getArticles, params);
      if (response.status) {
        yield put({
          type: 'updateAllArticles',
          payload: response.data,
        });
      } else {
        yield put({
          type: 'changeLoading',
          payload: {
            key: 'articlesLoading',
            value: false,
          },
        });
      }
    },
    *updateArticlesState({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: {
          key: 'updateArticlesStateLoading',
          value: true,
        },
      });
      const response = yield call(updateArticlesState, payload);
      if (response.status) {
        message.success('操作成功');
        yield put({
          type: 'handleChangeSelectedRowKeys',
          payload: { key: 'articlesSelectedRowKeys', value: [] },
        });
      }
      yield put({
        type: 'changeLoading',
        payload: {
          key: 'updateArticlesStateLoading',
          value: false,
        },
      });
    },
    *createArticle({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: {
          key: 'createArticleLoading',
          value: true,
        },
      });
      const { goDetail, ...params } = payload;
      const response = yield call(createArticle, params);
      if (response.status) {
        message.success('创建成功');
        if (goDetail) yield put(routerRedux.push(`/mall/blog/${response.data.article_id}`));
      }
      yield put({
        type: 'changeLoading',
        payload: {
          key: 'createArticleLoading',
          value: false,
        },
      });
    },
    *getArticleDetail({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: {
          key: 'articleDetailLoading',
          value: true,
        },
      });
      const response = yield call(getArticleDetail, payload);
      if (response.status) {
        yield put({
          type: 'updateArticleDetail',
          payload: response.data,
        });
      }
      yield put({
        type: 'changeLoading',
        payload: {
          key: 'articleDetailLoading',
          value: false,
        },
      });
    },
    *updateArticle({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: {
          key: 'updateArticleLoading',
          value: true,
        },
      });
      const response = yield call(updateArticle, payload);
      if (response.status) {
        message.success('操作成功');
      }
      yield put({
        type: 'changeLoading',
        payload: {
          key: 'updateArticleLoading',
          value: false,
        },
      });
    },
    *changeSelectedRowKeys({ payload }, { put }) {
      yield put({
        type: 'handleChangeSelectedRowKeys',
        payload: {
          key: payload.key,
          value: payload.value,
        },
      });
    },
  },

  reducers: {
    changeLoading(state, { payload }) {
      return {
        ...state,
        [payload.key]: payload.value,
      };
    },
    handleChangeSelectedRowKeys(state, { payload }) {
      return {
        ...state,
        [payload.key]: payload.value,
      };
    },
    updateAllArticles(state, { payload }) {
      if (payload) {
        const articles = payload.data || [];
        return {
          ...state,
          articles,
          articlesLoading: false,
          articlesPaging:
            payload.current_page
              ? {
                current: payload.current_page,
                pageSize: payload.per_pagesize,
                total: payload.total,
              }
              : {
                current: 1,
                pageSize: 10,
                total: 10,
              },
        };
      }
    },
    updateArticleDetail(state, { payload }) {
      return {
        ...state,
        articleDetail: payload,
        articleDetailLoading: false,
      };
    },
  },
};
