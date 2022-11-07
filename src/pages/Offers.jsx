import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {Collection, getDocs, query, where, orderBy, limit, startAfter, collection } from 'firebase/firestore'
import {toast} from 'react-toastify'
import Spinner from '../components/Spinner'
import {db} from '../firebase.config'
import ListingItem from '../components/ListingItem'

function Offers() {
    // This is where you would fetch the list of consultants 
    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)
    const [lastFetchedListing, setLastFetchedListing] = useState(null)
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
               const lastVisible = qSnapShot.docs[qSnapShot.docs.length - 1]
                setLastFetchedListing(lastVisible)
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

      //pagination/loadMore 
    const onFetchMoreListings = async () => {
            try {
                //get reference
                const listingsRef = collection(db, 'listings')
                const q = query(listingsRef, where ('offer','==',true), limit(10), //same as App.js, comes from explore Links
                orderBy('timestamp', 'desc',startAfter(lastFetchedListing),
                )) 
                //execute query
                const qSnapShot = await getDocs(q)
                const lastVisible = qSnapShot.docs[qSnapShot.docs.length - 1]
                setLastFetchedListing(lastVisible)
                const listings = []
                qSnapShot.forEach((doc) => {
                    return listings.push({
                        id:doc.id,
                        data:doc.data()
                    })
                })

                setListings((prevState) => [...prevState,...listings ])
                setLoading(false)
            } catch (error) {
                toast.error(error.message)
            }
        }


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
                   return  <ListingItem listing = {listing.data} id = {listing.id} key = {listing.id} />
                })}
            </ul>
        </main>
         {lastFetchedListing && listings.length > 10 && (
            <p className="loadMore" onClick={onFetchMoreListings}>Load More</p>
        ) }
        </> : <p>No offers available at this time</p>}

    </div>
  )
}

export default Offers