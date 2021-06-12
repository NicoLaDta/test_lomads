import React, { Component } from 'react';

import ModalUser from '../components/Modal/ModalUser';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import EventList from '../components/Events/EventList/EventList';
import Spinner from '../components/Spinner/Spinner';

import AuthContext from '../context/auth-context';

import './events.css'

class EventsPage extends Component {
  state = {
    creating: false,
    events: [],
    isLoading: false,
    selectedEvent: null,
    selectedUser: null,
  }
  isActive = true;
  
  static contextType = AuthContext;

  constructor(props){
    super(props);
    this.titleElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.descriptionElRef = React.createRef();
  }

  componentDidMount() {
    this.modalFetchEvents();
  }

  startCreateEventHandler = () => {
    this.setState({ creating: true });
  }

  modalConfirmHandler = () => {
    this.setState({creating: false})
    const title = this.titleElRef.current.value
    const price = +this.priceElRef.current.value
    const date = this.dateElRef.current.value
    const description = this.descriptionElRef.current.value

    if (title.trim().length === 0 || price <= 0 || description.trim().length === 0 || date.trim().length === 0){
      return;
    }

    const event = { title, price, date, description}
    console.log(event)

    const reqBody = {
      query:`
      mutation {
          createEvent(eventInput: {title: "${title}", price: ${price}, description:"${description}", date:"${date}"}){
            _id
            title
            description
            date
            price
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
        'Authorization':'Bearer ' + token
      }
    }).then(res => {
      if (res.status !== 200 && res.status !== 201){
        throw new Error('Failed!')
      }
      return res.json();
    }).then(resData => {
      this.setState(prevState => {
        const updatedEvents = [...prevState.events];
        updatedEvents.push({
          _id: resData.data.createEvent._id,
          title: resData.data.createEvent.title,
          description: resData.data.createEvent.description,
          date: resData.data.createEvent.date,
          price: resData.data.createEvent.price,
          creator: {
            _id: this.context.userId
          }
        })
        return {events: updatedEvents};
      })
    })
    .catch(err => {
      console.log(err);
    });
  };

  modalFetchEvents = () => {
    this.setState({isLoading: true});
    const reqBody = {
      query:`
        query {
            events {
              _id
              title
              description
              date
              price
              creator {
                _id
                email
                nickname
                description
                age
              }
            }
          }
        `
    }

    fetch('http://localhost:5000/graphql', {
      method: 'POST',
      body: JSON.stringify(reqBody),
      headers:{
        'Content-type': 'application/json',
      }
    }).then(res => {
      if (res.status !== 200 && res.status !== 201){
        throw new Error('Failed!')
      }
      return res.json();
    }).then(resData => {
      const events = resData.data.events;
      if(this.isActive){
        this.setState({events: events, isLoading: false});
      }
    })
    .catch(err => {
      console.log(err);
      if(this.isActive){
        this.setState({isLoading: false})
      }
    });
  }

  modalCancelHandler = () => {
    this.setState({creating: false, selectedEvent: null, selectedUser: null})
  };

  showDetailHandler = eventId => {
    this.setState(prevState => {
      const selectedEvent = prevState.events.find(e => e._id === eventId);
      return { selectedEvent: selectedEvent }
    });
  };
  showUserDetailHandler = userId => {
    this.setState(prevState => {
      const selectedUser = prevState.events.find(e => e.creator._id === userId);
      return { selectedUser: selectedUser }
    });
  };

  bookEventHandler = () => {
    if (!this.context.token){
      this.setState({ selectedEvent: null })
      return;
    }
    const reqBody = {
      query:`
        mutation {
            bookEvent(eventId: "${this.state.selectedEvent._id}") {
              _id
              createdAt
              updatedAt
            }
          }
        `
    }

    fetch('http://localhost:5000/graphql', {
      method: 'POST',
      body: JSON.stringify(reqBody),
      headers:{
        'Content-type': 'application/json',
        'Authorization': 'Bearer '+ this.context.token
      }
    }).then(res => {
      if (res.status !== 200 && res.status !== 201){
        throw new Error('Failed!')
      }
      return res.json();
    })
    .then(resData => {
      console.log(this.state.selectUser.creator.nickname)
      this.setState({ selectedEvent: null })
    })
    .catch(err => {
      console.log(err);
    });
  }

  componentWillUnmount() {
    this.isActive = false
  }

  render(){
    return (
      <React.Fragment>
        {(this.state.creating || this.state.selectedEvent || this.state.selectedUser) && <Backdrop />}
        {this.state.creating && <Modal title="Add Event" canCancel canConfirm onCancel={this.modalCancelHandler} onConfirm={this.modalConfirmHandler} confirmText="Confirmez">
          <form>
            <div className="form-control">
              <label htmlFor="title">Titre</label>
              <input type="text" id="title" ref={this.titleElRef}></input>
            </div>
            <div className="form-control">
              <label htmlFor="price">Prix</label>
              <input type="number" id="price" ref={this.priceElRef}></input>
            </div>
            <div className="form-control">
              <label htmlFor="date">Date</label>
              <input type="datetime-local" id="date" ref={this.dateElRef}></input>
            </div>
            <div className="form-control">
              <label htmlFor="description">Description</label>
              <textarea id="description" rows="4" ref={this.descriptionElRef}></textarea>
            </div>
          </form>
        </Modal>}
        {this.state.selectedEvent && <Modal 
          title={this.state.selectedEvent.title} 
          canCancel 
          canConfirm 
          onCancel={this.modalCancelHandler} 
          onConfirm={this.bookEventHandler} 
          confirmText={this.context.token ? 'Reservez' : 'Se Connecter' }>
          <h1>{this.state.selectedEvent.title}</h1>
          <h2>
            {this.state.selectedEvent.price}€ -{' '}
            {new Date(this.state.selectedEvent.date).toLocaleDateString()}
          </h2>
          <p>{this.state.selectedEvent.description}</p>
        </Modal>
        }
        {this.state.selectedUser && <ModalUser 
          nickname={this.state.selectedUser.creator.nickname} 
          canCancel 
          canConfirm 
          onCancel={this.modalCancelHandler} 
          >
          <h1>{this.state.selectedUser.nickname}</h1>
          <p>Email : {' '}{this.state.selectedUser.creator.email}</p>
          <p>Age: {' '}{this.state.selectedUser.creator.age} ans</p>
          <p>Description : {' '}{this.state.selectedUser.creator.description}</p>
          </ModalUser>
        }
        {this.context.token && (
        <div className="events-control">
          <p>Créez votre propre Evénement !</p>
          <button className="btn" onClick={this.startCreateEventHandler}>
            Créer l'événement
          </button>
        </div>
        )}
        {this.state.isLoading ? <Spinner /> : (
        <EventList 
          events={this.state.events} 
          authUserId={this.context.userId} 
          onViewDetail={this.showDetailHandler}
          onUserViewDetail={this.showUserDetailHandler}
          />
        )}
      </React.Fragment>
    );
  }
}

export default EventsPage;