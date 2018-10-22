import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import TextInput from '.';

storiesOf('TextInput', module)
  .add('default', () => (
    <div style={{ width: '80%', margin: '10px auto 10px auto' }}>
      <TextInput label="FooBar" onChange={action('OnChange')} />
    </div>
  ))
  .add('With help text', () => (
    <div style={{ width: '80%', margin: '10px auto 10px auto' }}>
      <TextInput
        label="FooBar"
        help="This is help"
        onChange={action('OnChange')}
      />
    </div>
  ))
  .add('with error', () => (
    <div style={{ width: '80%', margin: '10px auto 10px auto' }}>
      <TextInput
        label="FooBar"
        help="This is help"
        error="This is an example error"
        onChange={action('OnChange')}
      />
    </div>
  ));
