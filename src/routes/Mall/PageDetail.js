import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Card, Form, Table, Input, Button, Row, Col, Icon, message, Radio } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './PageDetail.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

@connect(state => ({
  createLoading: state.mall.createPageLoading,
  detail: state.mall.pageDetail,
  detailLoading: state.mall.pageDetailLoading,
  updateLoading: state.mall.updatePageLoading,
}))
@Form.create()
export default class ItemsGroup extends PureComponent {
  state = {
    id: this.props.match.params.id,
    type: this.props.match.params.id ? 1 : 0,
    visible: this.props.match.params.id ? 0 : 1,
  }
  componentWillMount() {
    const { type, id } = this.state;
    if (type) this.getPageDetail(id);
  }
  getPageDetail = (id, reset) => {
    this.props.dispatch({
      type: 'mall/getPageDetail',
      payload: id,
    }).then(() => {
      if (reset !== false) this.resetDetail();
    });
  }
  createPage = () => {
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const payload = {
          ...values,
          up_and_down: this.state.visible,
          template: 'page',
          goDetail: true,
        };

        this.props.dispatch({
          type: 'mall/createPage',
          payload,
        });
      }
    });
  }
  resetDetail = () => {
    const { form, detail } = this.props;
    if (detail) {
      const { title, content } = detail;
      form.setFieldsValue({ title, content });
      this.setState({
        visible: detail.up_and_down,
      });
    }
  }
  updatePage = () => {
    const { form } = this.props;
    const { id, visible } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const payload = {
          ...values,
          id,
          up_and_down: visible,
        };

        this.props.dispatch({
          type: 'mall/updatePage',
          payload,
        }).then(() => {
          this.getPageDetail(id);
        });
      }
    });
  }

  render() {
    const { form, createLoading, detail, detailLoading, updateLoading } = this.props;
    const { getFieldDecorator } = form;
    const { type, visible } = this.state;

    const actionCreate = (
      <div>
        <Button type="primary" onClick={this.createPage} loading={createLoading}>保存</Button>
      </div>
    );

    const actionUpdate = (
      <div>
        <Button icon="rollback" onClick={this.resetDetail}>撤销</Button>
        <Button icon="save" type="primary" onClick={this.updatePage} loading={updateLoading || detailLoading}>保存</Button>
      </div>
    );

    const layout = {
      left: {
        // xs: { span: 18 },
        sm: { span: 16 },
        lg: { span: 18 },
      },
      right: {
        // xs: { span: 6 },
        sm: { span: 8 },
        lg: { span: 6 },
      },
    };

    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };

    return (
      <PageHeaderLayout
        title={type ? '页面详情' : '添加页面'}
        className={styles.wrapper}
        action={type ? actionUpdate : actionCreate}
      >
        <Row gutter={16}>
          <Col {...layout.left}>
            <Card bordered={false}>
              <h3>页面细节</h3>
              <Form
                hideRequiredMark
                layout="vertical"
              >
                <FormItem label="标题">
                  {getFieldDecorator('title', {
                    initialValue: '',
                    rules: [{
                      required: true, message: '请输入页面标题',
                    }],
                  })(
                    <Input />
                  )}
                </FormItem>
                <FormItem label="描述">
                  {getFieldDecorator('content', {
                    initialValue: '',
                  })(
                    <Input.TextArea />
                  )}
                </FormItem>
              </Form>
            </Card>
          </Col>

          <Col {...layout.right}>
            <Card bordered={false}>
              <h3>能见度</h3>
              <RadioGroup
                onChange={(e) => {
                this.setState({ visible: e.target.value });
              }}
                value={visible}
              >
                <Radio style={radioStyle} value={1}>可见</Radio>
                <Radio style={radioStyle} value={2}>隐藏</Radio>
              </RadioGroup>
            </Card>
          </Col>
        </Row>

      </PageHeaderLayout>
    );
  }
}
