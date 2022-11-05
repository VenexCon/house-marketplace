import React from 'react'
import {getAuth, updateEmail, updateProfile} from 'firebase/auth'
import { useState} from 'react'
import {updateDoc, doc} from 'firebase/firestore'
import {useNavigate, Link } from 'react-router-dom'
import { db } from '../firebase.config'
import {toast} from 'react-toastify'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'



function Profile() {
  const auth = getAuth()//obtains the current auth object for the firebase db
  const navigate = useNavigate()
  

  const [changeDetails, setChangeDetails] = useState(false)

  const [formData, setformData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  })

  const {name, email} = formData

  const onLogout = () => {
    auth.signOut()
    navigate('/')
  }

  const onSubmit = async () => {
    try {
      if(auth.currentUser.displayName !== name) {
        //update display name

        await updateProfile(auth.currentUser, {
          displayName: name
        })
        //update in firestore
        const userRef = doc(db, 'users', auth.currentUser.uid)
        await updateDoc(userRef, {
          name, 
        }) 
      }
      if(auth.currentUser.email !== email) {
        updateEmail(auth.currentUser, email)
        const userRef = doc(db, 'users', auth.currentUser.uid)
        await updateDoc(userRef, {
          email
        })

      }
    } catch (error) {
      toast.error('Could not update profile')
    }
  }

  const onChange = (e) => {
    setformData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }
  
  
  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button type='button' className="logOut" onClick={onLogout}>Log Out</button>
      </header>

      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p className="changePersonalDetails" onClick={() => {
            changeDetails && onSubmit()
            setChangeDetails((prevState) => !prevState)
          }}>
            {changeDetails ? 'done' : 'Change'}
          </p>
        </div>
        <div className="profileCard">
          <form>

            <label htmlFor="name">Name:</label>
            <input type="text" id= "name" className={!changeDetails ? 'profileName' : 'profileNameActive'}
            disabled = {!changeDetails} onChange = {onChange} value = {name} />

            <label htmlFor="email">Email:</label>
            <input type="text" id= "email" className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
            disabled = {!changeDetails} value = {email} onChange = {onChange} />

          </form>
        </div>
        <Link to ={'/create-listing'} className = 'createListing' id='profileCreateListingBar'>
          <img src={homeIcon} alt="home" />
          <p>Sale or rent your home.</p>
          <img src={arrowRight} alt="Arrow Right" />
        </Link>
      </main>
    </div>
  )
}

export default Profile