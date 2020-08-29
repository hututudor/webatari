import React, { useState } from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import { Formik } from 'formik';

import Modal from './Modal';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import { colors } from '../config/theme';
import Input from '../components/Input';
import axios from 'axios';
import config from '../config/config';
import { toast } from 'react-toastify';
import TextArea from '../components/TextArea';
import { useHistory } from 'react-router-dom';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
});

const CloneProjectModal = ({ visible, onClose, onDone, project }) => {
  const history = useHistory();
  const [status, setStatus] = useState('');

  const onSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    setStatus('');

    try {
      console.log(project);
      const res = await axios.post(
        config.serverUrl + `/projects`,
        {
          name: values.name,
          description: values.description,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      await axios.put(
        config.serverUrl + '/projects/editcode/' + res.data.project.uuid,
        {
          code: project.code,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      history.push('/project/' + res.data.project.uuid);
      history.go(0);
      onDone({ name: values.name, description: values.description });
      toast.success('Updated!');
    } catch (e) {
      console.error(e);
      setStatus('Something went wrong, please try again');
    }

    setSubmitting(false);
  };

  return (
    <Modal visible={visible}>
      <Wrapper>
        <Formik
          initialValues={{
            name: project.name,
            description: project.description,
          }}
          enableReinitialize={true}
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
            isSubmitting,
          }) => (
            <>
              <div className="title">Clone project</div>
              <div className="content">
                <form onSubmit={handleSubmit}>
                  <Input
                    hasLabel={true}
                    autoComplete={false}
                    type="text"
                    placeholder="Name"
                    label="Name"
                    name="name"
                    mb="8px"
                    error={touched.name ? errors.name : null}
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />

                  <TextArea
                    hasLabel={true}
                    autoComplete={false}
                    type="text"
                    placeholder="Description"
                    label="Description"
                    name="description"
                    mb="0"
                    error={touched.description ? errors.description : null}
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </form>
                <div className="status">{status}</div>
              </div>
              <div className="actions">
                <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
                <PrimaryButton onClick={handleSubmit} disabled={isSubmitting}>
                  Clone
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

export default CloneProjectModal;
