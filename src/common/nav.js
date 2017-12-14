import dynamic from 'dva/dynamic';

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => dynamic({
  app,
  models: () => models.map(m => import(`../models/${m}.js`)),
  component,
});

// nav data
export const getNavData = app => [
  {
    component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    layout: 'BasicLayout',
    name: 'Home', // for breadcrumb
    path: '/',
    children: [
      {
        name: '基础数据',
        icon: 'dashboard',
        path: 'dashboard',
        component: dynamicWrapper(app, ['items'], () => import('../routes/Home/Dashboard')),
      },
      {
        name: '产品管理',
        icon: 'appstore-o',
        path: 'items',
        children: [
          {
            name: '搜索产品',
            path: 'search',
            component: dynamicWrapper(app, ['items'], () => import('../routes/Items/Search')),
          },
          {
            name: '所有产品',
            path: 'all',
            component: dynamicWrapper(app, ['items'], () => import('../routes/Items/All')),
          },
          {
            name: '产品集合',
            path: 'group',
            component: dynamicWrapper(app, ['items'], () => import('../routes/Items/Group')),
          },
        ],
      },
      {
        name: '网上商城',
        icon: 'shop',
        path: 'mall',
        children: [
          {
            name: '网页设置',
            path: 'options',
            component: dynamicWrapper(app, ['items'], () => import('../routes/Mall/Options')),
          },
        ],
      },
      {
        name: 'Settings',
        icon: 'setting',
        path: 'settings',
        invisible: true,
        children: [
          {
            name: 'Address',
            path: 'address',
            component: dynamicWrapper(app, ['form'], () => import('../routes/Settings/Address')),
          },
        ],
      },
    ],
  },
  {
    component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    path: '/user',
    layout: 'UserLayout',
    children: [
      {
        name: '帐户',
        icon: 'user',
        path: 'user',
        invisible: true,
        children: [
          {
            name: '登录',
            path: 'login',
            component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
          },
          {
            name: '注册',
            path: 'register',
            component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
          },
          {
            name: '注册结果',
            path: 'register-result',
            invisible: true,
            component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
          },
        ],
      },
    ],
  },
];
