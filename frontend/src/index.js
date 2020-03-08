import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import Root from './components/Root';
import config from './config/config';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/ayu-mirage.css';
import './assets/codemirror-atari';
import './assets/codemirror-6502';

global.user = null;

if (localStorage.getItem('token')) {
  axios
    .get(config.serverUrl + '/user', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(({ data }) => {
      global.user = data.user;

      ReactDOM.render(<Root />, document.getElementById('root'));
    })
    .catch(err => {
      console.error(err);

      ReactDOM.render(<Root />, document.getElementById('root'));
    });
} else {
  ReactDOM.render(<Root />, document.getElementById('root'));
}
