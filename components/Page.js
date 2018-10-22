import React, { Component } from 'react';
import Header from './Header';
import Meta from './Meta';
import 'tachyons/css/tachyons.min.css';

class Page extends Component {
  render() {
    const { children } = this.props;
    return (
      <>
        <Meta />
        <Header />
        <div>{children}</div>
      </>
    );
  }
}

export default Page;
