/* eslint-disable */
import React from 'react';
import { storiesOf } from '@storybook/react';
import Loading from '.';

storiesOf('Loading', module).add('default', () => (
  <div style={{ width: '80%', margin: '10px auto 10px auto' }}>
    <Loading />
  </div>
));
