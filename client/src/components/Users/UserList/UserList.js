import React from 'react'

const userList = props => (
    <ul className="users__list">
        {props.users.map(user => {
            return ( 
            <li key={user._id} className="users__item">
                <div className="users__item-data">
                    {user.description} -{' '}
                    {user.age} - {' '}
                    {user.nickname} -{' '}
                    {user.email}
                </div>
            </li>
            );
        })}
    </ul>
)

export default userList;