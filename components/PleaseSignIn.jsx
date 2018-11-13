import { Query } from 'react-apollo';
// import { CURRENT_USER_QUERY } from './User';
// import Signin from './Signin';
// import gql from 'graphql-tag';
import React from 'react';
import PropTypes from 'prop-types';
import LogInConnector from './LoginForm/LoginConnector';
import { CURRENT_USER_QUERY } from './User';

const PleaseSignIn = props => (
  <Query query={CURRENT_USER_QUERY}>
    {({ data, loading, startPolling }) => {
      if (loading) return <p>Loading...</p>;

      if (data && data.me) {
        return props.children;
      }

      startPolling(3000);
      return <LogInConnector />;
    }}
  </Query>
);

PleaseSignIn.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default PleaseSignIn;
