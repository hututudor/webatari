import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { PulseLoader } from 'react-spinners';
import axios from 'axios';

import PageWrapper from '../components/PageWrapper';
import Hero from '../components/Hero';
import User from '../components/User';
import { colors } from '../config/theme';
import config from '../config/config';
import AuthContext from '../utils/AuthContext';

const Index = () => {
  const authContext = useContext(AuthContext.Context);

  const [stats, setStats] = useState({});
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    getStats();
  }, []);

  const getStats = async () => {
    try {
      const res = await axios.get(config.serverUrl + '/stats', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setStats(res.data.stats);
      setStatsLoading(false);
    } catch (e) {
      setStatsLoading(false);
      console.error(e);
    }
  };

  return (
    <PageWrapper>
      <Wrapper>
        <div className="section">
          {!statsLoading && stats && (
            <>
              <div className="title">
                What has our community accomplished so far?
              </div>
              <div className="cards">
                <div className="row">
                  <div className="card">
                    <div className="title">{stats.lines || 0}</div>
                    <div className="description">Lines of code written</div>
                  </div>
                  <div className="card">
                    <div className="title">{stats.users || 0}</div>
                    <div className="description">Users in total</div>
                  </div>
                </div>
                <div className="row">
                  <div className="card">
                    <div className="title">{stats.projects || 0}</div>
                    <div className="description">Projects in total</div>
                  </div>
                  <div className="card">
                    <div className="title">{stats.dailyprojects || 0}</div>
                    <div className="description">Projects today</div>
                  </div>
                  <div className="card">
                    <div className="title">{stats.weeklyprojects || 0}</div>
                    <div className="description">Projects weekly</div>
                  </div>
                </div>
                <div className="row">
                  <div className="card">
                    <div className="title">{stats.comments || 0}</div>
                    <div className="description">Comments in total</div>
                  </div>
                  <div className="card">
                    <div className="title">{stats.dailycomments || 0}</div>
                    <div className="description">Comments today</div>
                  </div>
                  <div className="card">
                    <div className="title">{stats.weeklycomments || 0}</div>
                    <div className="description">Comments this week</div>
                  </div>
                </div>
              </div>
            </>
          )}
          {statsLoading && (
            <PulseLoader
              size={16}
              loading={true}
              color={colors.cool_grey_050}
            />
          )}
        </div>
      </Wrapper>
    </PageWrapper>
  );
};

const Wrapper = styled.div`
  .row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 32px;
  }

  .card {
    padding: 24px;
    background: ${colors.cool_grey_800};
    text-align: center;
    width: 100%;
    margin: 16px;

    > .title {
      margin-bottom: 16px;
      color: ${colors.blue_vivid_100};
      font-size: 32px;
    }
  }

  .title {
    text-align: center;
    padding-bottom: 32px;
  }

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

export default Index;
