import React from 'react';
import styled from 'styled-components';
import { colors } from '../config/theme';

const Footer = () => <Wrapper>Copyright &copy; 2020 NuLL</Wrapper>;

const Wrapper = styled.div`
  height: 48px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  background: ${colors.cool_grey_800};
`;

export default Footer;
