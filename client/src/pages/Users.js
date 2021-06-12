import React,{ Component } from "react";

import UserList from "../components/Users/UserList/UserList";
import Spinner from "../components/Spinner/Spinner";
import AuthContext from "../context/auth-context";

class UsersPage extends Component {
  state = {
    isLoading: false,
    users: []
  }

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers () {
    this.setState({isLoading: true});
    const reqBody = {
      query:`
        query {
          users{
            nickname
            email
            description
            age
          }
        }
      `
    }

    const token = this.context.token

    fetch('http://localhost:5000/graphql', {
      method: 'POST',
      body: JSON.stringify(reqBody),
      headers:{
        'Content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    }).then(res => {
      if (res.status !== 200 && res.status !== 201){
        throw new Error('Failed!');
      }
      return res.json();
    })
    .then(resData => {
      const users = resData.data.users;
      this.setState({ users: users, isLoading: false });
    })
    .catch(err => {
      console.log(err);
      this.setState({ isLoading: false });
    });
  }

  render(){
    return (
      <React.Fragment>
        {this.state.isLoading ? <Spinner /> : ( 
          <UserList users={this.state.users}/>
        )}
      </React.Fragment>
    );
  }
}

export default UsersPage;