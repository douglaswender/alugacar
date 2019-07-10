import React, {Component} from 'react';

import Home from '../Home/Home'
import Login from '../Login/Login'
import firebase from '../../Services/Firebase'


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    };
  }

  componentDidMount() {
    this.authListener();
  }

  authListener() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      } else {
        this.setState({ user: null });
      }
    })
  }

  render() {
    return (
      <div>
        {this.state.user ? (<Home />) : (<Login />)}
      </div>
    )
  }
}

