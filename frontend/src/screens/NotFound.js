import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import PageWrapper from '../components/PageWrapper';
import { colors } from '../config/theme';

const NotFound = () => (
  <PageWrapper>
    <Wrapper>
      <div className="title">404</div>
      <div className="description">
        Oops... looks like we don't have what you're looking for.
      </div>
      <Link to="/" className="button">
        Go Home
      </Link>
    </Wrapper>
  </PageWrapper>
);

const Wrapper = styled.div`
  width: 100%;
  height: calc(100vh - 2 * 48px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .title {
    color: ${colors.yellow_vivid_100};
    margin-bottom: 24px;
    font-size: 32px;
  }

  .button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 192px;
    height: 48px;
    margin-top: 32px;
    border: none;
    outline: none;
    background: ${colors.blue_vivid_700};
    color: ${colors.blue_vivid_050};
    font-size: 16px;
    cursor: pointer;
    text-decoration: none;

    :active {
      background: ${colors.blue_vivid_800};
    }
  }
`;

export default NotFound;
