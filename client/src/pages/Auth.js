import React, { Component } from 'react';
import './Auth.css'
import AuthContext from '../context/auth-context'

class AuthPage extends Component {
  state = {
    isLogin: true,
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
    const password = this.passwordEl.current.value
    const description = this.descriptionEl.current.value
    const age = +this.ageEl.current.value
    const nickname = this.nicknameEl.current.value

    if(email.trim().length === 0 || password.trim().length === 0){
      return;
    }

    const reqBody = {
      query:`
      mutation {
          createUser(userInput: {email: "${email}", password: "${password}", description:"${description}", age:${age}, nickname:"${nickname}"}){
            _id
            email
          }
        }
      `
    }

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
      console.log(resData);
    })
    .catch(err => {
      console.log(err);
    });
  };
  render(){
    return (
        <form className="auth-form" onSubmit={this.submitHandler}>
          <div className="form-control">
            <label>Surnom</label>
            <input type="text" ref={this.nicknameEl}></input>
          </div>
          <div className="form-control">
            <label>Age</label> 
            <input type="number" ref={this.ageEl}></input>
          </div>
          <div className="form-control">
            <label>Description</label> 
            <textarea type="text" rows="4" ref={this.descriptionEl}></textarea>
          </div>
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

export default AuthPage;