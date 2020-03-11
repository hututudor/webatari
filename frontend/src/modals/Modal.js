import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const Modal = ({ children, visible }) => {
  return (
    <>
      {visible && (
        <Wrapper>
          <div className="container">
            {children}
          </div>
        </Wrapper>
      )}
    </>
  );
};

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

export default Modal;
