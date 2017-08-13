import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom'
import {Provider} from 'react-redux'
import {applyMiddleware, createStore} from 'redux'
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import combineReducers from './reducers'

//const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
//const store = createStore(reducer, /* preloadedState, */ composeEnhancers(
const store = createStore(combineReducers)

ReactDOM.render(<Provider store={store}><BrowserRouter><App /></BrowserRouter></Provider>, document.getElementById('root'));
registerServiceWorker();

/*
import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import Root from './components/Root'

let store = createStore(todoApp)

render(
  <Root store={store} />,
  document.getElementById('root')
)*/