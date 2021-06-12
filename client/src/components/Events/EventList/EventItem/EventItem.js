import React from 'react';
import './EventItem.css'

const eventItem = props =>(
    <li key={props.eventId} className="events__list-item">
        <div>
            <h1>{props.title}</h1>
            <h2>{props.price}€ - {new Date(props.date).toLocaleDateString()}</h2>
        </div>
        <div>
            {props.userId === props.creatorId ? (
            <p>Tu es le créateur de cette événement.</p>
            ) : (
            <button className="btn" onClick={props.onDetail.bind(this, props.eventId)}>Voir les détails</button>
            )}
        </div>
        <div>
        <button className="btn" onClick={props.onUserDetail.bind(this, props.creatorId)}>Voir le Profil</button>
        </div>
    </li>
);

export default eventItem