import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {collection, getDocs, query, orderBy, limit} from 'firebase/firestore'
import {db} from '../firebase.config'
import { Navigation, Pagination, Scrollbar,A11y} from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import Spinner from './Spinner'



function Slider() {

    const [loading, setLoading] = useState(null)
    const [listings, setListing] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        const fetchListings = async () => {

            const listingsRef = collection(db,'listings')
            const q = query(listingsRef)
            const qSnapshot = await (getDocs(q))
            let newListings =[]
            qSnapshot.forEach((doc) => {
               return newListings.push({
                id:doc.id,
                data:doc.data()
               })
            })
            setListing(newListings)
            setLoading(false)
        }

        fetchListings()
    },[])



    /* if(loading) {
        return <Spinner />
    } */

   

  return listings && (
    <>
        <p className="exploreHeading">Recommended</p>
     <Swiper modules={[Navigation, Pagination, Scrollbar, A11y]} 
        slidesPerView={1} pagination={{ clickable: true }}
        navigation
        style ={{height: '300px'}}
        >
        {listings.map(({data,id}) => {
          return (<SwiperSlide key={id} onClick = {() => {navigate(`/category/${data.type}/${id}`)}}>
                <div
                    className='swiperSlideDiv'
                    style={{
                        background: `url(${data.imageUrls[0]}) center no-repeat`,
                        backgroundSize: 'cover',
                    }}
                >
                    <p className="swiperSlideText">{data.name}</p>
                    <p className="swiperSlidePrice">£{data.discountedPrice ?? data.regularPrice}
                    {data.type === 'rent' && '/month'}</p>
                </div>
            </SwiperSlide>)
    })}
      </Swiper>  
    </>
  )
}

export default Slider