import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { PulseLoader } from 'react-spinners';
import axios from 'axios';

import PageWrapper from '../components/PageWrapper';
import User from '../components/User';
import { colors } from '../config/theme';
import config from '../config/config';

const Leaderboard = () => {
  const [likedUsers, setLikedUsers] = useState(null);
  const [likedUsersLoading, setLikedUsersLoading] = useState(true);

  useEffect(() => {
    Promise.all([getTrendingProjects()]);
  }, []);

  const getTrendingProjects = async () => {
    try {
      const res = await axios.get(config.serverUrl + '/leaderboard', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setLikedUsers(res.data.sort);
      setLikedUsersLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <PageWrapper>
      <Wrapper>
        <div className="section">
          <div className="title">Most liked users</div>
          <div className="cards">
            {!likedUsersLoading &&
              likedUsers &&
              likedUsers.map((user) => (
                <User key={user.id} user={user} className="project" />
              ))}
            {likedUsersLoading && (
              <PulseLoader
                size={16}
                loading={true}
                color={colors.cool_grey_050}
              />
            )}
            {((!likedUsersLoading && !likedUsers) ||
              (!likedUsersLoading && !likedUsers.length)) && (
              <div className="empty">
                Looks kind of empty. How about you create an account?
              </div>
            )}
          </div>
        </div>
      </Wrapper>
    </PageWrapper>
  );
};

const Wrapper = styled.div`
  .section {
    margin: 64px 256px;
    width: calc(100% - 2 * 256px);
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

    > .cards > .project {
      margin-bottom: 16px;
    }
  }
`;

export default Leaderboard;
