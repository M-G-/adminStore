import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form, Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip, Row, Col,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Search.less';

const FormItem = Form.Item;
const { Option, OptGroup } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(state => ({
  // submitting: state.form.regularFormSubmitting,
}))
@Form.create()
export default class SearchItems extends PureComponent {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'form/submitRegularForm',
          payload: values,
        });
      }
    });
  }
  render() {
    const { submitting } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;

    /*const fromCol = {
      col1: {
        sm: { span: 10, offset: 2 },
        md: { span: 6, offset: 6 },
        lg: { span: 5, offset: 7 },
      },
      col2: {
        sm: { span: 10 },
        md: { span: 6 },
        lg: { span: 5 },
      },
      col3: {
        sm: { span: 20, offset: 2 },
        md: { span: 12, offset: 6 },
        lg: { span: 10, offset: 7 },
      },
    };*/
    // console.log(this.props);
    return (
      <PageHeaderLayout title="搜索产品" content="">
        <Card bordered={false}>
          搜索
        </Card>
      </PageHeaderLayout>
    );
  }
}
