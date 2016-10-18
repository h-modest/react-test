import React from 'react';

class IndexHead extends React.Component {
  render() {
    return (
      <div className="admin-head">
        <ul className="admin-head-right">
          <li>
            <i className="fa fa-bell-o"></i>通知
          </li>
          <li>
            <i className="fa fa-question"></i>帮助
          </li>
          <li>
            <i className="fa fa-question"></i>
          </li>
        </ul>
      </div>
    );
  }
}

export default IndexHead;
