import Link from 'next/link';
import NProgress from 'nprogress';
import Router from 'next/router';
// import Nav from './Nav';
// import Cart from './Cart';
// import Search from './Search';

Router.onRouteChangeStart = () => {
  NProgress.start();
};
Router.onRouteChangeComplete = () => {
  NProgress.done();
};

Router.onRouteChangeError = () => {
  NProgress.done();
};

const Header = () => (
  <header>
    <div className="bar">
      {/* <div>
        <Link href="/">
          <a>Title Here</a>
        </Link>
      </div> */}
      {/* <Nav /> */}
    </div>
    <div className="sub-bar">{/* <Search /> */}</div>
    {/* <Cart /> */}
  </header>
);

export default Header;
