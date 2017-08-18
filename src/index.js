import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom'
import {Provider} from 'react-redux'
import {applyMiddleware, compose, createStore} from 'redux'
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import combineReducers from './reducers'
import logger from 'redux-logger'
import thunk from 'redux-thunk'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(combineReducers, composeEnhancers(
applyMiddleware(logger), applyMiddleware(thunk)))

ReactDOM.render(<Provider store={store}><BrowserRouter><App /></BrowserRouter></Provider>, document.getElementById('root'));
registerServiceWorker();

/*
import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import Root from './components/Root'

import logger from 'redux-logger'
import thunk from 'redux-thunk'

const composer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(reducer,
//window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
composer(applyMiddleware(logger), applyMiddleware(thunk)))





let store = createStore(todoApp)

render(
  <Root store={store} />,
  document.getElementById('root')
)*/