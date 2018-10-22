/* eslint-disable  */
import React from 'react';
import { storiesOf } from '@storybook/react';
import AwaitingConfirmationScreen from '.';

storiesOf('AwaitingConfirmationScreen', module).add('default', () => (
  <AwaitingConfirmationScreen
    email="foo@test.com"
    securityCode="23 suprised ocelots"
  />
));
