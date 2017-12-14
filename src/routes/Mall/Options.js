import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import styles from './Options.less';

@connect(state => ({
  // submitting: state.form.regularFormSubmitting,
}))
export default class Options extends PureComponent {
  render() {
    return (
      <PageHeaderLayout title="网页设置">
        <Card bordered={false}>
          网页设置
        </Card>
      </PageHeaderLayout>
    );
  }
}
