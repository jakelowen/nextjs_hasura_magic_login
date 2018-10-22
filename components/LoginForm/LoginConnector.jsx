import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import React from 'react';
import AwaitingConfirmationScreen from '../AwaitingConfirmationScreen';
import LoginForm from './LoginForm';
import RegistrationForm from './RegisterForm';
import Loading from '../Loading';

export const LOGIN_MUTATION = gql`
  mutation requestLogin($email: String!) {
    requestLogin(email: $email) {
      code
      success
      message
      securityCode
    }
  }
`;

export const REGISTRATION_MUTATION = gql`
  mutation register($email: String!, $name: String!) {
    register(email: $email, name: $name) {
      code
      success
      message
      securityCode
    }
  }
`;

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      securityCode: null,
      email: null,
    };
    this.updateParentState = this.updateParentState.bind(this);
  }

  updateParentState(key, value) {
    this.setState({
      [key]: value,
    });
  }

  render() {
    const { securityCode, email } = this.state;
    return (
      <div>
        {securityCode && email ? (
          <AwaitingConfirmationScreen
            securityCode={securityCode}
            email={email}
          />
        ) : (
          <Mutation mutation={LOGIN_MUTATION}>
            {(requestLogin, { data, loading, error, called }) => {
              // const { email } = this.state;
              if (loading) return <Loading />;
              if (called && data.requestLogin.code === 'noUser') {
                return (
                  <Mutation mutation={REGISTRATION_MUTATION}>
                    {register => (
                      <RegistrationForm
                        mutation={register}
                        updateParentState={this.updateParentState}
                        email={email}
                      />
                    )}
                  </Mutation>
                );
              }
              if (called && !data.requestLogin.success) {
                return <p>{data.requestLogin.message}</p>;
              }
              return (
                <LoginForm
                  mutation={requestLogin}
                  updateParentState={this.updateParentState}
                />
              );
            }}
          </Mutation>
        )}
      </div>
    );
  }
}

export default Login;
