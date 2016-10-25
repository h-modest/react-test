import React from 'react';
import classNames from 'classnames';

class IndexBody extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShrink: false
    };
  }

  Shrink() {
    let { isShrink } = this.state;
    this.setState({
      isShrink: !isShrink,
    });
  }

  render() {
    let { isShrink } = this.state;
    return (
      <div className={classNames('admin-body', isShrink && 'shrink-state')}>
        <ul>
          <li onClick={() => this.Shrink()}><i className="fa fa-list"></i></li>
          <li className="active"><i className="fa fa-desktop"></i>{!isShrink && '工 作 台'}</li>
          <li><i className="fa fa-tasks"></i>{!isShrink && '任 务'}</li>
          <li><i className="fa fa-calendar-o"></i>{!isShrink && '日 程'}</li>
          <li><i className="fa fa-inbox"></i>{!isShrink && '通 知'}</li>
          <li><i className="fa fa-gear"></i>{!isShrink && '账 户'}</li>
        </ul>
      </div>
    );
  }
}

export default IndexBody;
