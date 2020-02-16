import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Navbar from './Navbar';
import Footer from './Footer';

const PageWrapper = ({ children }) => (
  <Wrapper>
    <Navbar />
    <div className="page">{children}</div>
    <Footer />
  </Wrapper>
);

const Wrapper = styled.div`
  .page {
    min-height: calc(100vh - 2 * 48px);
    padding-top: 48px;
  }
`;

PageWrapper.propTypes = {
  children: PropTypes.object.isRequired
};

export default PageWrapper;
