import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Icon, Checkbox, Alert } from 'antd';
import styles from './Login.less';

const FormItem = Form.Item;

@connect(state => ({
  login: state.login,
}))
@Form.create()
export default class Login extends Component {
  state = {
    type: 'account',
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields({ force: true },
      (err, values) => {
        if (!err) {
          this.props.dispatch({
            type: 'login/login',
            payload: {
              ...values,
              type: this.state.type,
            },
          });
        }
      }
    );
  }

  renderMessage = (message) => {
    return (
      <Alert
        style={{ marginBottom: 24 }}
        message={message}
        type="error"
        showIcon
      />
    );
  }

  render() {
    const { form, login } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className={styles.main}>
        <h2 style={{ textAlign: 'center', padding: '1em' }}>Login</h2>
        <Form onSubmit={this.handleSubmit}>
          {
            login.status === 'error' &&
            login.submitting === false &&
            this.renderMessage('账户或密码错误')
          }
          <FormItem>
            {getFieldDecorator('userName', {
              rules: [{
                required: true, message: '请输入账户名！',
              }],
            })(
              <Input
                size="large"
                prefix={<Icon type="user" className={styles.prefixIcon} />}
                placeholder="admin"
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{
                required: true, message: '请输入密码！',
              }],
            })(
              <Input
                size="large"
                prefix={<Icon type="lock" className={styles.prefixIcon} />}
                type="password"
                placeholder="888888"
              />
            )}
          </FormItem>
          <FormItem className={styles.additional}>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(
              <Checkbox className={styles.autoLogin}>自动登录</Checkbox>
            )}
            <a className={styles.forgot} href="">忘记密码</a>
            <Button size="large" loading={login.submitting} className={styles.submit} type="primary" htmlType="submit">
              登录
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
