import React, { useState } from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { toast } from 'react-toastify';

import Modal from './Modal';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import { colors } from '../config/theme';
import Input from '../components/Input';
import axios from 'axios';
import config from '../config/config';

const validationSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .min(6, 'The password should have at least 6 characters')
    .required('The old password is required'),
  password: Yup.string()
    .min(6, 'The password should have at least 6 characters')
    .required('The password is required')
});

const ChangePasswordModal = ({ visible, onClose }) => {
  const [status, setStatus] = useState('');

  const onSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    setStatus('');

    try {
      await axios.put(
        config.serverUrl + '/user',
        {
          password: values.oldPassword,
          new: values.password
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      onClose();
      toast.success('Password changed!');
    } catch (e) {
      console.error(e);
      setStatus('The old password does not match');
    }

    setSubmitting(false);
  };

  return (
    <Modal visible={visible}>
      <Wrapper>
        <Formik
          initialValues={{
            oldPassword: '',
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
            <>
              <div className="title">Change your password</div>
              <div className="content">
                <form onSubmit={handleSubmit}>
                  <Input
                    hasLabel={true}
                    autoComplete={false}
                    type="password"
                    placeholder="Old password"
                    label="Old password"
                    name="oldPassword"
                    mb="8px"
                    error={touched.oldPassword ? errors.oldPassword : null}
                    value={values.oldPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />

                  <Input
                    hasLabel={true}
                    autoComplete={false}
                    type="password"
                    placeholder="New password"
                    label="New password"
                    name="password"
                    mb="8"
                    error={touched.password ? errors.password : null}
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </form>
                <div className="status">{status}</div>
              </div>
              <div className="actions">
                <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
                <PrimaryButton onClick={handleSubmit} disabled={isSubmitting}>
                  Save
                </PrimaryButton>
              </div>
            </>
          )}
        </Formik>
      </Wrapper>
    </Modal>
  );
};

const Wrapper = styled.div`
  width: 500px;

  > .title {
    width: 100%;
    padding: 16px;
    background: ${colors.cool_grey_800};
  }

  > .content {
    width: 100%;
    padding: 16px;
    background: ${colors.cool_grey_900};
  }

  > .actions {
    width: 100%;
    padding: 8px 16px 16px;
    background: ${colors.cool_grey_800};
    display: flex;
  }
`;

export default ChangePasswordModal;
