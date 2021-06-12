import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'

import BookingsPage from './pages/Bookings'
import UsersPage from './pages/Users'
import EventsPage from './pages/Events'
import AuthPage from './pages/Auth'
import SignInPage from './pages/Signin'
import MainNavigation from './components/Navigations/MainNavigation'

import AuthContext from './context/auth-context';

import React, { Component } from 'react';

import './App.css';

class App extends Component {
  state = {
    token: null,
    userId: null,
  }

  login = (token, userId, tokenExpiration) => {
    this.setState({token: token, userId: userId})
  }

  logout = () => {
    this.setState({token: null, userId: null})
  }
  render(){
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider value={{token: this.state.token, userId: this.state.userId, login:this.login, logout:this.logout }}>
            <MainNavigation />
            <main className="main-content">
              <Switch>
                {!this.state.token && <Redirect path="/" to="/events" exact />}
                {!this.state.token && <Route path="/auth" component={AuthPage} />}
                {!this.state.token && <Route path="/signin" component={SignInPage} />}
                {this.state.token && <Route path="/users" component={UsersPage} />}
                <Route path="/events" component={EventsPage} />
                {!this.state.token && <Redirect from="/bookings" to="/signin" component={BookingsPage} />}
                {this.state.token && <Redirect path="/" to="/events" exact />}
                {this.state.token && <Redirect from="/signin" to="/events" component={SignInPage} />}
                {this.state.token && <Route path="/bookings" component={BookingsPage} />}
                {!this.state.token && <Redirect path="/auth" exact />}
              </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
