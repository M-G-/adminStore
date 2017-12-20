import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Table, Input, Select, Dropdown, Button, Icon, Menu, Modal, Spin } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import { className, textToggle } from '../../utils/utils';
import styles from './GroupDetail.less';
const FormItem = Form.Item;
@connect(state => ({
  createLoading: state.items.createGroupLoading,
  detail: state.items.groupDetail,
  detailLoading: state.items.groupDetailLoading,
  // groups: state.items.groups,
  // paging: state.items.groupsPaging,
}))
@Form.create()
export default class ItemsGroup extends PureComponent {
  state = {
    id: this.props.match.params.id,
    type: this.props.match.params.id ? 1 : 0,
  }
  componentWillMount() {
    // this.handleSubmit();
    // console.log(this.state.type);
    const { type, id } = this.state;
    if (type) this.getGroupDetail(id);
  }
  getGroupDetail = (id) => {
    this.props.dispatch({
      type: 'items/getGroupDetail',
      payload: id,
    });
  }
  createGroup = () => {
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const payload = {
          ...values,
          goDetail: true,
        };

        this.props.dispatch({
          type: 'items/createGroup',
          payload,
        });
      }
    });
  }
  render() {
    const { form, createLoading, detail, detailLoading } = this.props;
    const { getFieldDecorator } = form;
    const { type } = this.state;

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
        render: (data) => {
          return (
            <a>删除</a>
          );
        },
      },
    ];

    return (
      <PageHeaderLayout title={type ? '集合详情' : '创建集合'} className={styles.wrapper}>
        <Card bordered={false}>
          {type
            ? !detailLoading && detail
              ? <div>
                <p>集合标题:{detail.title}</p>
                {/*<p>集合商品:{JSON.stringify(detail.product_list)}</p>*/}
                <Table
                  rowKey="product_id"
                  columns={columns}
                  dataSource={detail.product_list}
                />
                </div>
              : <Spin />
            : <Form
              hideRequiredMark
              /*onSubmit={(e) => {
                e.preventDefault();
                this.handleSubmit();
              }}*/
              // className={styles.from}
              layout="inline"
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
              <Button type="primary" onClick={this.createGroup} loading={createLoading}>创建</Button>
            </Form>
          }

        </Card>
      </PageHeaderLayout>
    );
  }
}
