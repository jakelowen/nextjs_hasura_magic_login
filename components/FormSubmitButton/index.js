import React from 'react';
import cx from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/pro-light-svg-icons';
import PropTypes from 'prop-types';

const FormSubmitButton = ({ isSubmitting, value }) => (
  <div className="black-80 sans-serif">
    <button
      className={cx('b ph3 pv2 input-reset ba b--black w4 f6 dib', {
        'grow bg-transparent pointer': !isSubmitting,
        'bg-light-gray b--black-20 black-40': !!isSubmitting,
      })}
      disabled={isSubmitting}
      type="submit"
    >
      {!isSubmitting ? value : <FontAwesomeIcon icon={faSpinner} spin />}
    </button>
  </div>
);

FormSubmitButton.propTypes = {
  isSubmitting: PropTypes.bool,
  value: PropTypes.string.isRequired,
};

FormSubmitButton.defaultProps = {
  isSubmitting: false,
};

export default FormSubmitButton;
