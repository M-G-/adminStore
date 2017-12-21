import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Card, Form, Table, Input, Select, Dropdown, Button, Icon, Menu, Modal, Divider } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import { className, textToggle } from '../../utils/utils';
import styles from './Group.less';
const { confirm } = Modal;

@connect(state => ({
  submitting: state.items.groupsLoading,
  groups: state.items.groups,
  paging: state.items.groupsPaging,
}))
@Form.create()
export default class ItemsGroup extends PureComponent {
  componentWillMount() {
    this.handleSubmit();
  }
  handleSubmit = (n) => {
    const { submitting, paging } = this.props;
    if (!submitting) {
      const payload = {
        page: n || paging.current || 1,
      };

      this.props.dispatch({
        type: 'items/getGroups',
        payload,
      });
    }
  }
  changeGroups = (type, groups) => {
    this.props.dispatch({
      type: 'items/changeGroups',
      payload: { type, collection_id_list: groups },
    });
  }
  handleDeleteGroup = (ids) => {
    this.changeGroups(3, ids);
  }
  showConfirm = (id) => {
    confirm({
      title: '确认要删除商品集合?',
      onOk: () => { this.handleDeleteGroup([id]); },
    });
  }
  render() {
    const { groups, submitting, paging } = this.props;
    const columns = [
      {
        title: '封面',
        dataIndex: 'cover_images',
        render: src => <img src={src} alt="" className={styles.img} />,
      },
      {
        title: '标题',
        dataIndex: 'title',
      },
      {
        title: '产品数量',
        dataIndex: 'products_count',
      },
      {
        title: '操作',
        className: styles.action,
        render: (data) => {
          return (
            <div>
              <Button.Group size="small">
                <Button type="primary"><Link to={`/items/group/${data.collection_id}`}><Icon type="edit" /> 编辑</Link></Button>
                <Button icon="delete" onClick={this.showConfirm.bind(this, data.collection_id)} type="primary" ghost />
              </Button.Group>

            </div>
          );
        },
      },
    ];
    return (
      <PageHeaderLayout title="产品集合">
        <Card bordered={false}>
          <div>
            <Link to="/items/group/new">
              <Button type="primary" icon="plus" >新建集合</Button>
            </Link>
          </div>
          <Table
            rowKey="collection_id"
            columns={columns}
            dataSource={groups}
            loading={submitting}
            // rowSelection={rowSelection}
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
