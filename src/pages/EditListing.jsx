import React, {useState, useEffect, useRef} from 'react'
import {db} from '../firebase.config'
import {getAuth, onAuthStateChanged } from 'firebase/auth'
import {useNavigate, useParams} from 'react-router-dom'
import Spinner from '../components/Spinner'
import {toast} from 'react-toastify'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {v4 as uuidv4} from 'uuid'
import {getDoc, serverTimestamp, doc, updateDoc} from 'firebase/firestore'


function EditListing() {
    const [geolocationEnabled, setGeolocationEnabled] = useState(true) //unused due to google billing account
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
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

    const {type, name, bathrooms, bedrooms, parking, furnished, address, 
        offer, regularPrice,discountedPrice, images, lat, long} = formData
    
   
    const auth = getAuth()
    const [listing, setListing] = useState('')
    const navigate = useNavigate()
    const params= useParams()
    const isMounted = useRef(true)

        //sets the userRef to logged in user
    useEffect(() => {
        if(isMounted) {
            onAuthStateChanged(auth, (user) => {
                if(user) {
                    setFormData({...formData, userRef:user.uid}) // sets listings to the same userRef as the current user. 
                } else {
                    navigate('/sign-in')
                }
            })
        }
        return () => {
            isMounted.current = false
        }
    },[isMounted])

    //redirect if listing is not users

    useEffect(() => {
        if(listing && listing.userRef !== auth.currentUser.uid) {
            toast.error('you cannot edit that listing')
            navigate('/')
        }
    })


    //This fetches the listing to be edited. 
    useEffect(() => {
        setLoading(true)
        const fetchLising = async () => {
            const docRef = doc(db, 'listings',params.listingId )
            const docSnap = await getDoc(docRef)
            if(docSnap.exists()) {
                setListing(docSnap.data())
                setFormData({...docSnap.data(), address:docSnap.data().location})
                setLoading(false)
            } else {
                navigate('/')
                toast.error('Listing not found')
            }
        }

        fetchLising()
    },[navigate, params.listingId])


    //Submits the edit
    const onSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        
        if(+discountedPrice >= +regularPrice) {
            setLoading(false)
            toast.error('Discounted price should be less than the regular price')
            return 
        }

        if(images.length > 6 ) {
            setLoading(false)
            toast.error('Max 6 Images')
            return 
        }

        let geolocation = {}
        let location = null

        if(geolocation) {
            const response = await fetch (`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODINGAPI_KEY}`)
            const data =await response.json()
            geolocation.lat = data.results[0]?.geometry.location.lat ?? 0
            geolocation.long = data.results[0]?.geometry.location.lng ?? 0
            location = data.status === 'ZERO_RESULTS' ? undefined : data.results[0]?.formatted_address

            if(location === undefined || location.includes('undefined')){
              setLoading(false)
              toast.error('Please enter correct address')
              return 
            }

        } else {
           geolocation.lat = lat
           geolocation.lng = long
        }

        setLoading(false)

      //store images in firebase
      //takes into account a single image
      const storeImage = async (image) => {
        return new Promise((resolve, reject)=> {
          const storage = getStorage()
          const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`
          const storageRef = ref(storage, 'images/' + fileName)
          const uploadTask = uploadBytesResumable(storageRef, image) //pass in the file, not the name ref. 

          uploadTask.on('state_changed', 
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
              switch (snapshot.state) {
                case 'paused':
                  console.log('Upload is paused');
                  break;
                case 'running':
                  console.log('Upload is running');
                  break;
              }
            }, 
            (error) => {
              reject(error)
            }, 
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                resolve(downloadURL)
              });
            }
          );
        })
      }

      
    const imageUrls =  await Promise.all(
      [...images].map((image) => {
       toast.success(`File ${image.name} uploaded`)
       console.log(image)
       return  storeImage(image)
      })
    ).catch(() => {
      setLoading(false)
      toast.error('Could not upload images')
      return
    })
    const formDataCopy = {
      ...formData,
      imageUrls,
      geolocation,
      timestamp: serverTimestamp()
    }

    formDataCopy.location = address
    delete formDataCopy.images //delete image object from formData, not needed in database
    delete formDataCopy.address//address needs to be refreshed every submission.  
    !formDataCopy.offer && delete formDataCopy.discountedPrice

    const docRef = doc(db, 'listings', params.listingId)
    await updateDoc(docRef, formDataCopy)
    setLoading(false)
    toast.success('Listing Created')
    navigate(`/category/:${formDataCopy.type}/${docRef.id}`)
   
  }

    const onMutate = (e) => {
        let boolean = null;

        if(e.target.value === 'true') {
            boolean = true
        }
        if(e.target.value === 'false') {
            boolean = false
        }

        //files
        if (e.target.files) {
            setFormData((prevState) => ({
                ...prevState, 
                images: e.target.files
            }))
        }

        //text/booleans/file

        if(!e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.id]: boolean ?? e.target.value
            }))
        }
    }

    /* @To-do */
    //Insert on-submit function to hanlde and update listing details 
    //delete residual pictures from database store 
    //review use of useContext 
    //begin search consultants page!
      if (loading) {return <Spinner /> }

  return (
    //Consultants profiles will go here. 
    <div className='profile'>
        <header>
            <p className="pageHeader">Edit listing</p>
        </header>
        <main>
            <form onSubmit={onSubmit}>
                <label className='formLabel'>Sale/Rent</label>
                <div className="formButtons">
                    <button type = 'button' className = {type === 'sale' ? 'formButtonActive' : 'formButton'} id = 'type'
                    value = 'sale' onClick={onMutate}>Sale</button>
                     <button type = 'button' className = {type === 'rent' ? 'formButtonActive' : 'formButton'} id = 'type'
                    value = 'rent' onClick={onMutate}>Rent</button>
                </div>
                <label className='formLabel'>Name</label>
          <input
            className='formInputName'
            type='text'
            id='name'
            value={name}
            onChange={onMutate}
            maxLength='32'
            minLength='10'
            required
          />

          <div className='formRooms flex'>
            <div>
              <label className='formLabel'>Bedrooms</label>
              <input
                className='formInputSmall'
                type='number'
                id='bedrooms'
                value={bedrooms}
                onChange={onMutate}
                min='1'
                max='50'
                required
              />
            </div>
            <div>
              <label className='formLabel'>Bathrooms</label>
              <input
                className='formInputSmall'
                type='number'
                id='bathrooms'
                value={bathrooms}
                onChange={onMutate}
                min='1'
                max='50'
                required
              />
            </div>
          </div>

          <label className='formLabel'>Parking spot</label>
          <div className='formButtons'>
            <button
              className={parking ? 'formButtonActive' : 'formButton'}
              type='button'
              id='parking'
              value={true}
              onClick={onMutate}
              min='1'
              max='50'
            >
              Yes
            </button>
            <button
              className={
                !parking && parking !== null ? 'formButtonActive' : 'formButton'
              }
              type='button'
              id='parking'
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className='formLabel'>Furnished</label>
          <div className='formButtons'>
            <button
              className={furnished ? 'formButtonActive' : 'formButton'}
              type='button'
              id='furnished'
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !furnished && furnished !== null
                  ? 'formButtonActive'
                  : 'formButton'
              }
              type='button'
              id='furnished'
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className='formLabel'>Address</label>
          <textarea
            className='formInputAddress'
            type='text'
            id='address'
            value={address}
            onChange={onMutate}
            required
          />

          {!geolocationEnabled && (
            <div className='formLatLng flex'>
              <div>
                <label className='formLabel'>Latitude</label>
                <input
                  className='formInputSmall'
                  type='number'
                  id='latitude'
                  value={lat}
                  onChange={onMutate}
                  required
                />
              </div>
              <div>
                <label className='formLabel'>Longitude</label>
                <input
                  className='formInputSmall'
                  type='number'
                  id='longitude'
                  value={long}
                  onChange={onMutate}
                  required
                />
              </div>
            </div>
          )}

          <label className='formLabel'>Offer</label>
          <div className='formButtons'>
            <button
              className={offer ? 'formButtonActive' : 'formButton'}
              type='button'
              id='offer'
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !offer && offer !== null ? 'formButtonActive' : 'formButton'
              }
              type='button'
              id='offer'
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className='formLabel'>Regular Price</label>
          <div className='formPriceDiv'>
            <input
              className='formInputSmall'
              type='number'
              id='regularPrice'
              value={regularPrice}
              onChange={onMutate}
              min='50'
              max='750000000'
              required
            />
            {type === 'rent' && <p className='formPriceText'>$ / Month</p>}
          </div>

          {offer && (
            <>
              <label className='formLabel'>Discounted Price</label>
              <input
                className='formInputSmall'
                type='number'
                id='discountedPrice'
                value={discountedPrice}
                onChange={onMutate}
                min='50'
                max='750000000'
                required={offer}
              />
            </>
          )}

          <label className='formLabel'>Images</label>
          <p className='imagesInfo'>
            The first image will be the cover (max 6).
          </p>
          <input
            className='formInputFile'
            type='file'
            id='images'
            onChange={onMutate}
            max='6'
            accept='.jpg,.png,.jpeg'
            multiple
            required
          />
          <button type='submit' className='primaryButton createListingButton'>
           Edit Listing
          </button>
            </form>
        </main>
        
    </div>
  )
}

export default EditListing