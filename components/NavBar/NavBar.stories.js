/* eslint-disable */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import NavBar from '.';

storiesOf('NavBar', module)
  .add('default', () => <NavBar />)
  .add('logged in', () => (
    <NavBar loggedIn logoutFunc={action('log out click')} />
  ));
