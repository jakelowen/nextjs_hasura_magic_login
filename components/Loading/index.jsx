import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/pro-light-svg-icons';

const Loading = () => (
  <div className="black-80 sans-serif measure">
    <FontAwesomeIcon className="dib mr3" icon={faSpinner} spin />
    <span className="f4">Loading...</span>
  </div>
);

export default Loading;
