import React from 'react';
import { Tooltip } from 'antd';
import classNames from 'classnames';

class IndexBody extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShrink: false,
      isNavShrink: false,
    };
  }

  render() {
    let { isShrink, isNavShrink } = this.state;
    return (
      <div className="admin-body">
        <div className={classNames('admin-body-nav', isShrink ? 'shrink' : 'stretch')}>
          <ul>
            <li onClick={() => this.setState({ isShrink: !isShrink })}><i className="fa fa-list"></i></li>
            <li className="active"><i className="fa fa-desktop"></i>{!isShrink && '工 作 台'}</li>
            <li><i className="fa fa-tasks"></i>{!isShrink && '任 务'}</li>
            <li><i className="fa fa-calendar-o"></i>{!isShrink && '日 程'}</li>
            <li><i className="fa fa-inbox"></i>{!isShrink && '通 知'}</li>
            <li><i className="fa fa-gear"></i>{!isShrink && '账 户'}</li>
          </ul>
        </div>
        <div className={classNames('admin-body-guide', isNavShrink ? 'guide-shrink' : 'guide-stretch')}>
          <div className="guide-flexible">
            <Tooltip placement="top" title="导航栏">
              <i className="fa fa-list" onClick={() => this.setState({ isNavShrink: !isNavShrink })}></i>
            </Tooltip>
          </div>
          <nav>
            { !isNavShrink && <ul>
              <li><i className="fa fa-calendar"></i></li>
              <li><i className="fa fa-database"></i></li>
              <li><i className="fa fa-reorder"></i></li>
            </ul> }
          </nav>
        </div>
      </div>
    );
  }
}

export default IndexBody;
