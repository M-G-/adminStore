import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Icon, Alert } from 'antd';
import styles from './Login.less';

const FormItem = Form.Item;

@connect(state => ({
  login: state.login,
}))
@Form.create()
export default class Login extends Component {
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
        <h2 style={{ textAlign: 'center', padding: '1em' }}>&nbsp;</h2>
        <Form onSubmit={this.handleSubmit}>
          {
            login.status === 'error' &&
            login.submitting === false &&
            this.renderMessage('账户或密码错误')
          }
          <FormItem>
            {getFieldDecorator('email', {
              rules: [{
                type: 'email', message: 'The input is not valid E-mail.',
              }, {
                required: true, message: 'please input E-mail.',
              }],
            })(
              <Input
                size="large"
                prefix={<Icon type="mail" className={styles.prefixIcon} />}
                placeholder="Email"
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{
                required: true, message: 'please input password.',
              }],
            })(
              <Input
                size="large"
                prefix={<Icon type="lock" className={styles.prefixIcon} />}
                type="password"
                placeholder="Password"
              />
            )}
          </FormItem>
          <FormItem className={styles.additional}>
            <Button size="large" loading={login.submitting} className={styles.submit} type="primary" htmlType="submit">
              Login
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
