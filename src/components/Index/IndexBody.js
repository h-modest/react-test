import React from 'react';
import { Tooltip } from 'antd';
import classNames from 'classnames';

import CitySelect from 'components/common/CitySelect';

class IndexBody extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShrink: false,
      isNavShrink: false,
      defaultCity: '厦门',
    };
  }

  selectCity(city) {
    this.setState({
      defaultCity: city,
    });
  }

  render() {
    let { isShrink, isNavShrink, defaultCity } = this.state;
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
          <div className="guide-head">
            <div className="guide-flexible">
              <Tooltip placement="left" title="导航栏">
                <i className="fa fa-list" onClick={() => this.setState({ isNavShrink: !isNavShrink })}></i>
              </Tooltip>
            </div>
            { !isNavShrink && <div className="guide-date">
              <i className="fa fa-cloud"></i>
              <div className="city-form">
                <span>{defaultCity}</span>
                <CitySelect
                  onSelect={(city) => this.selectCity(city)}
                />
              </div>
              <div className="date">

              </div>
            </div>}
          </div>
          { !isNavShrink && <nav>
             <ul>
              <li>
                <Tooltip placement="top" title="日程">
                  <i className="fa fa-calendar"></i>
                </Tooltip>
              </li>
              <li>
                <Tooltip placement="top" title="任务">
                  <i className="fa fa-database"></i>
                </Tooltip>
              </li>
              <li>
                <Tooltip placement="top" title="笔记">
                  <i className="fa fa-reorder"></i>
                </Tooltip>
              </li>
            </ul>
          </nav>}
        </div>
      </div>
    );
  }
}

export default IndexBody;
