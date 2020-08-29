import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

import { colors } from '../config/theme';
import heart_black from '../assets/heart_black.svg';
import heart_red from '../assets/heart_red.svg';
import edit from '../assets/edit.svg';
import remove from '../assets/delete.svg';

const Comment = ({ comment, className, onLike, onEdit, onDelete }) => {
  const history = useHistory();

  return (
    <Wrapper className={className}>
      <div className="description">{comment.description}</div>
      <div className="footer">
        <div
          className="user"
          onClick={() => history.push(`/user/${comment.user.id}`)}
        >
          <span className="user-profile">{comment.user.name}</span>,{' '}
          {moment(comment.created_at).fromNow()}
        </div>
        <div
          className="likes"
          onClick={() => onLike(comment.id, !comment.liked)}
        >
          <img
            className="heart"
            src={comment.liked ? heart_red : heart_black}
            alt="heart"
          />
          {comment.likes}
        </div>
        <div className="edit" onClick={onEdit}>
          <img className="edit-icon" src={edit} alt="edit" />
        </div>
        <div className="delete" onClick={onDelete}>
          <img className="delete-icon" src={remove} alt="delete" />
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 16px;
  background: ${colors.cool_grey_800};
  width: calc(100% - 32px);

  .description {
    margin-bottom: 12px;
    color: ${colors.blue_vivid_200};
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

    > .edit {
      margin-left: 20px;
      display: flex;
      cursor: pointer;
      align-items: center;

      > .edit-icon {
        margin-right: 6px;
        height: 20px;
        width: 20px;

        fill: ${colors.cool_grey_900};
      }
    }

    > .delete {
      margin-left: 10px;
      display: flex;
      cursor: pointer;
      align-items: center;

      > .delete-icon {
        margin-right: 6px;
        height: 20px;
        width: 20px;

        fill: ${colors.cool_grey_900};
      }
    }
  }
`;

Comment.propTypes = {
  comment: PropTypes.object.isRequired,
  className: PropTypes.string,
  onLike: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

Comment.defaultProps = {
  className: '',
};

export default Comment;
