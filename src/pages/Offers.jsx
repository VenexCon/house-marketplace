import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {Collection, getDocs, query, where, orderBy, limit, startafter, collection } from 'firebase/firestore'
import {toast} from 'react-toastify'
import Spinner from '../components/Spinner'
import {db} from '../firebase.config'
import ListingItem from '../components/ListingItem'

function Offers() {
    // This is where you would fetch the list of consultants 
    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)
    const params = useParams()
    
    useEffect(() => {
        const fetchListings = async () => {
            try {
                //get reference
                const listingsRef = collection(db, 'listings')
                const q = query(listingsRef, where ('offer','==',true),
                orderBy('timestamp', 'desc', limit(10)
                )) 
                //execute query
                const qSnapShot = await getDocs(q)
               
                const listings = []
                qSnapShot.forEach((doc) => {
                    return listings.push({
                        id:doc.id,
                        data:doc.data()
                    })
                })

                setListings(listings)
                setLoading(false)
            } catch (error) {
                toast.error(error.message)
            }
        }

        fetchListings()
    },[])


  return (
    <div className='category'>
        <header>
            <p className="pageHeader">
                Current Offers
            </p>
        </header>

        {loading ? <Spinner /> : listings && listings.length > 0 ? 
        <>
        <main>
            <ul className="categoryListings">
                {listings.map(listing => {
                    //@Todo - replace with styled component
                    //listing.data and listing.id taken from items pushed onto array. 
                   return  <ListingItem listing = {listing.data} id = {listing.id} />
                })}
            </ul>
        </main>
        </> : <p>No offers available at this time</p>}

    </div>
  )
}

export default Offers