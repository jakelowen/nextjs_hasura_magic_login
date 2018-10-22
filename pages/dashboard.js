import PleaseSignIn from '../components/PleaseSignIn';
import NavBar from '../components/NavBar/connected';

const dashboard = () => (
  <>
    <PleaseSignIn>
      <NavBar />
      <p>Dashboard stuff</p>
    </PleaseSignIn>
  </>
);

export default dashboard;
