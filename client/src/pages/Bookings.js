import React,{ Component } from "react";

import BookingList from "../components/Bookings/BookingList/BookingList";
import Spinner from "../components/Spinner/Spinner";
import AuthContext from "../context/auth-context";

class BookingsPage extends Component {
  state = {
    isLoading: false,
    bookings: []
  }

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchBookings();
  }

  fetchBookings () {
    this.setState({isLoading: true});
    const reqBody = {
      query:`
        query {
            bookings {
              _id
              createdAt
              event {
                _id
                title
                date
              }
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
      const bookings = resData.data.bookings;
      this.setState({ bookings: bookings, isLoading: false });
    })
    .catch(err => {
      console.log(err);
      this.setState({ isLoading: false });
    });
  }

  deleteBookingHandler = bookindId => {
    this.setState({isLoading: true});
    const reqBody = {
      query:`
        mutation {
            cancelBooking(bookingId: "${bookindId}") {
              _id
              title
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
      this.setState(prevState => {
        const updatedBookings = prevState.bookings.filter(booking => {
          return booking._id !== bookindId;
        })
        return { bookings: updatedBookings, isLoading: false};
      });
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
          <BookingList bookings={this.state.bookings} onDelete={this.deleteBookingHandler}/>
        )}
      </React.Fragment>
    );
  }
}

export default BookingsPage;