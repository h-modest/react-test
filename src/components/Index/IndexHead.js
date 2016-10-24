import React from 'react';
import { Modal, Form, Input } from 'antd';
import classNames from 'classnames';
const FormItem = Form.Item;

class IndexHead extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpenUserNav: false,
      isOpenCompanyNav: false,
      visible: false
    };
  }

  handleOk() {
    this.setState({
      visible: false
    });
  }

  handleCancel() {
    this.setState({
      visible: false
    });
  }

  disappear() {
    let { isOpenCompanyNav } = this.state;
    if(isOpenCompanyNav){
      this.setState({ isOpenCompanyNav: false });
    }
  }

  render() {
    let { isOpenUserNav, isOpenCompanyNav, visible } = this.state;
    return (
      <div className="admin-head" onClick={() => this.disappear()}>
        <div className="head-company">
          <img className="image image-s" src="/images/01.png" />玄月之音
          <i className={classNames('fa', isOpenCompanyNav ? 'fa-chevron-up' : 'fa-chevron-down')} onClick={() => {
            this.setState({ isOpenCompanyNav: !isOpenCompanyNav});
          }}></i>
          {isOpenCompanyNav && <ul>
            <li>团队</li>
            <li>小公司</li>
            <li>大企业</li>
            <li onClick={() => this.setState({ visible: true })}><i className="fa fa-plus"></i></li>
          </ul>}
        </div>
        <ul className="head-user">
          <li>
            <i className="fa fa-bell-o"></i>通知
          </li>
          <li>
            <i className="fa fa-question"></i>帮助
          </li>
          <li onMouseOver={() => this.setState({isOpenUserNav: true})} onMouseLeave={() => this.setState({ isOpenUserNav: false})}>
            <img className="image image-s" src="/images/02.png" />神无月的巫女
            <i className="fa fa-chevron-down"></i>
            {isOpenUserNav && <ul>
                <li>工作台</li>
                <li>我的任务</li>
                <li>我的日程</li>
                <li>我的账户</li>
                <li>退出登录</li>
              </ul>}
          </li>
        </ul>
        <Modal
          visible = { visible }
          title="创建公司"
          onOk={()=> this.handleOk()}
          onCancel={()=> this.handleCancel()}
        >
          <Form horizontal>
            <FormItem label="公司名">
              <Input placeholder="请填写公司名" />
            </FormItem>
            <FormItem label="备注">
              <Input placeholder="请填写备注" />
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default IndexHead;
