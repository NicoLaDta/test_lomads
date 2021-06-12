import { NavLink } from 'react-router-dom'

import React from  'react'

import AuthContext from '../../context/auth-context'

import './MainNavigation.css'

const MainNavigation = props => (
    <AuthContext.Consumer>
    {(context) => {
        return (
            <header className="main-navigation">
                <div className="main-navigation__logo">
                    <h1>Lomads</h1>
                </div>
                <nav className="main-navigation__item">
                    <ul>
                        <li>
                            <NavLink to="/events">Evenements</NavLink>
                        </li>
                        {context.token && (
                            <React.Fragment>
                                <li>
                                    <NavLink to="/bookings">Reservation</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/users">Profile</NavLink>
                                </li>
                                <li>
                                    <button onClick={context.logout}>Deconnexion</button>
                                </li>
                            </React.Fragment>
                        )}
                        {!context.token && (
                            <React.Fragment>
                                <li>
                                    <NavLink to="/auth">S'inscrire</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/signin">Connexion</NavLink>
                                    
                                </li>
                            </React.Fragment>
                        )}
                    </ul>
                </nav>
            </header>
        );
    }}
    </AuthContext.Consumer>
)

export default MainNavigation;