import React, { useContext, useState } from 'react';
import styled from 'styled-components';

import Modal from './Modal';
import { DangerButton, SecondaryButton } from '../components/Button';
import { colors } from '../config/theme';
import AuthContext from '../utils/AuthContext';
import axios from 'axios';
import config from '../config/config';
import { toast } from 'react-toastify';

const DeleteUserModal = ({ visible, onClose }) => {
  const authContext = useContext(AuthContext.Context);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async () => {
    setIsSubmitting(true);

    try {
      await axios.delete(config.serverUrl + '/user', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      onClose();
      authContext.logout();
      toast.success('Account removed!');
    } catch (e) {
      console.error(e);
    }

    setIsSubmitting(false);
  };

  return (
    <Modal visible={visible}>
      <Wrapper>
        <div className="title">Delete account</div>
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

export default DeleteUserModal;
