import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import styles from './All.less';

@connect(state => ({
  // submitting: state.form.regularFormSubmitting,
}))
export default class AllItems extends PureComponent {
  render() {
    return (
      <PageHeaderLayout title="所有产品">
        <Card bordered={false}>
          所有产品
        </Card>
      </PageHeaderLayout>
    );
  }
}
