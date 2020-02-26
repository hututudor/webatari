import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { PulseLoader } from 'react-spinners';

import PageWrapper from '../components/PageWrapper';
import Hero from '../components/Hero';
import { getProjectsAsync } from '../mocks/projects';
import Project from '../components/Project';
import { colors } from '../config/theme';

const Index = () => {
  const [trendingProjects, setTrendingProjects] = useState(null);
  const [trendingLoading, setTrendingLoading] = useState(true);

  const [newProjects, setNewProjects] = useState(null);
  const [newLoading, setNewLoading] = useState(true);

  const [discoverProjects, setDiscoverProjects] = useState(null);
  const [discoverLoading, setDiscoverLoading] = useState(true);

  useEffect(() => {
    start();
  }, []);

  const start = async () => {
    setTrendingProjects(await getProjectsAsync(10));
    setTrendingLoading(false);

    setNewProjects(await getProjectsAsync(10));
    setNewLoading(false);

    setDiscoverProjects(await getProjectsAsync(10));
    setDiscoverLoading(false);
  };

  return (
    <PageWrapper>
      <Wrapper>
        <Hero />

        <div className="section trending">
          <div className="title">Trending projects</div>
          <div className="cards">
            {!trendingLoading &&
              trendingProjects &&
              trendingProjects.map(project => (
                <Project
                  key={project.id}
                  project={project}
                  className="project"
                  onLike={() => {}}
                />
              ))}
            {trendingLoading && (
              <PulseLoader
                size={16}
                loading={true}
                color={colors.cool_grey_050}
              />
            )}
          </div>
        </div>

        <div className="section trending">
          <div className="title">New projects</div>
          <div className="cards">
            {!newLoading &&
              newProjects &&
              newProjects.map(project => (
                <Project
                  key={project.id}
                  project={project}
                  className="project"
                  onLike={() => {}}
                />
              ))}
            {newLoading && (
              <PulseLoader
                size={16}
                loading={true}
                color={colors.cool_grey_050}
              />
            )}
          </div>
        </div>

        <div className="section trending">
          <div className="title">Discover projects</div>
          <div className="cards">
            {!discoverLoading &&
              discoverProjects &&
              discoverProjects.map(project => (
                <Project
                  key={project.id}
                  project={project}
                  className="project"
                  onLike={() => {}}
                />
              ))}
            {discoverLoading && (
              <PulseLoader
                size={16}
                loading={true}
                color={colors.cool_grey_050}
              />
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
