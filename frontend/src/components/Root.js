import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { GlobalStyle } from '../config/GlobalTheme';
import Index from '../screens/Index';
import NotFound from '../screens/NotFound';
import Register from '../screens/Register';
import Login from '../screens/Login';

import AuthContext from '../utils/AuthContext';
import User from '../screens/User';

const Root = () => (
  <AuthContext.Provider>
    <GlobalStyle />
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Index />
        </Route>
        <Route exact path="/register">
          <Register />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/user/:id">
          <User />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </BrowserRouter>
  </AuthContext.Provider>
);

export default Root;
