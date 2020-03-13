import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import PageWrapper from '../components/PageWrapper';
import AuthContext from '../utils/AuthContext';
import { DangerButton, PrimaryButton } from '../components/Button';
import ChangeUserDetailsModal from '../modals/ChangeUserDetailsModal';
import DeleteUserModal from '../modals/DeleteUserModal';
import ChangePasswordModal from '../modals/ChangePasswordModal';

const Settings = () => {
  const authContext = useContext(AuthContext.Context);
  const history = useHistory();
  const [changeUserDetailsModalOpen, setChangeUserDetailsModalOpen] = useState(
    false
  );
  const [deleteUserModalOpen, setDeleteUserModalOpen] = useState(false);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);

  if (!authContext.isLoggedIn()) {
    history.push('/');
  }

  return (
    <PageWrapper>
      <Wrapper>
        <ChangeUserDetailsModal
          visible={changeUserDetailsModalOpen}
          onClose={() => setChangeUserDetailsModalOpen(false)}
        />
        <DeleteUserModal
          visible={deleteUserModalOpen}
          onClose={() => {
            history.push('/');
            setDeleteUserModalOpen(false);
          }}
        />
        <ChangePasswordModal
          visible={changePasswordModalOpen}
          onClose={() => setChangePasswordModalOpen(false)}
        />

        <div className="wrapper">
          <div className="section">
            <div className="title">Details</div>
            <div className="description">
              <div>Name: {authContext.state.user.name}</div>
              <div>Email: {authContext.state.user.email}</div>
              <div>
                <PrimaryButton
                  width="400px"
                  onClick={() => setChangeUserDetailsModalOpen(true)}
                >
                  Edit details
                </PrimaryButton>
              </div>

              <div>
                <PrimaryButton
                  width="400px"
                  onClick={() => setChangePasswordModalOpen(true)}
                >
                  Change password
                </PrimaryButton>
              </div>

              <div>
                <DangerButton
                  width="400px"
                  onClick={() => setDeleteUserModalOpen(true)}
                >
                  Delete account
                </DangerButton>
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </PageWrapper>
  );
};

const Wrapper = styled.div`
  .wrapper {
    margin: 64px 256px;
    width: calc(100% - 2 * 256px);

    &.loading > div {
      display: flex;
      justify-content: center;
    }
  }

  .section {
    margin: 32px 0;
    min-height: 100px;
    display: flex;
    flex-direction: column;

    .empty {
      margin-top: 16px;
    }

    > .title {
      font-size: 24px;
      margin-bottom: 16px;
    }

    > .description > div {
      margin-bottom: 8px;
      margin-left: 16px;
    }

    > .cards > .project {
      margin-bottom: 16px;
    }
  }
`;

export default Settings;
