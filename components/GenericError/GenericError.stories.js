/* eslint-disable */
import React from 'react';
import { storiesOf } from '@storybook/react';
import GenericError from '.';

storiesOf('Generic Error', module).add('default', () => (
  <div style={{ width: '80%', margin: '10px auto 10px auto' }}>
    <GenericError />
  </div>
));
