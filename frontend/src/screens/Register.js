import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import AuthContext from '../utils/AuthContext';

const Register = () => {
  const authContext = useContext(AuthContext.Context);
  const history = useHistory();

  if (authContext.isLoggedIn()) {
    history.push('/');
  }

  return <div>asa</div>;
};

export default Register;
