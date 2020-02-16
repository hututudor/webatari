import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { colors } from '../config/theme';

const Navbar = () => (
  <Wrapper>
    <div className="group links">
      <NavLink className="link" exact to="/">
        Home
      </NavLink>
      <NavLink className="link" exact to="/about">
        About
      </NavLink>
    </div>
    <div className="group auth">
      <NavLink className="link" exact to="/register">
        Register
      </NavLink>
      <NavLink className="link" exact to="/login">
        Login
      </NavLink>
    </div>
  </Wrapper>
);

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 48px;
  width: calc(100% - 2 * 64px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 64px;
  background: ${colors.cool_grey_800};

  .group {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .link {
    height: 48px;
    padding: 0 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    color: ${colors.cool_grey_050};
    
    &.active {
      background: ${colors.cool_grey_900};
    }

    &:hover:not(.active) {
      background: ${colors.cool_grey_700};
    }
  }
`;

export default Navbar;
