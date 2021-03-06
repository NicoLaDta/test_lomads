import React, { Component } from 'react';
import './Auth.css'

import AuthContext from '../context/auth-context'

class SignInPage extends Component {
  state = {
    isLogin: true
  };

  static contextType = AuthContext;

  constructor(props){
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
    this.nicknameEl = React.createRef();
    this.ageEl = React.createRef();
    this.descriptionEl = React.createRef();
  };

  switchMode = () => {
    this.setState(prevState => {
      return {isLogin: !prevState.isLogin};
    })
  };

  submitHandler = (event) => {
    event.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if(email.trim().length === 0 || password.trim().length === 0){
      return;
    }

    const reqBody = {
      query:`
        query {
          login(email:"${email}", password: "${password}") {
            userId
            token
            tokenExpiration
          }
        }
      `
    };

    fetch('http://localhost:5000/graphql', {
      method: 'POST',
      body: JSON.stringify(reqBody),
      headers:{
        'Content-type': 'application/json'
      }
    }).then(res => {
      if (res.status !== 200 && res.status !== 201){
        throw new Error('Failed!')
      }
      return res.json();
    }).then(resData => {
      if (resData.data.login.token){
        this.context.login(resData.data.login.token, resData.data.login.userId, resData.data.login.tokenExpiration)
      }
    })
    .catch(err => {
      console.log(err);
    });
  };
  render(){
    return (
        <form className="auth-form" onSubmit={this.submitHandler}>
          <div className="form-control">
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" ref={this.emailEl}></input>
          </div>
          <div className="form-control">
            <label htmlFor="password">Mot de Passe</label>
            <input type="password" id="password" ref={this.passwordEl}></input>
          </div>
          <div className="form-actions">
            <button type="submit">Envoyez</button>
          </div>
        </form>
    );
  }  
}

export default SignInPage;