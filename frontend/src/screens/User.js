import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { PulseLoader } from 'react-spinners';
import { useParams } from 'react-router-dom';
import moment from 'moment';

import PageWrapper from '../components/PageWrapper';
import Project from '../components/Project';
import { colors } from '../config/theme';
import { getUser, getUserAsync } from '../mocks/user';

const User = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    getUser(id);
  }, []);

  const getUser = async () => {
    setUser(await getUserAsync());
    setLoading(false);
  };

  const like = (id, value) => {
    const index = user.projects.findIndex(project => project.id === id);

    if (index === -1) return;

    const newData = [...user.projects];
    newData[index].liked = value;

    if (!value) {
      newData[index].likes--;
    } else {
      newData[index].likes++;
    }

    setUser({ ...user, projects: newData });
  };

  return (
    <PageWrapper>
      <Wrapper>
        <div className={`wrapper ${loading ? 'loading' : ''}`}>
          {!loading && user && (
            <>
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

              <div className="section">
                <div className="title">
                  Projects ({user.projects.length})
                </div>
                <div className="cards">
                  {user.projects.map(project => (
                    <Project
                      key={project.id}
                      project={project}
                      className="project"
                      onLike={(id, value) => like(id, value)}
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
