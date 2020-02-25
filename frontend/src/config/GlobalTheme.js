import { createGlobalStyle } from 'styled-components';
import { colors } from '../config/theme';

export const GlobalStyle = createGlobalStyle`
  * {
    user-select: none;
  }

  html {
    height: 100%;
    scroll-behavior: smooth;
  }
  
  body {
    height: 100%;
    margin: 0;
    padding: 0;
    font-family: "Press Start 2P", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
    width: 100%;
    box-sizing: border-box;

    background: ${colors.cool_grey_900};
    color: ${colors.cool_grey_050};
  }
  
  input, button {
    font-family: "Press Start 2P", sans-serif;   
  }
`;
