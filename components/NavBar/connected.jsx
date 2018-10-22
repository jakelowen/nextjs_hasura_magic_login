import { Mutation } from 'react-apollo';
import React from 'react';
import { adopt } from 'react-adopt';
import gql from 'graphql-tag';
import NavBar from '.';
import User, { CURRENT_USER_QUERY } from '../User';
import Loading from '../Loading';

const SIGNOUT_MUTATION = gql`
  mutation signout {
    signout {
      code
      success
      message
    }
  }
`;

/* eslint-disable */
const Composed = adopt({
  user: ({ render }) => <User>{render}</User>,
  logout: ({ render }) => <Mutation mutation={SIGNOUT_MUTATION} refetchQueries={[{query: CURRENT_USER_QUERY}]}>{render}</Mutation>,
});
/* eslint-enable */

const ConnectedNavBar = () => (
  <Composed>
    {({ user, logout }) => {
      const { me, loading } = user.data;
      if (loading) return <Loading />;
      return <NavBar loggedIn={!!me} logoutFunc={() => logout()} />;
    }}
  </Composed>
);

ConnectedNavBar.propTypes = {};

export default ConnectedNavBar;
