import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { useParams, useHistory } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';

import PageWrapper from '../components/PageWrapper';
import {
  DangerButton,
  PrimaryButton,
  WarningButton
} from '../components/Button';
import { colors } from '../config/theme';
import { getProjectAsync } from '../mocks/projects';

const Project = () => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    getProject();
  }, []);

  const getProject = async () => {
    setProject(await getProjectAsync());
    setLoading(false);
  };

  return (
    <PageWrapper>
      <Wrapper>
        {!loading && project && (
          <>
            <div className="column">
              <CodeMirror
                className="codemirror"
                options={{
                  mode: '6502',
                  theme: 'ayu-mirage',
                  lineNumbers: true
                }}
                onBeforeChange={(editor, data, value) => {
                  setProject({ ...project, code: data });
                }}
                value={project.code}
              />
            </div>
            <div className="column margin">
              <div className="name">{project.name}</div>
              <div
                className="author"
                onClick={() => history.push(`/user/${project.user.id}`)}
              >
                {project.user.name}
              </div>
              <div className="description">{project.description}</div>
              <div className="divider" />
              <div className="buttons">
                <div className="row">
                  <PrimaryButton>Run</PrimaryButton>
                </div>
                <div className="row">
                  <PrimaryButton disabled={false}>Save</PrimaryButton>
                  <WarningButton>Edit</WarningButton>
                  <DangerButton>Delete</DangerButton>
                </div>
              </div>
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
        {!loading && !project && (
          <div className="empty">This project does not seem to exist.</div>
        )}
      </Wrapper>
    </PageWrapper>
  );
};

const Wrapper = styled.div`
  margin: 64px 128px;
  width: calc(100% - 2 * 128px);
  height: calc(100vh - 2 * 48px - 2 * 64px);
  display: flex;
  justify-content: space-around;

  .column {
    width: 50%;

    &.margin {
      margin: 32px 64px;
    }

    > .name {
      color: ${colors.blue_vivid_100};
      font-size: 24px;
      padding-bottom: 8px;
    }

    > .author {
      color: ${colors.cool_grey_100};
      cursor: pointer;
      padding-bottom: 20px;

      :hover {
        color: ${colors.cool_grey_200};
      }
    }

    > .description {
    }

    > .divider {
      margin-top: 40px;
    }

    > .buttons {
      > .row {
        display: flex;
        flex-direction: row;
      }
    }
  }

  .codemirror,
  .codemirror > div {
    height: 100% !important;
  }
`;

export default Project;
