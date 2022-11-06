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

  return (
    <div>Listing</div>
  )
}

export default Listing