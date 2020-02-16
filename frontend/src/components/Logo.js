import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { colors } from '../config/theme';

const Logo = ({ size }) => (
  <Wrapper size={size}>
    <span>Retro</span>
    <span>Bit</span>
  </Wrapper>
);

const Wrapper = styled.div`
  font-size: ${props => props.size}px;

  span:nth-child(1) {
    color: ${colors.cyan_vivid_900};
  }

  span:nth-child(2) {
    color: ${colors.red_vivid_900};
  }
`;

Logo.propTypes = {
  size: PropTypes.number.isRequired
};

Logo.defaultProps = {
  size: 16
};

export default Logo;
