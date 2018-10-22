import React from 'react';
import Loading from '../../Loading';
import GenericError from '../../GenericError';

export default class VerificationMessage extends React.Component {
  componentDidMount() {
    // eslint-disable-next-line react/prop-types
    const { submitToConnector } = this.props;
    submitToConnector();
  }

  render() {
    // eslint-disable-next-line react/prop-types
    const { loading, error, data, called } = this.props;
    if (loading || !called) {
      return <Loading />;
    }
    // console.log(confirmLogin);

    if (error) {
      return <GenericError />;
    }

    console.log('!!!data', data);
    // const { confirmLogin } = data;
    // return <p>stalling...</p>;

    return (
      <React.Fragment>
        <div className="measure center black-80  sans-serif">
          <h1 className="f2 tc">
            {data && data.confirmLogin.success ? 'Success!' : 'Dang!'}
          </h1>
          <p className="f5 lh-copy tc">{data && data.confirmLogin.message}</p>
        </div>
      </React.Fragment>
    );
  }
}
