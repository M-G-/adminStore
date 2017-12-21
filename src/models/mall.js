import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { copyJson } from '../utils/utils';
import { getPages, getPageDetail, createPage, updatePage, updatePagesState } from '../services/api';


/*let cachePayload = {};
let cachePayloadGetGroups = {};*/
let cacheGetPages = {};

export default {
  namespace: 'mall',

  state: {

    /** 页面列表 **/
    pagesLoading: false,
    updatePagesStateLoading: false,
    pages: [],
    pagesPaging: {
      current: 1,
      pageSize: 10,
      total: 10,
    },
    pagesSelectedRowKeys: [],

    /** 页面详情，新建页面 **/
    createPageLoading: false,
    pageDetailLoading: false,
    pageDetail: null,
    updatePageLoading: false,

  },

  effects: {
    *getPages({ payload }, { call, put, select }) {
      yield put({
        type: 'changeLoading',
        payload: {
          key: 'pagesLoading',
          value: true,
        },
      });
      const paging = yield select(state => state.mall.pagesPaging);

      const params = { per_pagesize: paging.pageSize, page: paging.current, ...payload };

      const response = yield call(getPages, params);
      if (response.status) {
        cacheGetPages = params;
        yield put({
          type: 'updateAllPages',
          payload: response.data,
        });
      } else {
        yield put({
          type: 'changeLoading',
          payload: {
            key: 'pagesLoading',
            value: false,
          },
        });
      }
    },
    *updatePagesState({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: {
          key: 'updatePagesStateLoading',
          value: true,
        },
      });
      const response = yield call(updatePagesState, payload);
      if (response.status) {
        message.success('操作成功');
        yield put({
          type: 'handleChangeSelectedRowKeys',
          payload: { key: 'pagesSelectedRowKeys', value: [] },
        });
      }
      yield put({
        type: 'changeLoading',
        payload: {
          key: 'updatePagesStateLoading',
          value: false,
        },
      });
    },
    *createPage({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: {
          key: 'createPageLoading',
          value: true,
        },
      });
      const { goDetail, ...params } = payload;
      const response = yield call(createPage, params);
      if (response.status) {
        message.success('创建成功');
        if (goDetail) yield put(routerRedux.push(`/mall/page/${response.data.page_id}`));
      }
      yield put({
        type: 'changeLoading',
        payload: {
          key: 'createPageLoading',
          value: false,
        },
      });
    },
    *getPageDetail({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: {
          key: 'pageDetailLoading',
          value: true,
        },
      });
      const response = yield call(getPageDetail, payload);
      if (response.status) {
        yield put({
          type: 'updatePageDetail',
          payload: response.data,
        });
      }
      yield put({
        type: 'changeLoading',
        payload: {
          key: 'pageDetailLoading',
          value: false,
        },
      });
    },
    *updatePage({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: {
          key: 'updatePageLoading',
          value: true,
        },
      });
      const response = yield call(updatePage, payload);
      if (response.status) {
        message.success('操作成功');
      }
      yield put({
        type: 'changeLoading',
        payload: {
          key: 'updatePageLoading',
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
    updateAllPages(state, { payload }) {
      if (payload) {
        const pages = payload.data || [];
        return {
          ...state,
          pages: pages,
          pagesLoading: false,
          pagesPaging:
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
    updatePageDetail(state, { payload }) {
      return {
        ...state,
        pageDetail: payload,
        pageDetailLoading: false,
      };
    },
  },
};
