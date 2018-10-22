/* eslint-disable */
import React from 'react';
import { storiesOf } from '@storybook/react';
import FormSubmitButton from '.';
import { withNotes } from '@storybook/addon-notes';


storiesOf('FormSubmitButton', module)
  .add('default',  withNotes('A very simple component')(() => (
    <div style={{ width: '80%', margin: '10px auto 10px auto' }}>
      <FormSubmitButton isSubmitting={false} value="A button!" />
    </div>
  )))
  .add('Submitting', () => (
    <div style={{ width: '80%', margin: '10px auto 10px auto' }}>
      <FormSubmitButton isSubmitting value="A button!" />
    </div>
  ));
