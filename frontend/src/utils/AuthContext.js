import React, { useEffect, useState } from 'react';

const AuthContext = React.createContext();

const initialState = {
  user: null,
  token: null
};

const AuthContextProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  const login = ({ user, token }) => {
    setState({ ...state, user, token });
    localStorage.setItem('token', token);
  };

  const update = user => {
    setState({ ...state, user });
  };

  const logout = () => {
    setState(initialState);
    localStorage.removeItem('token');
  };

  const isLoggedIn = () => {
    return !!state.token;
  };

  useEffect(() => {
    if (global.user) {
      login({ user: global.user, token: localStorage.getItem('token') });
    }
  }, []);

  console.log(`AUTH CONTEXT`, state);

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        logout,
        update,
        isLoggedIn
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default {
  Provider: AuthContextProvider,
  Context: AuthContext
};
