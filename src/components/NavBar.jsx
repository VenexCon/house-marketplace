import {useNavigate, useLocation} from 'react-router-dom'
import {ReactComponent as OfferIcon} from '../assets/svg/localOfferIcon.svg'
import {ReactComponent as ExploreIcon} from '../assets/svg/exploreIcon.svg'
import {ReactComponent as PersonOutLineIcon} from '../assets/svg/personOutlineIcon.svg'


import React, { useEffect } from 'react'

function NavBar() {
    const navigate = useNavigate() // Navigate is used to assign links, as a tags refresh the page. 
    const location = useLocation() //location hook

    const pathMatchRoute = (route) => {
       if(route === location.pathname) {
        return true
       } 
        
    }

  return (
    <footer className='navbar'>
        <nav className='navbarBar'>
            <ul className='navbarListItems'>
                <li className="navbarListItem">
                    <ExploreIcon fill = {pathMatchRoute('/') ? '#2c2c2c': '#8f8f8f' } width = '36px' height ='36px' onClick = {() => {navigate('/')}} />
                    <p>Explore</p>
                </li>
                <li className="navbarListItem">
                    <OfferIcon fill = {pathMatchRoute('/offers') ? '#2c2c2c': '#8f8f8f' } width = '36px' height ='36px' onClick={() => {navigate('/offers')}} />
                    <p>Offer</p>
                </li>
                <li className="navbarListItem" >
                    <PersonOutLineIcon fill = {pathMatchRoute('/profile') ? '#2c2c2c': '#8f8f8f' } width = '36px' height ='36px' onClick={() => {navigate('/profile')}} />
                    <p>Profile</p>
                </li>
            </ul>
        </nav>

    </footer>
  )
}

export default NavBar