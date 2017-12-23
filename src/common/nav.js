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
    component: dynamicWrapper(app, ['user', 'login', 'settings'], () => import('../layouts/BasicLayout')),
    layout: 'BasicLayout',
    name: 'Home', // for breadcrumb
    path: '/',
    children: [
      {
        name: '基础数据',
        icon: 'dashboard',
        path: 'dashboard',
        component: dynamicWrapper(app, [], () => import('../routes/Home/Dashboard')),
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
            path: 'groups',
            component: dynamicWrapper(app, ['items'], () => import('../routes/Items/Group')),
          },
          {
            name: '新建集合',
            path: '/group/new',
            invisible: true,
            component: dynamicWrapper(app, ['items'], () => import('../routes/Items/GroupDetail')),
          },
          {
            name: '集合详情',
            path: '/group/:id',
            invisible: true,
            component: dynamicWrapper(app, ['items'], () => import('../routes/Items/GroupDetail')),
          },
        ],
      },
      {
        name: '网上商城',
        icon: 'shop',
        path: 'mall',
        children: [
          {
            name: '页面设置',
            path: 'pages',
            component: dynamicWrapper(app, ['mall'], () => import('../routes/Mall/Pages')),
          },
          {
            name: '添加页面',
            path: '/page/new',
            invisible: true,
            component: dynamicWrapper(app, ['mall'], () => import('../routes/Mall/PageDetail')),
          },
          {
            name: '页面详情',
            path: '/page/:id',
            invisible: true,
            component: dynamicWrapper(app, ['mall'], () => import('../routes/Mall/PageDetail')),
          },
          {
            name: '博客文章',
            path: 'blogs',
            component: dynamicWrapper(app, ['blog'], () => import('../routes/Blog/Articles')),
          },
          {
            name: '添加博客文章',
            path: 'blog/new',
            invisible: true,
            component: dynamicWrapper(app, ['blog'], () => import('../routes/Blog/ArticleDetail')),
          },
          {
            name: '博客文章详情',
            path: 'blog/:id',
            invisible: true,
            component: dynamicWrapper(app, ['blog'], () => import('../routes/Blog/ArticleDetail')),
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
