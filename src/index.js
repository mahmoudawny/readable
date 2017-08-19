import React from 'react';
import ReactDOM from 'react-dom';
import {applyMiddleware, compose, createStore} from 'redux'
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import combineReducers from './reducers'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import Root from './components/Root'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(combineReducers, composeEnhancers(
applyMiddleware(logger), applyMiddleware(thunk)))

ReactDOM.render(
  <Root store={store} />,
  document.getElementById('root')
)

//render(<Provider store={store}><BrowserRouter><App /></BrowserRouter></Provider>, document.getElementById('root'));
registerServiceWorker();
