import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { searchItems, addToStore, getAllItems, changeItems, getGroups, createGroup, changeGroups, getGroupDetail, updateGroup } from '../services/api';


let cachePayload = {};
let cachePayloadGetGroups = {};

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
    groups: [],
    groupsLoading: false,
    groupsPaging: {
      current: 1,
      pageSize: 10,
      total: 10,
    },
    createGroupLoading: false,
    groupDetail: null,
    groupDetailLoading: false,
    updateGroupLoading: false,

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
        cachePayload = params;
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
        const response1 = yield call(getAllItems, cachePayload);

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
    *getGroups({ payload }, { call, put, select }) {
      yield put({
        type: 'changeLoading',
        payload: {
          key: 'groupsLoading',
          value: true,
        },
      });
      const paging = yield select(state => state.items.groupsPaging);
      const params = { per_pagesize: paging.pageSize, page: paging.current, ...payload };
      const response = yield call(getGroups, params);

      if (response.status) {
        cachePayloadGetGroups = params;
        // console.log(response)
        yield put({
          type: 'uploadGroups',
          payload: response.data,
        });
      } else {
        yield put({
          type: 'changeLoading',
          payload: {
            key: 'groupsLoading',
            value: false,
          },
        });
      }
    },
    *changeGroups({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: {
          key: 'groupsLoading',
          value: true,
        },
      });
      const response = yield call(changeGroups, payload);
      if (response.status) {
        message.success('操作成功');
        const response1 = yield call(getGroups, cachePayloadGetGroups);
        if (response1.status) {
          yield put({
            type: 'uploadGroups',
            payload: response1.data,
          });
        } else {
          yield put({
            type: 'changeLoading',
            payload: false,
          });
        }
      } else {
        yield put({
          type: 'changeLoading',
          payload: {
            key: 'groupsLoading',
            value: false,
          },
        });
      }
    },
    *createGroup({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: {
          key: 'createGroupLoading',
          value: true,
        },
      });
      const { goDetail, ...params } = payload;
      const response = yield call(createGroup, params);
      if (response.status) {
        message.success('创建成功');
        if (goDetail) yield put(routerRedux.push(`/items/group/${response.data.collection_id}`));
      }
      yield put({
        type: 'changeLoading',
        payload: {
          key: 'createGroupLoading',
          value: false,
        },
      });
    },
    *updateGroup({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: {
          key: 'updateGroupLoading',
          value: true,
        },
      });
      const { reload, ...params } = payload;
      const response = yield call(updateGroup, params);
      if (response.status) {
        // yield put(routerRedux.push(`/items/group/${response.data.collection_id}`));
        message.success('操作成功');
      }
      yield put({
        type: 'changeLoading',
        payload: {
          key: 'updateGroupLoading',
          value: false,
        },
      });
    },
    *getGroupDetail({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: {
          key: 'groupDetailLoading',
          value: true,
        },
      });
      const response = yield call(getGroupDetail, payload);
      if (response.status) {
        yield put({
          type: 'uploadGroupDetail',
          payload: response.data,
        });
      }
      yield put({
        type: 'changeLoading',
        payload: {
          key: 'groupDetailLoading',
          value: false,
        },
      });
    },

    *changeSelectedRowKeys({ payload }, { put }) {
      yield put({
        type: 'handleChangeSelectedRowKeys',
        payload,
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
          allItemsPaging:
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
    uploadGroups(state, { payload }) {
      if (payload) {
        const items = payload.data || [];
        return {
          ...state,
          groups: items,
          groupsLoading: false,
          groupsPaging:
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
    uploadGroupDetail(state, { payload }) {
      if (payload) {
        return {
          ...state,
          groupDetail: payload,
          groupDetailLoading: false,
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
