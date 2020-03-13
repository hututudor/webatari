import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import { colors } from '../config/theme';

const User = ({ user, className }) => {
  const history = useHistory();

  return (
    <Wrapper className={className}>
      <div className="title" onClick={() => history.push(`/user/${user.id}`)}>
        {user.name}
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
`;

User.propTypes = {
  user: PropTypes.object.isRequired,
  className: PropTypes.string
};

User.defaultProps = {
  className: ''
};

export default User;
