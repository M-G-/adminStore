import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import styles from './Dashboard.less';

@connect(state => ({
  // submitting: state.form.regularFormSubmitting,
}))
export default class Dashboard extends PureComponent {
  render() {
    return (
      <PageHeaderLayout title="基础数据">
        <Card bordered={false}>
          基础数据
        </Card>
      </PageHeaderLayout>
    );
  }
}
