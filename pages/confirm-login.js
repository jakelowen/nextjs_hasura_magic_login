import ConfirmLogin from '../components/ConfirmLogin/Connector';

const ConfirmLoginPage = ({ query }) => (
  <>
    <ConfirmLogin token={query.token} />
  </>
);

export default ConfirmLoginPage;
