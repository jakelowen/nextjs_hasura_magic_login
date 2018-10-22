import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import PropTypes from 'prop-types';
import VerificationMessage from './VerificationMessage';
import { CURRENT_USER_QUERY } from '../User';

export const CONFIRM_LOGIN_MUTATION = gql`
  mutation confirmLogin($token: String!) {
    confirmLogin(token: $token) {
      code
      success
      message
      user {
        id
        name
        email
      }
    }
  }
`;

const ConfirmLoginConnector = ({ token }) => (
  <Mutation
    mutation={CONFIRM_LOGIN_MUTATION}
    variables={{ token }}
    refetchQueries={[{ query: CURRENT_USER_QUERY }]}
  >
    {(confirmLogin, { data, loading, error, called }) => (
      <VerificationMessage
        submitToConnector={confirmLogin}
        data={data}
        loading={loading}
        error={error}
        called={called}
      />
    )}
  </Mutation>
);

ConfirmLoginConnector.propTypes = {
  token: PropTypes.string.isRequired,
};

export default ConfirmLoginConnector; // withApollo(Verify);
