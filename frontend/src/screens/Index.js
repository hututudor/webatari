import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { PulseLoader } from 'react-spinners';
import axios from 'axios';

import PageWrapper from '../components/PageWrapper';
import Hero from '../components/Hero';
import Project from '../components/Project';
import { colors } from '../config/theme';
import config from '../config/config';

const Index = () => {
  const [trendingProjects, setTrendingProjects] = useState(null);
  const [trendingLoading, setTrendingLoading] = useState(true);

  const [newProjects, setNewProjects] = useState(null);
  const [newLoading, setNewLoading] = useState(true);

  const [discoverProjects, setDiscoverProjects] = useState(null);
  const [discoverLoading, setDiscoverLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getTrendingProjects(),
      getNewProjects(),
      getDiscoverProjects()
    ]);
  }, []);

  const getTrendingProjects = async () => {
    try {
      const res = await axios.get(config.serverUrl + '/projects/trending', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTrendingProjects(res.data.projects);
      setTrendingLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  const getNewProjects = async () => {
    try {
      const res = await axios.get(config.serverUrl + '/projects/new', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNewProjects(res.data.projects);
      setNewLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  const getDiscoverProjects = async () => {
    try {
      const res = await axios.get(config.serverUrl + '/projects/random', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setDiscoverProjects(res.data.projects);
      setDiscoverLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  const like = async (type, id, value) => {
    const data =
      type === 'trending'
        ? trendingProjects
        : type === 'new'
        ? newProjects
        : discoverProjects;

    const index = data.findIndex(project => project.uuid === id);

    if (index === -1) return;

    const newData = [...data];
    newData[index].liked = value;

    if (!value) {
      newData[index].likes--;
    } else {
      newData[index].likes++;
    }

    if (type === 'trending') {
      setTrendingProjects(newData);
    } else if (type === 'new') {
      setNewProjects(newData);
    } else {
      setDiscoverProjects(newData);
    }

    try {
      let url = '';
      if (value) {
        url = config.serverUrl + '/projects/like/' + id;
      } else {
        url = config.serverUrl + '/projects/dislike/' + id;
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
        <Hero />

        <div className="section">
          <div className="title">Trending projects</div>
          <div className="cards">
            {!trendingLoading &&
              trendingProjects &&
              trendingProjects.map(project => (
                <Project
                  key={project.id}
                  project={project}
                  className="project"
                  onLike={(id, value) => like('trending', id, value)}
                />
              ))}
            {trendingLoading && (
              <PulseLoader
                size={16}
                loading={true}
                color={colors.cool_grey_050}
              />
            )}
            {((!trendingLoading && !trendingProjects) ||
              (!trendingLoading && !trendingProjects.length)) && (
              <div className="empty">
                Looks kind of empty. How about you create a project yourself?
              </div>
            )}
          </div>
        </div>

        <div className="section">
          <div className="title">New projects</div>
          <div className="cards">
            {!newLoading &&
              newProjects &&
              newProjects.map(project => (
                <Project
                  key={project.id}
                  project={project}
                  className="project"
                  onLike={(id, value) => like('new', id, value)}
                />
              ))}
            {newLoading && (
              <PulseLoader
                size={16}
                loading={true}
                color={colors.cool_grey_050}
              />
            )}
            {((!newLoading && !newProjects) ||
              (!newLoading && !newProjects.length)) && (
              <div className="empty">
                Looks kind of empty. How about you create a project yourself?
              </div>
            )}
          </div>
        </div>

        <div className="section">
          <div className="title">Discover projects</div>
          <div className="cards">
            {!discoverLoading &&
              discoverProjects &&
              discoverProjects.map(project => (
                <Project
                  key={project.id}
                  project={project}
                  className="project"
                  onLike={(id, value) => like('discover', id, value)}
                />
              ))}
            {discoverLoading && (
              <PulseLoader
                size={16}
                loading={true}
                color={colors.cool_grey_050}
              />
            )}
            {((!discoverLoading && !discoverProjects) ||
              (!discoverLoading && !discoverProjects.length)) && (
              <div className="empty">
                Looks kind of empty. How about you create a project yourself?
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

export default Index;
