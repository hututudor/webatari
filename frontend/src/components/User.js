import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import { colors } from '../config/theme';
import heart_red from '../assets/heart_red.svg';

const User = ({ user, className }) => {
  const history = useHistory();

  return (
    <Wrapper className={className}>
      <div className="title" onClick={() => history.push(`/user/${user.id}`)}>
        {user.name}
      </div>
      <div className="likes">
        <img className="heart" src={heart_red} alt="heart" />
        {user.likes}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 16px;
  background: ${colors.cool_grey_800};

  > .likes {
    display: flex;
    align-items: center;

    > .heart {
      margin-right: 6px;
      height: 24px;
      width: 24px;

      fill: ${colors.cool_grey_900};
    }
  }

  .title {
    color: ${colors.blue_vivid_100};
    margin-bottom: 8px;
    cursor: pointer;

    :hover {
      color: ${colors.blue_vivid_200};
    }
  }
`;

User.propTypes = {
  user: PropTypes.object.isRequired,
  className: PropTypes.string,
  showLikes: PropTypes.bool,
};

User.defaultProps = {
  className: '',
  showLikes: false,
};

export default User;
