/* eslint-disable no-param-reassign,no-empty,react/no-multi-comp,max-len */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Card, Form, Table, Input, Select, Dropdown, Button, Icon, Menu, Modal } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { className, textToggle } from '../../utils/utils';
import styles from './Pages.less';

const FormItem = Form.Item;
const { Option } = Select;
const { confirm } = Modal;

@connect(state => ({
  pagesLoading: state.mall.allPagesLoading,
  updateLoading: state.mall.pageUpdateLoading,
  pages: state.mall.allPages,
  paging: state.mall.allPagesPaging,
  selectedRowKeys: state.mall.allPagesSelectedRowKeys,

}))
@Form.create()
export default class Options extends PureComponent {
  componentWillMount() {
    this.updateAllPages();
  }

  onSelectChange = (selectedRowKeys) => {
    /*this.props.dispatch({
      type: 'mall/changeSelectedRowKeys',
      payload: { key: 'allItemsSelectedRowKeys', value: selectedRowKeys },
    });*/
  }

  clearSelected = () => {
    /*this.props.dispatch({
      type: 'items/changeSelectedRowKeys',
      payload: { key: 'allItemsSelectedRowKeys', value: [] },
    });*/
  }

  updateAllPages = (n) => {
    const { paging } = this.props;
    const payload = {
      page: n || paging.current || 1,
    };

    this.props.dispatch({
      type: 'mall/getAllPages',
      payload,
    });
  }

  showConfirm = (key, ids) => {
    confirm({
      title: '确认要删除选中页面吗?',
      onOk: () => { this.updateItemState(key, ids); },
    });
  }

  updatePageState = (key, ids) => {
    /*const { submitting } = this.props;
    if (!submitting && ids.length) {
      this.props.dispatch({
        type: 'items/changeItems',
        payload: { product_id_list: ids, type: key },
      });
    }*/
  }

  activeMenu = (value, ids) => {
    /*const key = value.key - 0;

    if (key === 3) {
      this.showConfirm(key, ids);
    } else if (key === 4) {
      this.showModal(ids);
    } else {
      this.updateItemState(key, ids);
    }*/
  }

  updatePages = (n) => {
    /*const { groupsPaging } = this.props;
    const payload = {
      page: n || groupsPaging.current || 1,
    };

    if (!groupsPaging || !groupsPaging.length) {
      this.props.dispatch({
        type: 'items/getGroups',
        payload,
      });
    }*/
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { pagesLoading, updateLoading, pages, paging, selectedRowKeys } = this.props;

    const columns = [
      {
        title: '标题',
        dataIndex: 'title',
      },
      {
        title: '内容',
        dataIndex: 'content',
      },
      {
        title: '状态',
        dataIndex: 'up_and_down',
        render: state => (
          <span
            className={
              className({
                [styles.up]: state === 1,
                [styles.down]: state === 2,
              })
            }
          >
            {textToggle({
              已发布: state === 1,
              已隐藏: state === 2,
            })}
          </span>),
      },
      {
        title: '修改时间',
        dataIndex: 'updated_at',
      },
      {
        title: '操作',
        className: styles.action,
        render: (data) => {
          const id = [data.page_id];
          return (
            <Button.Group size="small">
              {data.up_and_down === 2 &&
              <Button onClick={() => { this.activeMenu({ key: 1 }, id); }} icon="check-circle-o">
                发布
              </Button>
              }
              {data.up_and_down === 1 &&
              <Button onClick={() => { this.activeMenu({ key: 2 }, id); }} icon="minus-circle-o" >
                隐藏
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

    return (
      <PageHeaderLayout title="页面设置">
        <Card bordered={false}>
          <Link to="/mall/page/new" style={{ marginRight: 10 }}>
            <Button type="primary" icon="plus" >新建集合</Button>
          </Link>
          <Dropdown
            overlay={
              <Menu onClick={(data) => { this.activeMenu(data, selectedRowKeys); }}>
                <Menu.Item key={1}><Icon type="check-circle-o" /> 发布</Menu.Item>
                <Menu.Item key={2}><Icon type="minus-circle-o" /> 隐藏</Menu.Item>
                <Menu.Item key={3}><Icon type="delete" /> 删除</Menu.Item>
              </Menu>
            }
            disabled={!selectedRowKeys.length}
          >
            <Button>
              批量操作 <Icon type="down" />
            </Button>
          </Dropdown>
          <span
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
          </span>
          <Table
            rowKey="product_id"
            columns={columns}
            dataSource={pages}
            loading={pagesLoading}
            rowSelection={rowSelection}
            style={{ marginTop: 20 }}
            pagination={{
              ...paging,
              onChange: (n) => {
                this.handleSubmit(n);
              },
            }}
          />,

        </Card>
      </PageHeaderLayout>
    );
  }
}
