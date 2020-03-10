import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import AuthContext from '../utils/AuthContext';
import PageWrapper from '../components/PageWrapper';
import { colors } from '../config/theme';
import Input from '../components/Input';
import config from '../config/config';
import { toast } from 'react-toastify';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string()
    .email('Email must be valid')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password needs to be at least 6 characters long')
    .required('Password is required')
});

const Register = () => {
  const authContext = useContext(AuthContext.Context);
  const history = useHistory();
  const [status, setStatus] = useState('');

  if (authContext.isLoggedIn()) {
    history.push('/');
  }

  const onSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    setStatus('');

    try {
      const res = await axios.post(config.serverUrl + '/register', {
        email: values.email,
        name: values.name,
        password: values.password
      });

      authContext.login(res.data);
      toast.success('Welcome!');
    } catch (e) {
      console.error(e.response.data.email);
      setStatus(e.response.data.email);
    }

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

                  <button onClick={handleSubmit} disabled={isSubmitting}>
                    Register
                  </button>
                </form>
              )}
            </Formik>
            <div className="status">{status}</div>
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

    .status {
      color: ${colors.red_vivid_500};
      text-align: center;
      margin-top: 8px;
      font-size: 12px;
    }

    .title {
      font-size: 24px;
      text-align: center;
      margin-bottom: 24px;
    }

    button {
      width: 100%;
      height: 48px;
      margin-top: 8px;
      border: none;
      outline: none;
      background: ${colors.blue_vivid_700};
      color: ${colors.blue_vivid_050};
      font-size: 16px;
      cursor: pointer;

      :active {
        background: ${colors.blue_vivid_800};
      }

      :disabled {
        background: ${colors.cool_grey_700};
      }
    }
  }
`;

export default Register;
