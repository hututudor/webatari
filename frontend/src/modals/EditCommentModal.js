import React, { useState } from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import { Formik } from 'formik';

import Modal from './Modal';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import { colors } from '../config/theme';
import axios from 'axios';
import config from '../config/config';
import { toast } from 'react-toastify';
import TextArea from '../components/TextArea';

const validationSchema = Yup.object().shape({
  comment: Yup.string().required('Comment is required'),
});

const EditCommentModal = ({ visible, onClose, onDone, comment }) => {
  const [status, setStatus] = useState('');

  const onSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    setStatus('');

    try {
      await axios.put(
        config.serverUrl + `/comments/${comment.id}`,
        {
          description: values.comment,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      onDone({ comment: values.comment, id: comment.id });
      toast.success('Updated!');
    } catch (e) {
      console.error(e);
      onDone({ comment: values.comment, id: comment.id });

      setStatus('Something went wrong, please try again');
    }

    setSubmitting(false);
  };

  return (
    <Modal visible={visible}>
      <Wrapper>
        <Formik
          initialValues={{
            comment: comment.description,
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
              <div className="title">Edit comment</div>
              <div className="content">
                <form onSubmit={handleSubmit}>
                  <TextArea
                    hasLabel={true}
                    autoComplete={false}
                    type="text"
                    placeholder="Comment"
                    label="Comment"
                    name="comment"
                    mb="0"
                    error={touched.comment ? errors.comment : null}
                    value={values.comment}
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

export default EditCommentModal;
