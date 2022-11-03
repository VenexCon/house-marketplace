import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import {getAuth} from 'firebase/auth'




const PrivateRoute = () => {

    const auth = getAuth()

    const loggedIn = false

    return  loggedIn ? <Outlet /> : <Navigate to = '/sign-in' />

}

export default PrivateRoute