import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form, Input, Switch, Select, Checkbox, Card, Row, Col, InputNumber, Spin, Pagination,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Search.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(state => ({
  loading: state.items.searchLoading,
  items: state.items.searchItems,
  paging: state.items.searchPaging,
}))
@Form.create()
export default class SearchItems extends PureComponent {
  state = {
    high: false,
    languageMap: [
      { name: 'Chinese', value: 1 },
      { name: 'English', value: 2 },
    ],
  }

  handleSubmit = (n) => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { paging } = this.props;
        let payload = {
          keywords: this.props.form.getFieldValue('keywords') || '',
          per_pagesize: 30,
          to_page: n || (paging ? paging.current : 1),
        };

        if (this.state.high) {
          payload = {
            ...payload,
            free_shipment: values.free_shipment ? 1 : 0,
            start_price: values.start_price || '',
            end_price: values.end_price || '',
            language: values.language || '',
          };
        }
        this.props.dispatch({
          type: 'items/searchItems',
          payload,
        });
      }
    });
  }
  render() {
    const { loading, items, paging } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { high, languageMap } = this.state;

    /*const fromCol = {
      col1: {
        sm: { span: 10, offset: 2 },
        md: { span: 6, offset: 6 },
        lg: { span: 5, offset: 7 },
      },
      col2: {
        sm: { span: 10 },
        md: { span: 6 },
        lg: { span: 5 },
      },
      col3: {
        sm: { span: 20, offset: 2 },
        md: { span: 12, offset: 6 },
        lg: { span: 10, offset: 7 },
      },
    };*/

    const formItemLayout = {
      labelCol: {
        // xs: { span: 24 },
        // sm: { span: 8 },
        lg: { span: 6 },
      },
      wrapperCol: {
        // xs: { span: 24 },
        // sm: { span: 16 },
        lg: { span: 18 },
      },
    };

    return (
      <PageHeaderLayout title="搜索产品" content="">
        <Card bordered={false}>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              this.handleSubmit();
            }}
            className={styles.from}
            layout="horizontal"
          >
            <Row gutter={24}>
              <Col lg={{ span: 13 }}>
                <FormItem>
                  {getFieldDecorator('keywords', {
                    rules: [{
                      required: true, message: '请输入关键字',
                    }],
                  })(
                    <Input.Search
                      placeholder="请输入"
                      onSearch={() => { this.handleSubmit(); }}
                      enterButton
                    />
                  )}
                </FormItem>
              </Col>
              <Col lg={{ span: 2 }}>
                <FormItem>
                  <Switch
                    checkedChildren="高级"
                    unCheckedChildren="高级"
                    checked={high}
                    onChange={(e) => {
                      this.setState({ high: e });
                    }}
                  />
                </FormItem>
              </Col>

            </Row>
            <Row gutter={24} style={{ visibility: high ? 'visible' : 'hidden', height: high ? 'auto' : '0', overflow: 'hidden' }}>
              <Col lg={{ span: 5 }}>
                <FormItem label="价格(￥)" {...formItemLayout}>
                  <Row>
                    <Col span={11}>
                      {getFieldDecorator('start_price')(
                        <InputNumber min={0} />
                      )}
                    </Col>
                    <Col span={2}>
                      -
                    </Col>
                    <Col span={11}>
                      {getFieldDecorator('end_price')(
                        <InputNumber min={0} />
                      )}
                    </Col>
                  </Row>
                </FormItem>
              </Col>
              <Col lg={{ span: 5 }}>
                <FormItem label="语言" {...formItemLayout}>
                  {getFieldDecorator('language')(
                    <Select
                      placeholder="请选择"
                    >
                      {languageMap.map(item =>
                        <Option key={item.value} value={item.value}>{item.name}</Option>
                      )}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col lg={{ span: 5 }}>
                <FormItem {...formItemLayout}>
                  {getFieldDecorator('free_shipment')(
                    <Checkbox>免费国内航运</Checkbox>
                  )}
                </FormItem>
              </Col>
            </Row>

          </Form>

          {loading
            ? <div style={{ textAlign: 'center', padding: '40px 0' }}><Spin /></div>
            : items && items.length
              ?
                <div className={styles.itemList}>
                  {items.map(item => (
                    <Card
                      hoverable
                      style={{ width: 240 }}
                      cover={<img alt="example" src={item.imgUrl} />}
                      key={item.goodsId}
                      className={styles.item}
                      onClick={() => {
                        const a = document.createElement('A');
                        a.href = item.goodsUrl;
                        a.target = '_blank';
                        a.click();
                      }}
                    >
                      <p className={styles.title}>{item.title}</p>
                      <p className={styles.price}>￥{item.price}</p>
                      <div className={styles.bottom}>
                        <i>{item.providerType}</i>
                        <span>{item.statusText}</span>
                      </div>

                    </Card>
                  ))}
                  {!!paging &&
                  <Pagination
                    current={paging.current}
                    pageSize={paging.pageSize}
                    total={paging.total}
                    onChange={(n) => {
                      this.handleSubmit(n);
                    }}
                  />
                  }
                </div>
              : ''
          }
        </Card>


      </PageHeaderLayout>
    );
  }
}
