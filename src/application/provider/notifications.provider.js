import React, { createContext, useState } from 'react';

const NotificationsProvider = (props) => {
    const initialState =  {
        notifications: []
    }
    
    const [notifications, setNotifications] = useState(initialState);

    return ( 
        <NotificationsContext.Provider value = {[ notifications, setNotifications ]} > 
            { props.children } 
        </NotificationsContext.Provider>  
    );
}

export default NotificationsProvider;
export const NotificationsContext = createContext();