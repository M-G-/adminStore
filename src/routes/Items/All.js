/* eslint-disable no-param-reassign,no-empty,react/no-multi-comp,max-len */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
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
  groupsLoading: state.items.groupsLoading,
  groupsPaging: state.items.groupsPaging,
  groups: state.items.groups,
}))
@Form.create()
export default class AllItems extends PureComponent {
  state = {
    showModal: false,
    currentId: [],
  }
  componentWillMount() {
    this.handleSubmit();
  }

  onSelectChange = (selectedRowKeys) => {
    this.props.dispatch({
      type: 'items/changeSelectedRowKeys',
      payload: { key: 'allItemsSelectedRowKeys', value: selectedRowKeys },
    });
  }

  clearSelected = () => {
    this.props.dispatch({
      type: 'items/changeSelectedRowKeys',
      payload: { key: 'allItemsSelectedRowKeys', value: [] },
    });
  }

  handleSubmit = (n, up) => {
    const { form, submitting, paging } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err && !submitting) {
        if (up !== undefined) values.up_and_down = up;
        const payload = {
          ...values,
          page: n || paging.current || 1,
        };

        this.props.dispatch({
          type: 'items/getAllItems',
          payload,
        });
      }
    });
  }

  showConfirm = (key, ids) => {
    confirm({
      title: '确认要删除选中商品吗?',
      onOk: () => { this.updateItemState(key, ids); },
    });
  }

  updateItemState = (key, ids) => {
    const { submitting } = this.props;
    if (!submitting && ids.length) {
      this.props.dispatch({
        type: 'items/changeItems',
        payload: { product_id_list: ids, type: key },
      });
    }
  }

  activeMenu = (value, ids) => {
    const key = value.key - 0;

    if (key === 3) {
      this.showConfirm(key, ids);
    } else if (key === 4) {
      this.showModal(ids);
    } else {
      this.updateItemState(key, ids);
    }
  }

  showModal = (id) => {
    this.setState({
      showModal: true,
      currentId: id,
    });
    this.updateGroups();
  }

  updateGroups = (n) => {
    const { groupsPaging } = this.props;
    const payload = {
      page: n || groupsPaging.current || 1,
    };

    if (!groupsPaging || !groupsPaging.length) {
      this.props.dispatch({
        type: 'items/getGroups',
        payload,
      });
    }
  }
  add2Group = (id) => {
    this.props.dispatch({
      type: 'items/updateGroup',
      payload: { id, product_id_list: this.state.currentId, action: 1 },
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { allItems, submitting, selectedRowKeys, paging, groups, groupsLoading, groupsPaging } = this.props;
    const { showModal, currentId } = this.state;

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
      {
        title: '操作',
        className: styles.action,
        render: (data) => {
          const id = [data.product_id];
          return (
            <Button.Group size="small">
              <Button onClick={this.showModal.bind(this, id)} type="primary" icon="download">
                加入集合
              </Button>
              {data.up_and_down === -1 &&
              <Button onClick={() => { this.activeMenu({ key: 1 }, id); }} icon="check-circle-o">
                上架
              </Button>
              }
              {data.up_and_down === 1 &&
              <Button onClick={() => { this.activeMenu({ key: 2 }, id); }} icon="minus-circle-o" >
                下架
              </Button>
              }
              <Button onClick={() => { this.activeMenu({ key: 3 }, id); }} icon="delete" />
            </Button.Group>
          );
        },
      },
    ];

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    const modalColumns = [
      {
        title: '标题',
        dataIndex: 'title',
      },
      {
        className: styles.alignRight,
        render: data => (
          <div>
            <Link to={`/items/group/${data.collection_id}`}>
              <Icon type="edit" style={{ color: '#999' }} />
            </Link>
            <Button
              type="primary"
              size="small"
              icon="download"
              style={{ marginLeft: 15 }}
              onClick={() => {
                this.add2Group(data.collection_id);
              }}
            />
          </div>
        ),
      },

    ];

    return (
      <PageHeaderLayout title="所有产品">
        <Card bordered={false}>
          <Form
            hideRequiredMark
            onSubmit={(e) => {
              e.preventDefault();
              this.handleSubmit();
            }}
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
                <Select
                  onChange={(data) => { this.handleSubmit(1, data); }}
                >
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
                  <Menu onClick={(data) => { this.activeMenu(data, selectedRowKeys); }}>
                    <Menu.Item key={4}><Icon type="download" /> 加入集合</Menu.Item>
                    <Menu.Item key={1}><Icon type="check-circle-o" /> 上架</Menu.Item>
                    <Menu.Item key={2}><Icon type="minus-circle-o" /> 下架</Menu.Item>
                    <Menu.Item key={3}><Icon type="delete" /> 删除</Menu.Item>
                  </Menu>
              }
                key="1"
                disabled={!selectedRowKeys.length}
              >
                <Button>
                  批量操作 <Icon type="down" />
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
                  icon="rollback"
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
        <Modal
          visible={showModal}
          title="加入集合"
          loading={groupsLoading}
          footer={null}
          onCancel={() => {
            this.setState({
              showModal: false,
            });
          }}
        >
          <CreateGroup />
          <p>共{currentId.length}个商品，可加入以下集合</p>
          <Table
            rowKey="collection_id"
            columns={modalColumns}
            dataSource={groups}
            loading={groupsLoading}
            showHeader={false}
            size="small"
            pagination={{
              ...groupsPaging,
              onChange: (n) => {
                this.updateGroups(n);
              },
            }}
          />
        </Modal>
      </PageHeaderLayout>
    );
  }
}


@connect(state => ({
  loading: state.items.createGroupLoading,
}))
class CreateGroup extends PureComponent {
  createGroup = (data) => {
    const a = this.props.dispatch({
      type: 'items/createGroup',
      payload: { title: data },
    });
    a.then(() => {
      this.props.dispatch({
        type: 'items/getGroups',
        payload: { page: 1 },
      });

      try {
        this.input.input.input.value = '';
      } catch (e) {}
    });
  }
  render() {
    const { loading } = this.props;

    return (
      <div
        style={{ height: '46px' }}
      >
        <Input.Search
          placeholder="请输入集合标题"
          enterButton="新建集合"
          onSearch={(data) => {
            if (data) this.createGroup(data);
          }}
          loading={`${loading}`}
          ref={(c) => { this.input = c; }}
        />
      </div>
    );
  }
}
