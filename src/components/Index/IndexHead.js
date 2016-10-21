import React from 'react';
import classNames from 'classnames';

class IndexHead extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpenUserNav: false,
      isOpenCompanyNav: false,
    };
  }

  render() {
    let { isOpenUserNav, isOpenCompanyNav } = this.state;
    return (
      <div className="admin-head">
        <div className="head-company">
          <img className="image image-s" src="/images/01.png" />玄月之音
          <i className={classNames('fa', isOpenCompanyNav ? 'fa-chevron-up' : 'fa-chevron-down')} onClick={() => {
            this.setState({ isOpenCompanyNav: !isOpenCompanyNav});
          }}></i>
          {isOpenCompanyNav && <ul>
            <li>团队</li>
            <li>小公司</li>
            <li>大企业</li>
            <li><i className="fa fa-plus"></i></li>
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
      </div>
    );
  }
}

export default IndexHead;
