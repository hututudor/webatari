import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { Formik } from 'formik';
import axios from 'axios';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { colors } from '../config/theme';
import heart_black from '../assets/heart_black.svg';
import heart_red from '../assets/heart_red.svg';

const Project = ({ project, className, onLike }) => {
  const history = useHistory();

  return (
    <Wrapper className={className}>
      <div
        className="title"
        onClick={() => history.push(`/project/${project.uuid}`)}
      >
        {project.name}
      </div>
      <div className="description">{project.description}</div>
      <div className="footer">
        <div
          className="user"
          onClick={() => history.push(`/user/${project.user.id}`)}
        >
          <span className="user-profile">{project.user.name}</span>,{' '}
          {moment(project.created_at).fromNow()}
        </div>
        <div
          className="likes"
          onClick={() => onLike(project.uuid, !project.liked)}
        >
          <img
            className="heart"
            src={project.liked ? heart_red : heart_black}
            alt="heart"
          />
          {project.likes}
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 16px;
  background: ${colors.cool_grey_800};

  .title {
    color: ${colors.blue_vivid_100};
    margin-bottom: 8px;
    cursor: pointer;

    :hover {
      color: ${colors.blue_vivid_200};
    }
  }

  .description {
    margin-bottom: 12px;
  }

  > .footer {
    display: flex;
    align-items: center;

    > .user {
      margin-right: 20px;

      > .user-profile {
        cursor: pointer;

        :hover {
          color: ${colors.cool_grey_200};
        }
      }
    }

    > .likes {
      display: flex;
      cursor: pointer;
      align-items: center;

      > .heart {
        margin-right: 6px;
        height: 24px;
        width: 24px;

        fill: ${colors.cool_grey_900};
      }
    }
  }
`;

Project.propTypes = {
  project: PropTypes.object.isRequired,
  className: PropTypes.string,
  onLike: PropTypes.func.isRequired,
};

Project.defaultProps = {
  className: '',
};

export default Project;
