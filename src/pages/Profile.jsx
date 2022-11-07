import React,{useEffect} from 'react'
import {getAuth, updateEmail, updateProfile} from 'firebase/auth'
import { useState} from 'react'
import {updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc} from 'firebase/firestore'
import {useNavigate, Link } from 'react-router-dom'
import { db } from '../firebase.config'
import {toast} from 'react-toastify'
import ListingItem from '../components/ListingItem'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'
import Spinner from '../components/Spinner'



function Profile() {
  const auth = getAuth()//obtains the current auth object for the firebase db
  const navigate = useNavigate()
  const [listings, setListings] = useState(null)
  const [loading, setLoading] =useState(true)
  const [changeDetails, setChangeDetails] = useState(false)
  const [formData, setformData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  })

  const {name, email} = formData

  useEffect(() => {

      const fetchUserListings = async () => {
        const collRef = collection(db, 'listings')
        const q = query(collRef, where('userRef', '==', `${auth.currentUser.uid}`)) 
        const listings =[]
        const qSnapshot = await (getDocs(q))
          qSnapshot.forEach((doc) => {
            return listings.push({
            id:doc.id,
            data:doc.data()
          })
          }
          )
          setListings(listings)
          setLoading(false)
      }

      fetchUserListings()
  },[auth.currentUser.uid])


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

  const onDelete =async (listingId) =>  {
    if(window.confirm('Are you sure you want to delete?')) {
      await deleteDoc(doc(db, 'listings', listingId))
      const updatedListings = listings.filter((listing) => {return listing.id !== listingId})
      setListings(updatedListings)
      toast.success('Listing deleted')
    }
  }
  
  if(loading) {return <Spinner />}
  
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

        {!loading && listings?.length > 0 && (
          <>
          <p className="listingText">Your Listings</p>
          <p className="ListingText">You have {listings.length} Listings </p>

          <ul className="listingsList">
            {listings.map((listing) => {
              return <ListingItem key={listing.id} listing = {listing.data} id = {listing.id} onDelete = {() => {onDelete(listing.id)}}/>
            })}
          </ul>

          </>
        )}
      </main>
    </div>
  )
}

export default Profile