import React from 'react';
import styled from 'styled-components';

import { colors } from '../config/theme';
import Logo from './Logo';

const Hero = () => (
  <Wrapper>
    <div>
      <Logo size={64} />
      <div>Combining modern web interaction with old-school Atari 2600 programming.</div>
    </div>
  </Wrapper>
);

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 256px;
  background: ${colors.blue_vivid_900};

  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  div:nth-child(2) {
    margin-top: 16px;
  }
`;

export default Hero;
