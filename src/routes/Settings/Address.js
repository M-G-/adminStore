/* eslint-disable camelcase */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form, Input, Button, Card, InputNumber, Row, Col, Cascader,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Address.less';

const FormItem = Form.Item;

@connect(state => ({
  submitting: state.settings.addressSubmitting,
  address: state.settings.address,
  editState: state.settings.addressEditState,
  geo: state.settings.geoTree,
}))
@Form.create()
export default class BasicForms extends PureComponent {
  componentDidMount() {
    const { address, form } = this.props;

    if (address) {
      const { country_id, state_id, city_id, ...rest } = address;
      form.setFieldsValue({ ...rest, geo: [`${country_id}`, `${state_id}`, `${city_id}`] });
    }

    this.props.dispatch({
      type: 'settings/initGeoData',
      payload: address ? ['', address.country_id, address.state_id] : [],
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { geo, ...rest } = values;
        this.props.dispatch({
          type: 'settings/updateAddress',
          payload: { ...rest, country_id: geo[0], state_id: geo[1], city_id: geo[2] },
        });
      }
    });
  }
  loadTree = (data) => {
    const target = data[data.length - 1];
    const id = target.value;
    const { parents } = target;
    this.props.dispatch({
      type: 'settings/updateGeoData',
      payload: { parents, id },
    });
  }

  render() {
    const { submitting, geo } = this.props;
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
                  {getFieldDecorator('first_name', {
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
                  {getFieldDecorator('last_name', {
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
                  {getFieldDecorator('street_address', {
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
                  {getFieldDecorator('suite', {
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
                <FormItem label="国家／省份／城市">
                  {getFieldDecorator('geo')(
                    <Cascader
                      options={geo}
                      loadData={this.loadTree}
                      onChange={this.changeTree}
                      changeOnSelect
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col {...fromCol.col3}>
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
                <FormItem label="Phone Number">
                  {getFieldDecorator('phone_number', {
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
