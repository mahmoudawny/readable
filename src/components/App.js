import React, { Component } from 'react';
import {Route} from 'react-router-dom'
import Post from './Post'
import Category from './Category'
import * as api from '../utils/ReadableAPI'

class App extends Component {
  state = {
    categories: []
  }

  componentDidMount(){
    api.getCategories().then((categories) => {
      this.setState({categories})
    })
  }

  render() {
    return (
      <div className="App">
        <div className="subheader">
          <h2>Welcome to Readable project! </h2>
        </div>
        <div>
          <Route exact path='/' className="container"
            render={() => 
            <ul className='list'>
              {this.state.categories? this.state.categories.map((category) => 
            <Category key={category.name} category={category}></Category>)
            : <h2>No categories to display</h2>}
            </ul>
            }
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
