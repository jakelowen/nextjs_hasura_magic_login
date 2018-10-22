import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import TextInput from '../TextInput';
import FormSubmitButton from '../FormSubmitButton';

const RegisterForm = ({ mutation, updateParentState, email }) => (
  <Formik
    initialValues={{ email: email === null ? '' : email, name: '' }}
    enableReinitialize
    validationSchema={Yup.object().shape({
      name: Yup.string().required('Name is required'),
      email: Yup.string()
        .email('Must be a properly formatted email address')
        .required('Email is required'),
    })}
    onSubmit={(
      values,
      { setSubmitting /*  setErrors setValues and other goodies */ }
    ) => {
      setSubmitting(true);
      mutation({
        variables: { email: values.email, name: values.name },
      }).then(response => {
        updateParentState('securityCode', response.data.register.securityCode);
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
            <legend className="f4 fw6 ph0 mh0">Let's get you registered</legend>
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
              <TextInput
                id="name"
                type="text"
                label="Name"
                placeholder="Your name.."
                error={errors.name && touched.name && errors.name}
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
          </fieldset>
          <FormSubmitButton
            disabled={isSubmitting}
            value="Register new account"
          />
        </Form>
      </main>
    )}
  />
);

RegisterForm.propTypes = {
  email: PropTypes.string,
  mutation: PropTypes.func.isRequired,
  updateParentState: PropTypes.func.isRequired,
};

export default RegisterForm;
