import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise';
import ReuduxThunk from 'redux-thunk';
import Reducer from './redux/reducer';
import {
  BrowserRouter as Router
} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const createStoreWithMiddleware = applyMiddleware(promiseMiddleware, ReuduxThunk)(createStore);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={createStoreWithMiddleware(Reducer,
      window.__REDUX_DEVTOOLS_EXTENSION__&&
      window.__REDUX_DEVTOOLS_EXTENSION__()
      )}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
