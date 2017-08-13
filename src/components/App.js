import React, { Component } from 'react';
import {Route} from 'react-router-dom'
import Post from './Post'
import Category from './Category'

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="subheader">
          <h2>Welcome to Readable project! </h2>
        </div>
        <div>
          <Route exact path='/' className="container"
            render={() => <h3>Coming soon...</h3>}
          />
          <Route path='/category' className="container"
            render={() => <Category></Category>}
          />
        </div>
      </div>
    );
  }
}

export default App;
