import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Table, Input, Select, Dropdown, Button, Icon, Menu, Modal } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { className, textToggle } from '../../utils/utils';
import styles from './All.less';

const FormItem = Form.Item;
const { Option } = Select;
const { confirm } = Modal;

@connect(state => ({
  submitting: state.items.allItemsLoading,
  paging: state.items.allItemsPaging,
  allItems: state.items.allItems,
  selectedRowKeys: state.items.allItemsSelectedRowKeys,
}))
@Form.create()
export default class AllItems extends PureComponent {
  componentWillMount() {
    this.handleSubmit();
  }

  onSelectChange = (selectedRowKeys) => {
    this.props.dispatch({
      type: 'items/changeSelectedRowKeys',
      payload: { key: 'allItemsSelectedRowKeys', value: selectedRowKeys },
    });
  }

  clearSelected = ()=>{
    this.props.dispatch({
      type: 'items/changeSelectedRowKeys',
      payload: { key: 'allItemsSelectedRowKeys', value: [] },
    });
  }

  handleSubmit = (n) => {
    const { form, submitting } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err && !submitting) {
        const { paging } = this.props;
        const payload = {
          ...values,
          // page: n,
          page: n || (paging ? paging.current : 1),
        };

        this.props.dispatch({
          type: 'items/getAllItems',
          payload,
        });
      }
    });
  }

  showConfirm = (key) => {
    confirm({
      title: '确认要删除选中商品吗?',
      onOk: this.updateItemState.bind(this, key),
    });
  }

  updateItemState = (key) => {
    const { submitting, selectedRowKeys } = this.props;
    if (!submitting && selectedRowKeys.length) {
      this.props.dispatch({
        type: 'items/changeItems',
        payload: { product_id_list: selectedRowKeys, type: key },
      });
    }
  }

  activeMenu = (value) => {
    const key = value.key - 0;

    if (key === 3) {
      this.showConfirm(key);
    } else {
      this.updateItemState(key);
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { allItems, submitting, selectedRowKeys, paging } = this.props;

    const columns = [
      {
        title: '产品图片',
        dataIndex: 'spu_img',
        render: src => <img src={src} alt="" className={styles.img} />,
      },
      {
        title: '产品名称',
        dataIndex: 'product_name',
        // render: src => <img src={src} alt="" className={styles.img} />,
      },
      {
        title: '状态',
        dataIndex: 'up_and_down',
        render: state => (
          <span
            className={
              className({
                [styles.up]: state === 1,
                [styles.down]: state === -1,
              })
            }
          >
            {textToggle({
              已上架: state === 1,
              已下架: state === -1,
            })}
          </span>),
      },
      {
        title: '产品来源',
        dataIndex: 'platform_name',
        // render: src => <img src={src} alt="" className={styles.img} />,
      },
    ];

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    return (
      <PageHeaderLayout title="所有产品">
        <Card bordered={false}>
          <Form
            hideRequiredMark
            onSubmit={(e) => {
              e.preventDefault();
              this.handleSubmit();
            }}
            className={styles.from}
            layout="inline"
            style={{ marginBottom: '20px' }}
          >
            <FormItem label="过滤器：">
              {getFieldDecorator('up_and_down', {
                initialValue: 0,
                rules: [{
                  required: true, message: '请输入商品名称',
                }],
              })(
                <Select>
                  <Option value={0}>全部</Option>
                  <Option value={-1}>已下架</Option>
                  <Option value={1}>已上架</Option>
                </Select>
              )}
            </FormItem>

            <FormItem>
              {getFieldDecorator('product_name', {
                initialValue: '',
              })(
                <Input.Search
                  onSearch={() => { this.handleSubmit(); }}
                  enterButton
                />
              )}
            </FormItem>
          </Form>

          {!!allItems.length &&
            [
              <Dropdown
                overlay={
                  <Menu onClick={this.activeMenu}>
                    <Menu.Item key={2}>下架</Menu.Item>
                    <Menu.Item key={1}>上架</Menu.Item>
                    <Menu.Item key={3}>删除</Menu.Item>
                  </Menu>
              }
                key="1"
                disabled={!selectedRowKeys.length}
              >
                <Button>
                  更多操作 <Icon type="down" />
                </Button>
              </Dropdown>,
              <span
                key="2"
                style={{ display: selectedRowKeys.length ? 'inline' : 'none' }}
                className={styles.countInfo}
              >
                已选中
                <strong>{selectedRowKeys.length}</strong>
                项
                <Button
                  type="primary"
                  size="small"
                  onClick={this.clearSelected}
                >
                  清空
                </Button>
              </span>,
              <Table
                rowKey="product_id"
                columns={columns}
                dataSource={allItems}
                loading={submitting}
                rowSelection={rowSelection}
                key="3"
                style={{ marginTop: 20 }}
                pagination={{
                  ...paging,
                  onChange: (n) => {
                    this.handleSubmit(n);
                  },
                }}
              />,
            ]
          }

        </Card>
      </PageHeaderLayout>
    );
  }
}
