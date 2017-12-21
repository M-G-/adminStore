import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { copyJson } from '../utils/utils';
import { getPages } from '../services/api';


/*let cachePayload = {};
let cachePayloadGetGroups = {};*/
let cacheGetAllPages = {};

export default {
  namespace: 'mall',

  state: {
    allPagesLoading: false,
    allPagesUpdateLoading: false,
    allPages: [],
    allPagesPaging: {
      current: 1,
      pageSize: 10,
      total: 10,
    },
    allPagesSelectedRowKeys: [],

  },

  effects: {
    *getAllPages({ payload }, { call, put, select }) {
      yield put({
        type: 'changeLoading',
        payload: {
          key: 'allPagesLoading',
          value: true,
        },
      });
      const paging = yield select(state => state.mall.allPagesPaging);

      const params = { per_pagesize: paging.pageSize, page: paging.current, ...payload };

      const response = yield call(getPages, params);
      if (response.status) {
        cacheGetAllPages = params;
        yield put({
          type: 'updateAllPages',
          payload: response.data,
        });
      } else {
        yield put({
          type: 'changeLoading',
          payload: {
            key: 'allPagesLoading',
            value: false,
          },
        });
      }
    },
  },

  reducers: {
    changeLoading(state, { payload }) {
      return {
        ...state,
        [payload.key]: payload.value,
      };
    },
    changeSelectedRowKeys(state, { payload }) {
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
          allPages: pages,
          allPagesLoading: false,
          allPagesPaging:
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
  },
};
