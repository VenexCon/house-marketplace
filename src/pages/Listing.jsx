import {useState, useEffect} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import{getDoc, doc, collection} from 'firebase/firestore'
import{MapContainer, Marker, Popup, TileLayer} from 'react-leaflet'
import {getAuth} from 'firebase/auth'
import {db} from '../firebase.config'
import Spinner from '../components/Spinner'
import shareIcon from '../assets/svg/shareIcon.svg'
import Swipercore, { Navigation, Pagination, Scrollbar, A11y  } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react';
import {toast} from 'react-toastify'
import 'swiper/swiper-bundle.css';

function Listing() {

    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(true)
    const [shareLinkCopied, setShareLinkCopied] = useState(null)

  

    const navigate = useNavigate()
    const auth = getAuth()
    const params = useParams() // use the id from the url, to load the correct doc. 

    useEffect(() => {
        const fetchListing = async () => {
            const docRef = doc(db, 'listings', params.listingId)
            const docSnap = await getDoc(docRef)
            if(docSnap.exists()) {
                setListing(docSnap.data())
                setLoading(false)
            } else {
                console.log('No Listing Found')
                setLoading(false)
            }
        }
       
        fetchListing()
    },[navigate, params.listingId])

    if (loading) {
        return  <Spinner />
    }
  return (
    <main>
        
        <Swiper modules={[Navigation, Pagination, Scrollbar, A11y]} 
        slidesPerView={1} pagination={{ clickable: true }}
        navigation
        style ={{height: '300px'}}
        >
        {listing.imageUrls.map((url, index) => {
          return (<SwiperSlide key={index}>
                <div
                    className='swiperSlideDiv'
                    style={{
                        background: `url(${listing.imageUrls[index]}) center no-repeat`,
                        backgroundSize: 'cover',
                    }}
                ></div>
            </SwiperSlide>)
    })}
      </Swiper>


        <div className="shareIconDiv" onClick={() => {
            navigator.clipboard.writeText(window.location.href)
            setShareLinkCopied(true)
            setTimeout(() => {
                setShareLinkCopied(false)
            }, 2000)
            }}>
            <img src={shareIcon} alt="Share Link"  />
        </div>

        {shareLinkCopied && <p className='linkCopied'>Link Copied</p>}

        <div className="listingDetails">
            <p className="listingName">{listing.name} - £{listing.offer ? listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') 
            : listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
            <p className="listingLocation">{listing.location}</p>
            <p className="listingType">For {listing.type === 'rent' ? 'rent' : 'sale'}</p>
            {listing.offer && (
                <p className="discountPrice">
                    £{listing.regularPrice -listing.discountedPrice} discount
                </p>
            )}
            <ul className='listingDetailsList'>
                <li>
                    {listing.bedrooms > 1 ? `${listing.bedrooms} bedrooms` : '1 bedroom'}
                </li>
                <li>
                    {listing.bathrooms > 1 ? `${listing.bathrooms} bathrooms` : '1 bathroom'}
                </li>
                <li>
                    {listing.parking && 'Parking Spot' }
                </li>
                <li>
                    {listing.furnished && 'Furnished' }
                </li>
            </ul>
            <p className="listingLocationTitle">Location</p>
            <div className="leafletContainer">
                <MapContainer style = {{height:'100%', width:'100%'}}
                center= {[listing.geolocation.lat, listing.geolocation.long]} zoom = {13} scrollWheelZoom= {false}>
                  <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
                    />  
                    <Marker position= {[listing.geolocation.lat, listing.geolocation.long]}>
                        <Popup>{listing.location}</Popup>
                    </Marker>
                </MapContainer>
            </div>

            {auth.currentUser?.id !== listing.userRef && (
                <Link to={`/contact/${listing.userRef}?listingName=${listing.name}`} className = 'primaryButton'>
                    Contact Owner
                </Link>
            )}
        </div>
    </main>
  )
}

export default Listing