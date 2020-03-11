import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { useParams, useHistory } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';
import dasm from 'dasm';
import { toast } from 'react-toastify';

import PageWrapper from '../components/PageWrapper';
import {
  DangerButton,
  PrimaryButton,
  WarningButton
} from '../components/Button';
import { colors } from '../config/theme';
import { getProjectAsync } from '../mocks/projects';
import AuthContext from '../utils/AuthContext';
import config from '../config/config';

const Project = () => {
  const authContext = useContext(AuthContext.Context);
  const [project, setProject] = useState(null);
  const [oldCode, setOldCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [compiling, setCompiling] = useState(false);

  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    getProject();
  }, []);

  const getProject = async () => {
    const project = await getProjectAsync();
    setProject(project);
    setOldCode(project.code);
    setLoading(false);
  };

  const hasCodeChanged = () => {
    return oldCode !== project.code;
  };

  const compile = () => {
    try {
      const result = dasm(project.code, {
        format: 3,
        quick: true,
        machine: 'atari2600'
      });
      const ROM = result.data;
      console.log(ROM);
    } catch (e) {
      console.error(e);
      toast.error('Compilation failed!');
    }
  };

  const run = () => {
    if (hasCodeChanged()) {
      setCompiling(true);
      compile();
      setCompiling(false);
    }

    window.open(
      `https://javatari.org?ROM=${config.serverUrl}/roms/${project.id}.rom`,
      '_blank'
    );
  };

  const isAuthor = () => {
    return (
      // authContext.state.user && authContext.state.user.id === project.user.id
      true
    );
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
                  lineNumbers: true,
                  readOnly: !isAuthor()
                }}
                onBeforeChange={(editor, data, value) => {
                  setProject({ ...project, code: value });
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
                  <PrimaryButton onClick={run} disabled={compiling}>
                    {hasCodeChanged() && 'Compile & '} Run
                  </PrimaryButton>
                </div>
                {isAuthor() && (
                  <div className="row">
                    <PrimaryButton disabled={false}>Save</PrimaryButton>
                    <WarningButton>Edit</WarningButton>
                    <DangerButton>Delete</DangerButton>
                  </div>
                )}
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
