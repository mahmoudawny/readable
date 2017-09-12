/*Root component sets the App component with Redux store and Router history */
import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import {  Route, BrowserRouter } from 'react-router-dom'
import App from './App'


const Root = ({ store }) => (
  <Provider store={store}>
    <BrowserRouter>
      <Route component={App} />
    </BrowserRouter>
  </Provider>
)

Root.propTypes = {
  store: PropTypes.object.isRequired
}

export default Root