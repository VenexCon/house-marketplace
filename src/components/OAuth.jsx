import React, {} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import {getAuth, signInWithPopup, GoogleAuthProvider} from 'firebase/auth'
import {doc,setDoc,getDoc, serverTimestamp} from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'
import googleIcon from '../assets/svg/googleIcon.svg'

function OAuth() {

    const navigate = useNavigate()
    const location = useLocation()
    const auth = getAuth()
    
    const onGoogleClick = async (e) => {
        try {
            const auth = getAuth()
            const provider = new GoogleAuthProvider() //creates new provider
            const result = await signInWithPopup(auth, provider)
            const credential = GoogleAuthProvider.credentialFromResult(result)
            const token = credential.accessToken;
            const user = result.user
            console.log(user)
            
            //check to see if user exists 
            const docRef = doc(db, 'users', user.uid) // create reference to docRef in 'users' listing
            const docSnap = await getDoc(docRef) // returns a snapshot

            //if user !exist create user
            if(!docSnap.exists()) {
                await setDoc(doc(db, 'users', user.uid), {
                    name: user.displayName,
                    email: user.email, 
                    timestamp: serverTimestamp()
                })
            }
            navigate('/')
        } catch (error) {
            toast.error(error.message)
        }
    }

  return (
    <div className='socialLogin'>
        <p>Sign {location.pathname === '/sign-up' ? 'up' : 'in'} with </p>
        <button className="socialIconDiv" onClick={onGoogleClick}>
            <img className='socialIconImg' src={googleIcon} alt="Google" />
        </button>
    </div>
  )
}

export default OAuth