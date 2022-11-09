import React, { createContext, useState } from 'react';

const MyProvider = (props) => {
    const initialState =  {
        isLogin: false,
        isTrial: false,
        daysTrial: 0,
        user: {miWhats : []},
        update: false,
        modalPlan: false,
        loader: false
    }
    
    const [state, setState] = useState(initialState);

    return ( 
        <AppContext.Provider value = {[ state, setState ]} > 
            { props.children } 
        </AppContext.Provider>  
    );
}

export default MyProvider;
export const AppContext = createContext();