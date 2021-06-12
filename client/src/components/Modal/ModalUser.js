import React from 'react';
 
import './ModalUser.css'

const modal = props => {
    return(
        <div className="modal">
            <header className="modal__header">
                <h1>{props.nickname}</h1>
            </header>
            <section className="modal__content">
                {props.children}
            </section>
            <section className="modal__actions">
                {props.canCancel &&<button className="btn" onClick={props.onCancel}>Annuler</button>}
            </section>
        </div>
    );
}

export default modal;