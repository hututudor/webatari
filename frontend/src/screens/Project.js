import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { useParams, useHistory } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';
import dasm from 'dasm';
import { toast } from 'react-toastify';
import axios from 'axios';
import * as Yup from 'yup';
import { Formik } from 'formik';

import PageWrapper from '../components/PageWrapper';
import {
  DangerButton,
  PrimaryButton,
  WarningButton,
} from '../components/Button';
import TextArea from '../components/TextArea';
import Comment from '../components/Comment';
import { colors } from '../config/theme';
import AuthContext from '../utils/AuthContext';
import config from '../config/config';
import DeleteProjectModal from '../modals/DeleteProjectModal';
import EditProjectModal from '../modals/EditProjectModal';
import EditCommentModal from '../modals/EditCommentModal';
import DeleteCommentModal from '../modals/DeleteCommentModal';
import { likeComment } from '../utils/likeComment';
import CloneProjectModal from '../modals/CloneProjectModal';

const validationSchema = Yup.object().shape({
  comment: Yup.string().required('Comment is required'),
});

const Project = () => {
  const authContext = useContext(AuthContext.Context);
  const [project, setProject] = useState(null);
  const [comments, setComments] = useState([]);
  const [oldCode, setOldCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [compiling, setCompiling] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [cloneModalOpen, setCloneModalOpen] = useState(false);

  const [editCommentModalOpen, setEditCommentModalOpen] = useState(false);
  const [editCommentModalData, setEditCommentModalData] = useState({});

  const [deleteCommentModalOpen, setDeleteCommentModalOpen] = useState(false);
  const [deleteCommentModalData, setDeleteCommentModalData] = useState('');

  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    getProject();
    getComments();
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

  const getComments = async () => {
    try {
      const res = await axios.get(config.serverUrl + '/comments/project/' + id);
      setComments(res.data.comments);
      setLoadingComments(false);
    } catch (e) {
      console.error(e);
      setLoadingComments(false);
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
      machine: 'atari2600',
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
          data,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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

  const clone = () => {};

  const save = async () => {
    try {
      toast.success('Saving...');
      setCompiling(true);
      await axios.put(
        config.serverUrl + '/projects/editcode/' + project.uuid,
        {
          code: project.code,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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

  const onSubmit = async (values, { setSubmitting, setValues }) => {
    setSubmitting(true);

    try {
      const res = await axios.post(
        config.serverUrl + `/comments`,
        {
          description: values.comment,
          id: project.id,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      const newComments = [
        { ...res.data.comment, user: authContext.state.user },
        ...comments,
      ];
      setComments(newComments);

      toast.success('Comment added!');
    } catch (e) {
      console.error(e);
      toast.error('Something went wrong, please try again');
    }

    setValues('comment', '');
    setSubmitting(false);
  };

  const handleCommentEdit = (comment) => () => {
    setEditCommentModalData(comment);
    setEditCommentModalOpen(true);
  };

  const handleCommentDelete = (comment) => () => {
    console.log('del');
    setDeleteCommentModalData(comment);
    setDeleteCommentModalOpen(true);
  };

  return (
    <PageWrapper>
      <Wrapper>
        <EditCommentModal
          visible={editCommentModalOpen}
          onClose={() => {
            setEditCommentModalOpen(false);
          }}
          onDone={({ comment, id }) => {
            setEditCommentModalOpen(false);
            const newComments = [...comments];
            const commentIndex = comments.findIndex((comm) => comm.id === id);

            if (commentIndex === -1) {
              return;
            }

            newComments[commentIndex].description = comment;

            setComments([...newComments]);
          }}
          comment={editCommentModalData}
        />

        <DeleteCommentModal
          visible={deleteCommentModalOpen}
          onClose={() => setDeleteCommentModalOpen(false)}
          onDone={({ comment, id }) => {
            setDeleteCommentModalOpen(false);
            const newComments = [...comments].filter(
              (comm) => comment.id !== comm.id
            );
            setComments([...newComments]);
          }}
          comment={deleteCommentModalData}
        />

        {!loading && project && (
          <>
            {authContext.isLoggedIn() && (
              <CloneProjectModal
                visible={cloneModalOpen}
                onClose={() => {
                  setCloneModalOpen(false);
                }}
                onDone={({ name, description }) => {
                  setCloneModalOpen(false);
                }}
                project={project}
              />
            )}
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
                  readOnly: !isAuthor(),
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
                {authContext.isLoggedIn() && (
                  <div className="row">
                    <PrimaryButton
                      onClick={clone}
                      onClick={() => setCloneModalOpen(true)}
                    >
                      Clone project
                    </PrimaryButton>
                  </div>
                )}
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
              <div className="add-comment">
                <Formik
                  initialValues={{
                    name: '',
                    email: '',
                  }}
                  enableReinitialize={true}
                  onSubmit={onSubmit}
                  validationSchema={validationSchema}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                  }) => (
                    <>
                      <TextArea
                        autoComplete={false}
                        type="text"
                        placeholder="Comment"
                        name="comment"
                        mb="0"
                        error={touched.comment ? errors.comment : null}
                        value={values.comment}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <div className="actions">
                        <PrimaryButton
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                        >
                          Post your comment
                        </PrimaryButton>
                      </div>
                    </>
                  )}
                </Formik>
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
      <CommentsWrapper>
        {loadingComments && (
          <PulseLoader
            size={16}
            loading={true}
            color={colors.cool_grey_050}
            className="loader"
          />
        )}
        {!loadingComments && comments.length === 0 && (
          <div className="empty">
            This project does not seem to have any comments.
          </div>
        )}
        {!loadingComments && comments.length !== 0 && (
          <div className="comments">
            <div className="title">Comments ({comments.length})</div>
            {comments.map((comment) => (
              <Comment
                comment={comment}
                onLike={likeComment(comments, setComments)}
                onEdit={handleCommentEdit(comment)}
                onDelete={handleCommentDelete(comment)}
              ></Comment>
            ))}
          </div>
        )}
      </CommentsWrapper>
    </PageWrapper>
  );
};

const CommentsWrapper = styled.div`
  margin: 64px 128px;
  width: calc(100% - 2 * 128px);
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  .comments > div {
    margin-bottom: 16px;
  }

  .comments > .title {
    font-size: 24px;
    margin-bottom: 24px;
  }
`;

const Wrapper = styled.div`
  margin: 64px 128px;
  width: calc(100% - 2 * 128px);
  height: calc(100vh - 2 * 48px - 2 * 64px - 150px);
  display: flex;
  justify-content: space-around;

  .add-comment {
    margin-top: 5rem;
  }

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
    height: 600px;
    font-family: 'Press Start 2P', serif !important;
    line-height: 1.5 !important;
    font-size: 12px;
  }
`;

export default Project;
