import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { PulseLoader } from 'react-spinners';

import PageWrapper from '../components/PageWrapper';
import Hero from '../components/Hero';
import { getProjectsAsync } from '../mocks/projects';
import Project from '../components/Project';
import { colors } from '../config/theme';
import User from '../components/User';
import { getUsersAsync } from '../mocks/user';
import Input from '../components/Input';

const Index = () => {
  const [projects, setProjects] = useState([]);
  const [projectsloading, setProjectsLoading] = useState(false);

  const [users, setUsers] = useState([]);
  const [usersLoading, setUserLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');

  const search = async term => {
    await Promise.all([getProjects(term), getUsers(term)]);
  };

  const getProjects = async term => {
    setProjectsLoading(true);
    setProjects(await getProjectsAsync(10));
    setProjectsLoading(false);
  };

  const getUsers = async term => {
    setUserLoading(true);
    setUsers(await getUsersAsync(10));
    setUserLoading(false);
  };

  const like = (type, id, value) => {
    const index = projects.findIndex(project => project.id === id);

    if (index === -1) return;

    const newData = [...projects];
    newData[index].liked = value;

    if (!value) {
      newData[index].likes--;
    } else {
      newData[index].likes++;
    }

    setProjects(newData);
  };

  return (
    <PageWrapper>
      <Wrapper>
        <div className="header">
          <div className="inputs">
            <Input
              onKeyPress={e => (e.key === 'Enter' ? search(searchTerm) : null)}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search ..."
            />
          </div>
        </div>
        <div className="section">
          <div className="title">Projects</div>
          <div className="cards">
            {!projectsloading &&
              projects &&
              projects.map(project => (
                <Project
                  key={project.id}
                  project={project}
                  className="project"
                  onLike={(id, value) => like('trending', id, value)}
                />
              ))}
            {projectsloading && (
              <PulseLoader
                size={16}
                loading={true}
                color={colors.cool_grey_050}
              />
            )}
            {((!projectsloading && !projects) ||
              (!projectsloading && !projects.length)) && (
              <div className="empty">Nothing found!</div>
            )}
          </div>
        </div>

        <div className="section">
          <div className="title">Users</div>
          <div className="cards">
            {!usersLoading &&
              users &&
              users.map(user => (
                <User key={user.id} user={user} className="project" />
              ))}
            {usersLoading && (
              <PulseLoader
                size={16}
                loading={true}
                color={colors.cool_grey_050}
              />
            )}
            {((!usersLoading && !users) ||
              (!usersLoading && !users.length)) && (
              <div className="empty">Nothing found!</div>
            )}
          </div>
        </div>
      </Wrapper>
    </PageWrapper>
  );
};

const Wrapper = styled.div`
  .header {
    margin: 64px 256px -32px;
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
