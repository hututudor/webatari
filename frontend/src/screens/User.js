import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { PulseLoader } from 'react-spinners';
import { useParams, useHistory } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';

import PageWrapper from '../components/PageWrapper';
import Project from '../components/Project';
import { colors } from '../config/theme';
import config from '../config/config';
import { PrimaryButton } from '../components/Button';
import AddProjectModal from '../modals/AddProjectModal';
import EditCommentModal from '../modals/EditCommentModal';
import DeleteCommentModal from '../modals/DeleteCommentModal';
import Comment from '../components/Comment';
import AuthContext from '../utils/AuthContext';
import { likeComment } from '../utils/likeComment';

const User = () => {
  const [addModalOpen, setAddModalOpen] = useState(false);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);

  const [editCommentModalOpen, setEditCommentModalOpen] = useState(false);
  const [editCommentModalData, setEditCommentModalData] = useState({});

  const [deleteCommentModalOpen, setDeleteCommentModalOpen] = useState(false);
  const [deleteCommentModalData, setDeleteCommentModalData] = useState('');

  const { id } = useParams();
  const history = useHistory();

  const authContext = useContext(AuthContext.Context);

  useEffect(() => {
    getUser();
    getComments();
  }, [id]);

  const getUser = async () => {
    try {
      setLoading(true);
      const [userRes, projectsRes] = await Promise.all([
        axios.get(config.serverUrl + '/user/' + id),
        axios.get(config.serverUrl + '/projects/user/' + id, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
      ]);
      const user = userRes.data.user;
      const projects = projectsRes.data.projects;
      setUser({ ...user, projects });
      setLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  const getComments = async () => {
    try {
      const res = await axios.get(config.serverUrl + '/comments/user/' + id);
      setComments(res.data.comments);
      setLoadingComments(false);
    } catch (e) {
      console.error(e);
      setLoadingComments(false);
    }
  };

  const like = async (projectId, value) => {
    if (!authContext.isLoggedIn()) return;

    const index = user.projects.findIndex(
      (project) => project.uuid === projectId
    );

    if (index === -1) return;

    const newData = [...user.projects];
    newData[index].liked = value;

    if (!value) {
      newData[index].likes--;
    } else {
      newData[index].likes++;
    }

    setUser({ ...user, projects: newData });

    try {
      let url = '';
      if (value) {
        url = config.serverUrl + '/projects/like/' + projectId;
      } else {
        url = config.serverUrl + '/projects/dislike/' + projectId;
      }

      await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
    } catch (e) {
      console.error(e);
    }
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
            newComments[commentIndex].edited = true;

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
        <div className={`wrapper ${loading ? 'loading' : ''}`}>
          {!loading && user && (
            <>
              <AddProjectModal
                visible={addModalOpen}
                onClose={() => setAddModalOpen(false)}
                onDone={(id) => {
                  setAddModalOpen(false);
                  history.push('/project/' + id);
                }}
              />
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

              {authContext.isLoggedIn() &&
                authContext.state.user.id === user.id && (
                  <div className="section-button">
                    <PrimaryButton
                      width="400px"
                      onClick={() => setAddModalOpen(true)}
                    >
                      Create project
                    </PrimaryButton>
                  </div>
                )}

              <div className="section">
                <div className="title">Projects ({user.projects.length})</div>
                <div className="cards">
                  {user.projects.map((project) => (
                    <Project
                      key={project.id}
                      project={project}
                      className="project"
                      onLike={(projectId, value) => like(projectId, value)}
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

          <div className={`comms ${loadingComments ? 'loading' : ''}`}>
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

            {loadingComments && (
              <PulseLoader
                size={16}
                loading={true}
                color={colors.cool_grey_050}
                className="loader"
              />
            )}
            {!loadingComments && comments.length === 0 && (
              <div className="comments">
                <div className="title">Comments ({comments.length})</div>
                <div className="empty">
                  This user does not have any comments.
                </div>
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
          </div>
        </div>
      </Wrapper>
    </PageWrapper>
  );
};

const Wrapper = styled.div`
  .comms {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  .comments > div {
    margin-bottom: 16px;
  }

  .comments > .title {
    font-size: 24px;
    margin-bottom: 24px;
  }

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

    &-button {
    }

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
