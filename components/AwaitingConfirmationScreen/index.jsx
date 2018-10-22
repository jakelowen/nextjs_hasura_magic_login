import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/pro-light-svg-icons';

const AwaitingConfirmation = ({ email, securityCode }) => (
  <div className="measure center black-80 sans-serif">
    <h1 className="f2">Awaiting Verification</h1>
    <p className="f5">{`We have sent an email to ${email}.`}</p>
    <p className="f5">
      Please login to your email and verify the provided security code matches
      the following text:
    </p>
    <p className="f5">Your security code:</p>
    <p className="f3 pa4 bg-black-80 white tc">{securityCode}</p>
    <p className="f5 tc">
      <FontAwesomeIcon className="mr3" icon={faSpinner} spin />
      Waiting for confirmation...
    </p>
  </div>
);

AwaitingConfirmation.propTypes = {
  email: PropTypes.string.isRequired,
  securityCode: PropTypes.string.isRequired,
};

export default AwaitingConfirmation;
