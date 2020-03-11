import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { PulseLoader } from 'react-spinners';
import { useParams } from 'react-router-dom';
import moment from 'moment';

import PageWrapper from '../components/PageWrapper';
import Project from '../components/Project';
import { colors } from '../config/theme';
import { getUser, getUserAsync } from '../mocks/user';

const About = () => (
  <PageWrapper>
    <Wrapper>
      <div className="title">What is this?</div>
      <div className="content">
        This project was build during FiiCode 2020 contest. This is an app
        dedicated for old-school programmers and gamers who want to remember the
        old times by building games for the Atari 2600 game console.
      </div>
      <div className="title">How to start?</div>
      <div className="content">
        We recommend you to do a quick Google search about Atari 2600 Assembly
        language. After that, you can start engaging in our community.
      </div>
    </Wrapper>
  </PageWrapper>
);

const Wrapper = styled.div`
  margin: 64px 256px;
  width: calc(100% - 2 * 256px);

  > .title {
    font-size: 24px;
    margin-bottom: 8px;
    color: ${colors.blue_vivid_100};
  }

  .content {
    margin-bottom: 36px;
  }
`;

export default About;
