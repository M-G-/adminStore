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
    allItemsPaging: {
      current: 1,
      pageSize: 10,
      total: 10,
    },
    allItemsSelectedRowKeys: [],
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

    *addToStore({ payload }, { call }) {
      const response = yield call(addToStore, payload);
      if (response.status) {
        message.success('成功加入到店铺');
      }
    },

    *getAllItems({ payload }, { call, put, select }) {
      yield put({
        type: 'changeAllItemsLoading',
        payload: true,
      });
      const paging = yield select(state => state.items.allItemsPaging);

      const params = { per_pagesize: paging.pageSize, page: paging.current, ...payload };

      const response = yield call(getAllItems, params);
      if (response.status) {
        cachePlayload = params;
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
        yield put({
          type: 'handleChangeSelectedRowKeys',
          payload: { key: 'allItemsSelectedRowKeys', value: [] },
        });
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
    *changeSelectedRowKeys({ payload }, { put }) {
      yield put({
        type: 'handleChangeSelectedRowKeys',
        payload,
      });
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
    handleChangeSelectedRowKeys(state, { payload }) {
      return {
        ...state,
        [payload.key]: payload.value,
      };
    },
  },
};
