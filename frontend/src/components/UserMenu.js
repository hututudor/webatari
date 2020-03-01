import React, { useContext, useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { NavLink, useHistory } from 'react-router-dom';

import AuthContext from '../utils/AuthContext';
import { colors } from '../config/theme';

const UserMenu = () => {
  const authContext = useContext(AuthContext.Context);
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const ref = useRef();

  const closeMenu = () => {
    setOpen(false);
  };

  const toggleMenu = () => {
    setOpen(!open);
  };

  const logout = () => {
    authContext.logout();
    history.push('/');
  };

  const handleClick = e => {
    if (ref.current.contains(e.target)) {
      return;
    }

    closeMenu();
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  return (
    <Wrapper ref={ref}>
      <div className="header" onClick={toggleMenu}>
        {authContext.state.user.name.split(' ')[0]}{' '}
        <i className={`material-icons ${open ? 'rotate' : ''}`}>
          keyboard_arrow_down
        </i>
      </div>
      <div className={`menu ${open ? '' : 'closed'}`}>
        <NavLink className="link" exact to="/profile">
          Profile
        </NavLink>
        <NavLink className="link" exact to="/settings">
          Settings
        </NavLink>
        <div className="link red" onClick={logout}>
          Logout
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  //background: red;

  display: flex;
  flex-direction: column;
  align-content: flex-start;

  .header {
    padding: 0 16px;
    cursor: pointer;
    min-width: 100px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: ${colors.cool_grey_700};
    }

    i {
      font-size: 24px;
      transition: all 0.15s;

      &.rotate {
        transform: rotate(-180deg);
      }
    }
  }

  .menu {
    transition: all 0.15s;
    opacity: 1;

    &.closed {
      opacity: 0;
    }
  }

  .link {
    background: ${colors.cool_grey_800};
    height: 48px;
    padding: 0 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    color: ${colors.cool_grey_050};

    &.active {
      background: ${colors.cool_grey_800} !important;
    }

    &.red {
      color: ${colors.red_vivid_500};
    }

    &:hover {
      background: ${colors.cool_grey_700} !important;
    }
  }
`;

export default UserMenu;
