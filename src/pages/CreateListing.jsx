import React, {useState, useEffect, useRef} from 'react'
import {db} from '../firebase.config'
import {getAuth, onAuthStateChanged } from 'firebase/auth'
import {useNavigate} from 'react-router-dom'
import Spinner from '../components/Spinner'

function CreateListing() {
    const [geoLocationEnabled, setGeoLocationEnabled] = useState(true)
    const [loading, setLoading] = useState(false)
    const [fromData, setFormData] = useState({
        type: 'rent', 
        name: '',
        bathrooms: 1,
        bedrooms:1,
        parking: false,
        furnished: false, 
        address: '',
        offer: false,
        regularPrice: 0,
        discountedPrice:0,
        images: {}, 
        lat: 0,
        long:0,
    })

    const auth = getAuth()
    const navigate = useNavigate()
    const isMounted = useRef(true)
    useEffect(() => {
        if(isMounted) {
            onAuthStateChanged(auth, (user) => {
                if(user) {
                    setFormData({...FormData, userRef:user.uid})
                } else {
                    navigate('/sign-in')
                }
            })
        }
        return () => {
            isMounted.current = false
        }
    },[isMounted])

    if (loading) {return <Spinner /> }

  return (
    
    <div>Create</div>
  )
}

export default CreateListing