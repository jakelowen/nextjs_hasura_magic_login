import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import TextInput from '../TextInput';
import FormSubmitButton from '../FormSubmitButton';

const LoginForm = ({ mutation, updateParentState }) => (
  <Formik
    initialValues={{ email: '' }}
    validationSchema={Yup.object().shape({
      email: Yup.string()
        .email('Must be a properly formatted email address')
        .required('Email is required'),
    })}
    onSubmit={(
      values,
      { setSubmitting /*  setErrors setValues and other goodies */ }
    ) => {
      // setParentState("registrantEmail", values.email);
      setSubmitting(true);
      mutation({
        variables: { email: values.email },
      }).then(response => {
        updateParentState(
          'securityCode',
          response.data.requestLogin.securityCode
        );
        updateParentState('email', values.email);
      });
    }}
    render={({
      values,
      errors,
      touched,
      handleChange,
      handleBlur,
      isSubmitting,
    }) => (
      <main className="pa4 black-80 sans-serif">
        <Form className="measure center">
          <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
            <legend className="f4 fw6 ph0 mh0">Sign In</legend>
            <div className="mt3">
              <TextInput
                id="email"
                type="text"
                label="Email"
                placeholder="Your email.."
                error={errors.email && touched.email && errors.email}
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
          </fieldset>
          <FormSubmitButton disabled={isSubmitting} value="Sign in" />
        </Form>
      </main>
    )}
  />
);

LoginForm.propTypes = {
  mutation: PropTypes.func.isRequired,
  updateParentState: PropTypes.func.isRequired,
};

export default LoginForm;
