/* eslint-disable camelcase,max-len */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Card, Form, Table, Input, Button, Row, Col, Icon, message, Radio } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './ArticleDetail.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

@connect(state => ({
  createLoading: state.blog.createArticleLoading,
  detail: state.blog.articleDetail,
  detailLoading: state.blog.articleDetailLoading,
  updateLoading: state.blog.updateArticleLoading,
  blogs: state.blog.blogs,
  createBlogsLoading: state.blog.createBlogsLoading,
}))
@Form.create()
export default class ItemsGroup extends PureComponent {
  state = {
    id: this.props.match.params.id,
    type: this.props.match.params.id ? 1 : 0,
    coverImg: '',
    blogId: '',
    // visible: this.props.match.params.id ? 0 : 2,
  }
  componentWillMount() {
    const { type, id } = this.state;
    if (type) this.getDetail(id);
  }
  getDetail = (id, reset) => {
    this.props.dispatch({
      type: 'blog/getArticleDetail',
      payload: id,
    }).then(() => {
      if (reset !== false) this.resetDetail();
    });
  }
  getBlogs = () => {
    //TODO 获取博客分类列表
  }
  create = () => {
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const payload = {
          ...values,
          featured_image: this.state.coverImg,
          handle: '1',
          goDetail: true,
        };

        this.props.dispatch({
          type: 'blog/createArticle',
          payload,
        });
      }
    });
  }
  resetDetail = () => {
    const { form, detail } = this.props;
    if (detail) {
      const { featured_image, ...rest } = detail;
      form.setFieldsValue({ ...rest });
      this.setState({
        coverImg: featured_image,
      });
    }
  }
  update = () => {
    const { form } = this.props;
    const { id, coverImg } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const payload = {
          ...values,
          featured_image: coverImg,
          id,
        };

        this.props.dispatch({
          type: 'blog/updateArticle',
          payload,
        }).then(() => {
          this.getDetail(id);
        });
      }
    });
  }

  createBlogs = (title) => {
    this.props.dispatch({
      type: 'blog/createBlogs',
      payload: { title },
    });
  }

  render() {
    const { form, createLoading, detail, detailLoading, updateLoading, createBlogsLoading } = this.props;
    const { getFieldDecorator } = form;
    const { type } = this.state;

    const actionCreate = (
      <div>
        <Button type="primary" onClick={this.create} loading={createLoading}>保存</Button>
      </div>
    );

    const actionUpdate = (
      <div>
        <Button icon="rollback" onClick={this.resetDetail}>撤销</Button>
        <Button icon="save" type="primary" onClick={this.update} loading={updateLoading || detailLoading}>保存</Button>
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
        title={type ? '博客文章详情' : '添加博客文章'}
        className={styles.wrapper}
        action={type ? actionUpdate : actionCreate}
      >
        <Form
          hideRequiredMark
          layout="vertical"
          disabled={detailLoading}
        >
          {/*<Badge status="error" text="Error" />*/}
          <Row gutter={16}>
            <Col {...layout.left}>
              <Card bordered={false}>
                <h3>文章详情</h3>
                <FormItem label="标题">
                  {getFieldDecorator('title', {
                    initialValue: '',
                    rules: [{
                      required: true, message: '请输入文章标题',
                    }],
                  })(
                    <Input placeholder="请输入文章标题" />
                  )}
                </FormItem>
                <FormItem label="内容">
                  {getFieldDecorator('content', {
                    initialValue: '',
                    rules: [{
                      required: true, message: '请输入文章内容',
                    }],
                  })(
                    <Input.TextArea placeholder="请输入文章内容" />
                  )}
                </FormItem>
              </Card>

              <Card bordered={false} style={{ marginTop: 16 }}>
                <h3>上传图片</h3>
                <p>{detail ? detail.featured_image : ''}</p>
              </Card>

              <Card bordered={false} style={{ marginTop: 16 }}>
                <h3>摘要</h3>

                <FormItem>
                  {getFieldDecorator('description', {
                    initialValue: '',
                  })(
                    <Input.TextArea placeholder="添加文章摘要以显示在您的主页或博客上" />
                  )}
                </FormItem>
              </Card>
            </Col>

            <Col {...layout.right}>
              <Card bordered={false}>
                <h3>是否发布</h3>
                <FormItem>
                  {getFieldDecorator('up_and_down', {
                    initialValue: 2,
                    rules: [{
                      required: true,
                    }],
                  })(
                    <RadioGroup >
                      <Radio style={radioStyle} value={1}>发布</Radio>
                      <Radio style={radioStyle} value={2}>隐藏</Radio>
                    </RadioGroup>
                )}
                </FormItem>
              </Card>

              <Card bordered={false} style={{ marginTop: 16 }}>
                <h3>分类</h3>
                <div
                  style={{ height: '46px' }}
                >
                  <FormItem>
                    {getFieldDecorator('blog_id', {
                      initialValue: '',
                      rules: [{
                        required: true, message: '请选择分类',
                      }],
                    })(
                      <Input />
                    )}
                  </FormItem>
                </div>
                <p>创建分类</p>
                <Input.Search
                  placeholder="请输入分类标题"
                  enterButton="新建"
                  onSearch={(data) => {
                    if (data) this.createBlogs(data);
                  }}
                  loading={`${createBlogsLoading}`}
                  // ref={(c) => { this.input = c; }}
                />
              </Card>

              <Card bordered={false} style={{ marginTop: 16 }}>
                <h3>评论</h3>
                <h5>博客文章的评论管理功能。</h5>
                <FormItem>
                  {getFieldDecorator('comments', {
                    initialValue: 1,
                    rules: [{
                      required: true,
                    }],
                  })(
                    <RadioGroup>
                      <Radio style={radioStyle} value={1}>禁用评论功能</Radio>
                      <Radio style={radioStyle} value={2}>允许评论，待审核</Radio>
                      <Radio style={radioStyle} value={3}>允许评论，并自动发布</Radio>
                    </RadioGroup>
                  )}
                </FormItem>

              </Card>
            </Col>
          </Row>
        </Form>

      </PageHeaderLayout>
    );
  }
}
