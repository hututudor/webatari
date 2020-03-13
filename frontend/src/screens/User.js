import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { PulseLoader } from 'react-spinners';
import { useParams, useHistory } from 'react-router-dom';
import moment from 'moment';

import PageWrapper from '../components/PageWrapper';
import Project from '../components/Project';
import { colors } from '../config/theme';
import config from '../config/config';
import axios from 'axios';
import { PrimaryButton } from '../components/Button';
import AddProjectModal from '../modals/AddProjectModal';
import AuthContext from '../utils/AuthContext';

const User = () => {
  const [addModalOpen, setAddModalOpen] = useState(false);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const history = useHistory();

  const authContext = useContext(AuthContext.Context);

  useEffect(() => {
    getUser();
  }, [id]);

  const getUser = async () => {
    try {
      setLoading(true);
      const [userRes, projectsRes] = await Promise.all([
        axios.get(config.serverUrl + '/user/' + id),
        axios.get(config.serverUrl + '/projects/user/' + id, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);
      const user = userRes.data.user;
      const projects = projectsRes.data.projects;
      setUser({ ...user, projects });
      setLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  const like = async (projectId, value) => {
    if (!authContext.isLoggedIn()) return;

    const index = user.projects.findIndex(
      project => project.uuid === projectId
    );

    if (index === -1) return;

    const newData = [...user.projects];
    newData[index].liked = value;

    if (!value) {
      newData[index].likes--;
    } else {
      newData[index].likes++;
    }

    setUser({ ...user, projects: newData });

    try {
      let url = '';
      if (value) {
        url = config.serverUrl + '/projects/like/' + projectId;
      } else {
        url = config.serverUrl + '/projects/dislike/' + projectId;
      }

      await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <PageWrapper>
      <Wrapper>
        <div className={`wrapper ${loading ? 'loading' : ''}`}>
          {!loading && user && (
            <>
              <AddProjectModal
                visible={addModalOpen}
                onClose={() => setAddModalOpen(false)}
                onDone={id => {
                  setAddModalOpen(false);
                  history.push('/project/' + id);
                }}
              />
              <div className="section">
                <div className="title">About</div>
                <div className="description">
                  <div>{user.name}</div>
                  <div>{user.email}</div>
                  <div>
                    Member since {moment(user.createdAt).format('DD/MM/YYYY')}
                  </div>
                </div>
              </div>

              {authContext.isLoggedIn() &&
                authContext.state.user.id === user.id && (
                  <div className="section-button">
                    <PrimaryButton
                      width="400px"
                      onClick={() => setAddModalOpen(true)}
                    >
                      Create project
                    </PrimaryButton>
                  </div>
                )}

              <div className="section">
                <div className="title">Projects ({user.projects.length})</div>
                <div className="cards">
                  {user.projects.map(project => (
                    <Project
                      key={project.id}
                      project={project}
                      className="project"
                      onLike={(projectId, value) => like(projectId, value)}
                    />
                  ))}
                </div>
                {(!user.projects || !user.projects.length) && (
                  <div className="empty">
                    This user does not have any projects
                  </div>
                )}
              </div>
            </>
          )}
          {loading && (
            <PulseLoader
              size={16}
              loading={true}
              color={colors.cool_grey_050}
              className="loader"
            />
          )}
          {!loading && !user && (
            <div className="empty">This user does not seem to exist.</div>
          )}
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

    &-button {
    }

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

export default User;
