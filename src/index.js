import 'babel-polyfill';
import dva from 'dva';
import 'moment/locale/en-gb';
// import './g2';
// import './rollbar';
// import browserHistory from 'history/createBrowserHistory';
import './index.less';
import router from './router';

// 1. Initialize
const app = dva({
  // history: browserHistory(),
  // onStateChange: (state) => {
  //   console.log('-----stateChange');
  //   console.log(state);
  // },
  // onAction: (state) => {
  //   console.log('-----action');
  //   console.log(state);
  // },
  // onReducer: (state) => {
  //   console.log('-----reducer');
  //   console.log(state);
  // },
  // onEffect: (state) => {
  //   console.log('-----effect');
  //   console.log(state);
  // },
  onError: (e) => {
    console.log('=-=-=-=-=-=-=-');
    console.log(e);
  },
});

// 2. Plugins
// app.use({});

// 3. Register global model
app.model(require('./models/global'));

// 4. Router
app.router(router);

// 5. Start
app.start('#root');
