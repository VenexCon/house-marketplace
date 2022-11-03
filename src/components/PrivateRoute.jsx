import React from 'react'
import { useAuthStatus } from './hooks/useAuthStatus'
import { Navigate, Outlet } from 'react-router-dom'
import Spinner from './Spinner'



const PrivateRoute = () => {

    const {loggedIn, checkingStatus} = useAuthStatus();
    
    if(checkingStatus) {
        return <Spinner />
    }


    return  loggedIn ? <Outlet /> : <Navigate to = '/sign-in' />

}

export default PrivateRoute