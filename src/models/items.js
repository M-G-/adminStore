import { message } from 'antd';
import { searchItems, addToStore, getAllItems, changeItems } from '../services/api';

let cachePlayload = {};

export default {
  namespace: 'items',

  state: {
    searchLoading: false,
    searchItems: [],
    searchPaging: null,
    allItemsLoading: false,
    allItems: [],
    allItemsPaging: null,
  },

  effects: {
    *searchItems({ payload }, { call, put }) {
      yield put({
        type: 'changeSearchLoading',
        payload: true,
      });
      const response = yield call(searchItems, payload);

      if (response.status) {
        yield put({
          type: 'uploadSearchItems',
          payload: response.data,
        });
      } else {
        yield put({
          type: 'changeSearchLoading',
          payload: false,
        });
      }
    },

    *addToStore({ payload }, { call, put }) {
      const response = yield call(addToStore, payload);
      if (response.status) {
        message.success('成功加入到店铺');
      }
    },

    *getAllItems({ payload }, { call, put }) {
      yield put({
        type: 'changeAllItemsLoading',
        payload: true,
      });
      const response = yield call(getAllItems, payload);
      if (response.status) {
        cachePlayload = payload;
        yield put({
          type: 'uploadAllItems',
          payload: response.data,
        });
      } else {
        yield put({
          type: 'changeAllItemsLoading',
          payload: false,
        });
      }
    },
    *changeItems({ payload }, { call, put }) {
      yield put({
        type: 'changeAllItemsLoading',
        payload: true,
      });
      const response = yield call(changeItems, payload);
      if (response.status) {
        message.success('操作成功');
        const response1 = yield call(getAllItems, cachePlayload);

        if (response1.status) {
          yield put({
            type: 'uploadAllItems',
            payload: response1.data,
          });
        } else {
          yield put({
            type: 'changeAllItemsLoading',
            payload: false,
          });
        }
      } else {
        yield put({
          type: 'changeAllItemsLoading',
          payload: false,
        });
      }
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
    changeAllItemsLoading(state, { payload }) {
      return {
        ...state,
        allItemsLoading: payload,
      };
    },
    uploadAllItems(state, { payload }) {
      if (payload) {
        const items = payload.data || [];

        return {
          ...state,
          allItems: items,
          allItemsLoading: false,
          allItemsPaging: items.length ? {
            current: payload.current_page,
            pageSize: payload.per_pagesize,
            total: payload.total,
          }
            : null,
        };
      } else {
        return {
          ...state,
          allItems: [],
          allItemsLoading: false,
          allItemsPaging: null,
        };
      }
    },
  },
};
