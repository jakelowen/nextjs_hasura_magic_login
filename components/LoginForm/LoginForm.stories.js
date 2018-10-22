/* eslint-disable */
import React from 'react';
import { storiesOf } from '@storybook/react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import LoginConnector, {LOGIN_MUTATION, REGISTRATION_MUTATION} from "./LoginConnector"
import { withNotes } from '@storybook/addon-notes';


storiesOf('LoginForm', module).add('default', () => <LoginForm />);
storiesOf('RegisterForm', module).add('default', () => <RegisterForm />);
