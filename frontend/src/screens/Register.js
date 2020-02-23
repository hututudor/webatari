import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Formik } from 'formik';
import * as Yup from 'yup';

import AuthContext from '../utils/AuthContext';
import PageWrapper from '../components/PageWrapper';
import { colors } from '../config/theme';
import Input from '../components/Input';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string()
    .email('Email must be valid')
    .required('Email is required'),
  password: Yup.string()
    .min(4, 'Password needs to be at least 4 characters long')
    .required('Password is required')
});

const Register = () => {
  const authContext = useContext(AuthContext.Context);
  const history = useHistory();

  if (authContext.isLoggedIn()) {
    history.push('/');
  }

  const onSubmit = async (values, { resetForm, setSubmitting }) => {
    setSubmitting(false);
  };

  return (
    <PageWrapper>
      <Wrapper>
        <div className="form">
          <div className="title">Register</div>
          <div className="content">
            <Formik
              initialValues={{
                name: '',
                email: '',
                password: ''
              }}
              onSubmit={onSubmit}
              validationSchema={validationSchema}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting
              }) => (
                <form onSubmit={handleSubmit}>
                  <Input
                    hasLabel={true}
                    autoComplete={false}
                    placeholder="Name"
                    label="Name"
                    name="name"
                    mb="8px"
                    error={touched.name ? errors.name : null}
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />

                  <Input
                    hasLabel={true}
                    autoComplete={false}
                    type="email"
                    placeholder="Email"
                    label="Email"
                    name="email"
                    mb="8px"
                    error={touched.email ? errors.email : null}
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />

                  <Input
                    hasLabel={true}
                    autoComplete={false}
                    type="password"
                    placeholder="Password"
                    label="Password"
                    name="password"
                    mb="8px"
                    error={touched.password ? errors.password : null}
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </form>
              )}
            </Formik>
          </div>
        </div>
      </Wrapper>
    </PageWrapper>
  );
};

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 192px;

  .form {
    width: 512px;
    padding: 16px 24px;
    background: ${colors.cool_grey_800};
    display: flex;
    flex-direction: column;

    .title {
      font-size: 24px;
      text-align: center;
      margin-bottom: 24px;
    }
  }
`;

export default Register;
