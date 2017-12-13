import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form, Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip, Row, Col,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Address.less';

const FormItem = Form.Item;
const { Option, OptGroup } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

/* @connect(state => ({
  submitting: state.form.regularFormSubmitting,
})) */
@Form.create()
export default class BasicForms extends PureComponent {
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

    const fromCol = {
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
    };

    return (
      <PageHeaderLayout title="Address" content="Add an address so you can get paid">
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            className={styles.from}
            layout="vertical"
          >
            <Row gutter={24}>
              <Col {...fromCol.col1}>
                <FormItem label="First Name">
                  {getFieldDecorator('firstName', {
                    rules: [{
                      required: true, message: '请输入',
                    }],
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col {...fromCol.col2}>
                <FormItem label="Last Name">
                  {getFieldDecorator('lastName', {
                    rules: [{
                      required: true, message: '请输入',
                    }],
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col {...fromCol.col3}>
                <FormItem label="Street Address">
                  {getFieldDecorator('streetAddress', {
                    rules: [{
                      required: true, message: '请输入',
                    }],
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col {...fromCol.col3}>
                <FormItem label="Apt, suit, etc.(optional)">
                  {getFieldDecorator('apt', {
                    rules: [{
                      required: true, message: '请输入',
                    }],
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col {...fromCol.col1}>
                <FormItem label="City">
                  {getFieldDecorator('city', {
                    rules: [{
                      required: true, message: '请输入',
                    }],
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col {...fromCol.col2}>
                <FormItem label="ZIP/Postal Code">
                  {getFieldDecorator('zip', {
                    rules: [{
                      required: true, message: '请输入',
                    }],
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col {...fromCol.col1}>
                <FormItem label="Country">
                  {getFieldDecorator('country', {
                    rules: [{
                      required: true, message: '请输入',
                    }],
                  })(
                    <Select>
                      <OptGroup label="A">
                        <Option value="a1">a1</Option>
                        <Option value="a2">a2</Option>
                      </OptGroup>
                      <OptGroup label="b">
                        <Option value="b1">b1</Option>
                      </OptGroup>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col {...fromCol.col1}>
                <FormItem label="Phone Number">
                  {getFieldDecorator('phone', {
                    rules: [{
                      required: true, message: '请输入',
                    }],
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col {...fromCol.col2}>
                <FormItem label="Business or personal website(optional)">
                  {getFieldDecorator('website', {
                    rules: [{
                      required: true, message: '请输入',
                    }],
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col {...fromCol.col1}>
                <FormItem label="">
                  <Button type="primary" htmlType="submit" loading={submitting}>
                    Submit
                  </Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
