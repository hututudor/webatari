import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import Modal from './Modal';
import { DangerButton, SecondaryButton } from '../components/Button';
import { colors } from '../config/theme';
import axios from 'axios';
import config from '../config/config';
import { toast } from 'react-toastify';

const DeleteCommentModal = ({ visible, onClose, comment, onDone }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const history = useHistory();

  const onSubmit = async () => {
    setIsSubmitting(true);

    try {
      await axios.delete(config.serverUrl + `/comments/${comment.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      history.push('/');
      onClose();
      toast.success('Comment removed!');
      onDone({ comment, id: comment.id });
    } catch (e) {
      console.error(e);
      toast.error('Something went wrong!');
      onDone({ comment, id: comment.id });
    }

    setIsSubmitting(false);
  };

  return (
    <Modal visible={visible}>
      <Wrapper>
        <div className="title">Delete comment</div>
        <div className="content">Are you really sure?</div>
        <div className="actions">
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
          <DangerButton onClick={onSubmit} disabled={isSubmitting}>
            Delete
          </DangerButton>
        </div>
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

export default DeleteCommentModal;
