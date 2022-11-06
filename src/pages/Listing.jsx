import {useState, useEffect} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import{getDoc, doc, collection} from 'firebase/firestore'
import {getAuth} from 'firebase/auth'
import {db} from '../firebase.config'
import Spinner from '../components/Spinner'
import shareIcon from '../assets/svg/shareIcon.svg'
import {toast} from 'react-toastify'

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
        {/* Add Slide Show */}
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
            {/* MAP */}

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