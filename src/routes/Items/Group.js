import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import styles from './Group.less';

@connect(state => ({
  // submitting: state.form.regularFormSubmitting,
}))
export default class ItemsGroup extends PureComponent {
  render() {
    return (
      <PageHeaderLayout title="产品集合">
        <Card bordered={false}>
          产品集合
        </Card>
      </PageHeaderLayout>
    );
  }
}
