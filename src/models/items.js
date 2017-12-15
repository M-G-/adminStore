// import { routerRedux } from 'dva/router';
import { searchItems } from '../services/api';

export default {
  namespace: 'items',

  state: {
    searchLoading: false,
    searchItems: [],
    searchPaging: null,
  },

  effects: {
    *searchItems({ payload }, { call, put }) {
      yield put({
        type: 'changeSearchLoading',
        payload: true,
      });
      const response = yield call(searchItems, payload);
      yield put({
        type: 'uploadSearchItems',
        payload: response.data,
      });
      // Login successfully
      // if (response.status === true) {
      //   yield put(routerRedux.push('/'));
      //   window.authorization = response.data.api_token;
      // }
    },
  },

  reducers: {
    changeSearchLoading(state, { payload }) {
      return {
        ...state,
        searchLoading: payload,
      };
    },
    uploadSearchItems(state, { payload }) {
      if (payload) {
        const items = payload.datas || [];
        return {
          ...state,
          searchItems: items,
          searchLoading: false,
          searchPaging: items.length ? {
            current: payload.toPage,
            pageSize: payload.pageSize,
            total: payload.totalCount,
          }
            : null,
        };
      } else {
        return {
          ...state,
          searchItems: [],
          searchLoading: false,
          searchPaging: null,
        };
      }
    },
  },
};
