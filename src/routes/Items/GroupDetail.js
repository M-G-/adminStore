import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Card, Form, Table, Input, Button, Upload, Row, Col, Icon, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './GroupDetail.less';
import { apiRoot } from '../../common/globalConfig';
import { getCookie } from '../../utils/utils';

const FormItem = Form.Item;
const { Dragger } = Upload;

@connect(state => ({
  createLoading: state.items.createGroupLoading,
  detail: state.items.groupDetail,
  detailLoading: state.items.groupDetailLoading,
  updateLoading: state.items.updateGroupLoading,
}))
@Form.create()
export default class ItemsGroup extends PureComponent {
  state = {
    id: this.props.match.params.id,
    type: this.props.match.params.id ? 1 : 0,
    coverImg: '',
  }
  componentWillMount() {
    const { type, id } = this.state;
    if (type) this.getGroupDetail(id);
  }
  getGroupDetail = (id, reset) => {
    this.props.dispatch({
      type: 'items/getGroupDetail',
      payload: id,
    }).then(() => {
      if (reset !== false) this.resetDetail();
    });
  }
  createGroup = () => {
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const payload = {
          ...values,
          file: this.state.coverImg,
          goDetail: true,
        };

        this.props.dispatch({
          type: 'items/createGroup',
          payload,
        });
      }
    });
  }
  resetDetail = () => {
    const { form, detail } = this.props;
    if (detail) {
      const { title, description } = detail;
      form.setFieldsValue({ title, description });
      this.setState({
        coverImg: detail.cover_images,
      });
    }
  }
  updateGroup = () => {
    const { form, detail } = this.props;
    const { id, coverImg } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const payload = {
          ...values,
          id,
          file: coverImg || '',
          product_id_list: detail.product_list.map(item => item.product_id),
          action: 2,
        };

        this.props.dispatch({
          type: 'items/updateGroup',
          payload,
        }).then(() => {
          this.getGroupDetail(id);
        });
      }
    });
  }
  deleteItem = (itemId) => {
    const { id } = this.state;
    this.props.dispatch({
      type: 'items/updateGroup',
      payload: {
        product_id_list: itemId,
        action: 3,
        id,
      },
    }).then(() => {
      this.getGroupDetail(id, false);
    });
  }
  render() {
    const { form, createLoading, detail, detailLoading, updateLoading } = this.props;
    const { getFieldDecorator } = form;
    const { type, coverImg } = this.state;

    const columns = [
      {
        title: '产品图片',
        dataIndex: 'spu_img',
        render: src => <img src={src} alt="" className={styles.img} />,
      },
      {
        title: '产品名称',
        dataIndex: 'product_name',
      },

      {
        title: '操作',
        className: styles.action,
        render: (data) => {
          return (
            <Button icon="delete" onClick={() => { this.deleteItem([data.product_id]); }} />
          );
        },
      },
    ];

    const actionCreate = (
      <div>
        <Button type="primary" onClick={this.createGroup} loading={createLoading}>保存</Button>
      </div>
    );

    const actionUpdate = (
      <div>
        <Button icon="rollback" onClick={this.resetDetail}>撤销</Button>
        <Button icon="save" type="primary" onClick={this.updateGroup} loading={updateLoading || detailLoading}>保存</Button>
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

    return (
      <PageHeaderLayout
        title={type ? '集合详情' : '新建集合'}
        className={styles.wrapper}
        action={type ? actionUpdate : actionCreate}
      >
        <Row gutter={16}>
          <Col {...layout.left}>
            <Card bordered={false}>
              <h3>集合细节</h3>
              <Form
                hideRequiredMark
                layout="vertical"
              >
                <FormItem label="标题">
                  {getFieldDecorator('title', {
                    initialValue: '',
                    rules: [{
                      required: true, message: '请输入集合标题',
                    }],
                  })(
                    <Input />
                  )}
                </FormItem>
                <FormItem label="描述">
                  {getFieldDecorator('description', {
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
              <h3>封面图片</h3>
              <Dragger
                action={`${apiRoot}/images/upload`}
                listType="picture-card"
                name="file"
                multiple={false}
                showUploadList={false}
                headers={{ authorization: `Bearer ${getCookie('_author')}` }}
                beforeUpload={(file) => {
                  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
                  const isLt2M = file.size / 1024 / 1024 < 2;

                  if (!isJPG || !isLt2M) {
                    message.error('请上传小于2M的jpg、gif、png格式图片');
                  }
                  return isJPG && isLt2M;
                }}
                onChange={(info) => {
                  try {
                    const cover = this.state.coverImg;
                    const { response } = info.fileList[0];
                    const res = response.data.image_url;
                    if (res && res !== cover) {
                      this.setState({ coverImg: res });
                    }
                  } catch (e) {}
                }}
              >
                {coverImg
                  ? <div className={styles.coverImg}><img src={coverImg} alt="" /></div>
                  : <div>
                      <p className="ant-upload-drag-icon">
                        <Icon type="inbox" />
                      </p>
                      <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
                    </div>

                }

              </Dragger>
            </Card>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col {...layout.left}>
            <Card bordered={false}>
              <h3>产品 <Link disabled={!type} to="/items/all/" style={{ marginLeft: 20 }}><Button disabled={!type} icon="plus" type="primary" size="small">添加产品</Button></Link></h3>
              <Table
                rowKey="product_id"
                columns={columns}
                dataSource={detail && type ? detail.product_list : null}
                size="small"
                showHeader={false}
                style={{ marginTop: 20 }}
                loading={detailLoading || updateLoading}
              />
            </Card>
          </Col>
        </Row>

      </PageHeaderLayout>
    );
  }
}
