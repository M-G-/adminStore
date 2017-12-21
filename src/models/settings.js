import { routerRedux } from 'dva/router';
import { getAddress, updateAddress, getGeoTreeData } from '../services/api';
import { getConstructorName } from '../utils/utils';

export default {
  namespace: 'settings',

  state: {
    addressSubmitting: false,
    address: null,
    addressEditState: 0, //address!==null 可用 ，0: 展示状态不可编辑，1: 编辑状态
    geoTree: [], //国省市三级联动菜单数据
  },

  effects: {
    *getAddress(payload, { call, put }) {
      const response = yield call(getAddress);

      if (response.status && (!response.data || getConstructorName(response.data) === 'Array')) {
        yield put(routerRedux.push('/settings/address'));
      } else {
        yield put({
          type: 'handleUpdateAddress',
          payload: response,
        });
      }
    },
    *updateAddress({ payload }, { call, put }) {
      yield put({
        type: 'changeAddressSubmitting',
        payload: true,
      });
      const response = yield call(updateAddress, payload);

      if (response.status) {
        yield put({
          type: 'handleUpdateAddress',
          payload: response,
        });
      } else {
        yield put({
          type: 'changeAddressSubmitting',
          payload: false,
        });
      }
    },
    *initGeoData({ payload }, { call, put }) {
      const response = yield call(getGeoTreeData, { level: 0, id: payload[0] });
      let response1 = '';
      let response2 = '';

      if (payload[1]) {
        response1 = yield call(getGeoTreeData, { level: 1, id: payload[1] });
      }

      if (payload[2]) {
        response2 = yield call(getGeoTreeData, { level: 2, id: payload[2] });
      }

      yield put({
        type: 'handleInitGeoTree',
        payload: { tree: [response.data, response1 ? response1.data.data : '', response2 ? response2.data : ''], ids: payload },
      });
    },
    *updateGeoData({ payload }, { call, put }) {
      const level = payload.parents.length + 1;
      const { id } = payload;
      const response = yield call(getGeoTreeData, { level, id });

      yield put({
        type: 'handleUpdateGeoTree',
        payload: {
          level,
          parents: payload.parents.concat([id]),
          data: level === 1 ? response.data.data : response.data,
        },
      });
    },
    /**loadGeo({ payload }, { call, put }) {
      const { level, id } = payload;

      if(level === 0){

      }
    },*/
  },

  reducers: {
    handleUpdateAddress(state, { payload }) {
      return {
        ...state,
        address: payload.data,
        addressSubmitting: false,
      };
    },
    changeAddressSubmitting(state, { payload }) {
      return {
        ...state,
        addressSubmitting: payload,
      };
    },
    handleInitGeoTree(state, { payload }) {
      const { tree, ids } = payload;

      const formatData = (_data, isLeaf, parents) => {
        return Object.keys(_data).map(item => ({
          value: item,
          label: _data[item],
          isLeaf,
          parents,
        }));
      };

      const geoTree = formatData(tree[0], false, []);
      let countryIndex = -1;
      if (tree[1]) {
        let data = tree[1];
        let parents = `${ids[1]}`;

        for (let i = 0; i < geoTree.length; i++) {
          if (geoTree[i].value === parents) {
            geoTree[i].children = formatData(data, false, parents);
            countryIndex = i;
            break;
          }
        }

        if (tree[2] && countryIndex > 0) {
          data = tree[2];
          parents = `${ids[2]}`;
          for (let i = 0; i < geoTree[countryIndex].children.length; i++) {
            if (geoTree[countryIndex].children[i].value === parents) {
              geoTree[countryIndex].children[i].children = formatData(data, true, parents);
              break;
            }
          }
        }
      }

      return {
        ...state,
        geoTree,
      };
    },
    handleUpdateGeoTree(state, { payload }) {
      let { geoTree } = state;
      const { level, data, parents = [] } = payload;
      const formatData = (_data, isLeaf) => {
        return Object.keys(_data).map(item => ({
          value: item,
          label: data[item],
          isLeaf,
          parents,
          loading: false,
        }));
      };

      if (!level) {
        geoTree = formatData(data, false);
      } else {
        let countryIndex = -1;
        if (level >= 1) {
          for (let i = 0; i < geoTree.length; i++) {
            if (geoTree[i].value === parents[0]) {
              if (level === 1) {
                geoTree[i].children = formatData(data, false);
              }
              countryIndex = i;
              break;
            }
          }
        }
        if (level === 2) {
          for (let i = 0; i < geoTree[countryIndex].children.length; i++) {
            if (geoTree[countryIndex].children[i].value === parents[1]) {
              geoTree[countryIndex].children[i].children = formatData(data, true);
              break;
            }
          }
        }
      }

      return {
        ...state,
        geoTree,
      };
    },
    /*changeLoginStatus(state, { payload }) {
      return {
        ...state,
        status: payload.status,
        type: payload.type,
        submitting: false,
      };
    },
    changeSubmitting(state, { payload }) {
      return {
        ...state,
        submitting: payload,
      };
    },*/
  },
};
