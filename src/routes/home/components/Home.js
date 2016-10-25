import React from 'react';

import IndexHead from 'components/Index/IndexHead';
import IndexBody from 'components/Index/IndexBody';

export default class Home extends React.Component {
  render() {
    return (
      <div>
        <IndexHead />
        <IndexBody />
      </div>
    );
  }
}
