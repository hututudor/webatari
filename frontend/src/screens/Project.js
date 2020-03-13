import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { useParams, useHistory } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';
import dasm from 'dasm';
import { toast } from 'react-toastify';
import axios from 'axios';

import PageWrapper from '../components/PageWrapper';
import {
  DangerButton,
  PrimaryButton,
  WarningButton
} from '../components/Button';
import { colors } from '../config/theme';
import AuthContext from '../utils/AuthContext';
import config from '../config/config';
import DeleteProjectModal from '../modals/DeleteProjectModal';
import EditProjectModal from '../modals/EditProjectModal';

const Project = () => {
  const authContext = useContext(AuthContext.Context);
  const [project, setProject] = useState(null);
  const [oldCode, setOldCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [compiling, setCompiling] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    getProject();
  }, []);

  const getProject = async () => {
    try {
      const res = await axios.get(config.serverUrl + '/projects/' + id);
      const project = res.data.project;
      setProject(project);
      setOldCode(project.code);
      setLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  const hasCodeChanged = () => {
    return oldCode !== project.code;
  };

  const compile = async () => {
    setCompiling(true);
    const result = dasm(project.code, {
      format: 3,
      quick: true,
      machine: 'atari2600'
    });
    const ROM = result.data;
    console.log(ROM);
    console.log(result.exitStatus);

    if (result.exitStatus) {
      console.error(result.output);
      toast.error('Compilation failed!');
      toast.error(result.output[2]);
      return false;
    }

    const data = ROM;

    try {
      await axios.post(
        config.serverUrl + '/projects/compile/' + project.uuid,
        {
          data
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
    } catch (e) {
      console.error(e);
    }

    toast.success('Compiled!');
    setCompiling(false);
    return true;
  };

  const run = async () => {
    let open = true;

    if (hasCodeChanged()) {
      open = await compile();
    }

    if (open) {
      window.open(
        `https://javatari.org?ROM=${config.serverUrl}/roms/${project.uuid}`,
        '_blank'
      );
    }
  };

  const save = async () => {
    try {
      toast.success('Saving...');
      setCompiling(true);
      await axios.put(
        config.serverUrl + '/projects/editcode/' + project.uuid,
        {
          code: project.code
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      toast.success('Saved');
      setOldCode(project.code);
      await compile();
    } catch (e) {
      console.error(e);
    }
  };

  const isAuthor = () => {
    return (
      authContext.state.user && authContext.state.user.id === project.user.id
    );
  };

  return (
    <PageWrapper>
      <Wrapper>
        {!loading && project && (
          <>
            {isAuthor() && (
              <>
                <DeleteProjectModal
                  visible={deleteModalOpen}
                  onClose={() => setDeleteModalOpen(false)}
                  project={project}
                />
                <EditProjectModal
                  visible={editModalOpen}
                  onClose={() => {
                    setEditModalOpen(false);
                  }}
                  onDone={({ name, description }) => {
                    setEditModalOpen(false);
                    setProject({ ...project, name, description });
                  }}
                  project={project}
                />
              </>
            )}
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
                <span className="title">By </span>
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
                    <PrimaryButton disabled={!hasCodeChanged()} onClick={save}>
                      Save
                    </PrimaryButton>
                    <WarningButton onClick={() => setEditModalOpen(true)}>
                      Edit
                    </WarningButton>
                    <DangerButton onClick={() => setDeleteModalOpen(true)}>
                      Delete
                    </DangerButton>
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

      > .title {
        color: ${colors.cool_grey_050};

        :hover {
          color: ${colors.cool_grey_050};
        }
      }

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
    font-family: 'Press Start 2P', serif !important;
    line-height: 1.5 !important;
    font-size: 12px;
  }
`;

export default Project;
