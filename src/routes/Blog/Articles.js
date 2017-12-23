/* eslint-disable no-param-reassign,no-empty,react/no-multi-comp,max-len */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Card, Form, Table, Dropdown, Button, Icon, Menu, Modal, Row, Col } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { className, textToggle } from '../../utils/utils';
import styles from './Articles.less';

const { confirm } = Modal;

@connect(state => ({
  listLoading: state.blog.articlesLoading,
  updateStateLoading: state.blog.updateArticlesStateLoading,
  list: state.blog.articles,
  paging: state.blog.articlesPaging,
  selectedRowKeys: state.blog.articlesSelectedRowKeys,
}))
@Form.create()
export default class Options extends PureComponent {
  componentWillMount() {
    this.getList();
  }

  onSelectChange = (selectedRowKeys) => {
    this.props.dispatch({
      type: 'blog/changeSelectedRowKeys',
      payload: { key: 'articlesSelectedRowKeys', value: selectedRowKeys },
    });
  }

  getList = (n) => {
    const { paging } = this.props;
    const payload = {
      page: n || paging.current || 1,
    };

    this.props.dispatch({
      type: 'blog/getArticles',
      payload,
    });
  }

  clearSelected = () => {
    this.props.dispatch({
      type: 'blog/changeSelectedRowKeys',
      payload: { key: 'articlesSelectedRowKeys', value: [] },
    });
  }

  showConfirm = (key, ids) => {
    confirm({
      title: '确认要删除选中文章吗?',
      onOk: () => { this.updateState(key, ids); },
    });
  }

  updateState = (key, ids) => {
    this.props.dispatch({
      type: 'blog/updateArticlesState',
      payload: { article_id_list: ids, type: key },
    }).then(this.getList);
  }

  activeMenu = (value, ids) => {
    const key = value.key - 0;
    if (key === 3) {
      this.showConfirm(key, ids);
    } else {
      this.updateState(key, ids);
    }
  }

  render() {
    const { listLoading, updateStateLoading, list, paging, selectedRowKeys } = this.props;

    const columns = [
      {
        title: '标题',
        dataIndex: 'title',
      },
      {
        title: '作者',
        dataIndex: 'author',
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
          const id = [data.id];
          return (
            <Button.Group size="small">
              <Button type="primary"><Link to={`/mall/blog/${data.id}`}><Icon type="edit" /> 编辑</Link></Button>
              {data.up_and_down === 2 &&
              <Button onClick={() => { this.activeMenu({ key: 1 }, id); }} icon="check-circle-o" type="primary" ghost>
                发布
              </Button>
              }
              {data.up_and_down === 1 &&
              <Button onClick={() => { this.activeMenu({ key: 2 }, id); }} icon="minus-circle-o" type="primary" ghost>
                隐藏
              </Button>
              }
              <Button onClick={() => { this.activeMenu({ key: 3 }, id); }} icon="delete" type="primary" ghost />
            </Button.Group>
          );
        },
      },
    ];

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    const renderList = () => (
      <div>
        <Card bordered={false}>
          <Row>
            <Col span={12} style={{ paddingTop: 6 }}>
              <Link to="/mall/blog/new" style={{ marginRight: 16 }}><Icon type="bars" /> 分类管理</Link>
              <Link to="/mall/blog/new"><Icon type="message" /> 评论管理</Link>
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              <Link to="/mall/blog/new" style={{ marginRight: 10 }}>
                <Button type="primary" icon="plus" >添加文章</Button>
              </Link>
            </Col>
          </Row>


        </Card>
        <Card bordered={false} style={{ marginTop: 16 }}>
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
              size="small"
              icon="close"
              onClick={this.clearSelected}
            >
              清空
            </Button>
          </span>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={list}
            loading={listLoading || updateStateLoading}
            rowSelection={rowSelection}
            style={{ marginTop: 20 }}
            pagination={{
              ...paging,
              onChange: this.getList,
            }}
          />

        </Card>
      </div>
    );

    const renderEmpty = () => (
      <Card bordered={false} className={styles.empty}>
        <h1>写一篇博文</h1>
        <h3>博客帖子是围绕您的产品和品牌建立社区的好方法。</h3>
        <Link to="/mall/blog/new">
          <Button type="primary" size="large" icon="plus">创建博客文章</Button>
        </Link>

      </Card>
    );

    return (
      <PageHeaderLayout title="博客文章">
        {!listLoading && !list.length ? renderEmpty() : renderList()}
      </PageHeaderLayout>
    );
  }
}
