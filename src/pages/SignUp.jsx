import { getSpaceUntilMaxLength } from '@testing-library/user-event/dist/utils'
import React, {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {getAuth, createUserWithEmailAndPassword, updateProfile} from 'firebase/auth'
import {db} from '../firebase.config'
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'

function SignUp() {

  
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email:'',
    password:'',
    name:''
  })

  //form object to be disptached 
  const {email, password, name} = formData

  //Able to use links. 
  const navigate = useNavigate()

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState, 
      [e.target.id]: e.target.value, 
    }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const  auth = getAuth() //obtaining auth value(object)

      const userCredential = await createUserWithEmailAndPassword
      (auth, email, password) //destructured from form object
      
      const user = userCredential.user // obtains the user value

      updateProfile(auth.currentUser, { 
        displayName: name //sets the display name of the user, to the name from the formData
      })

      navigate('/') //returns to home screen once logged in. 
    } catch (error) {
      console.log(error)
    }
  }



  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome Back!</p>
          </header>
          
            <form onSubmit={onSubmit}>
              <input type="text" className='nameInput' placeholder='Name' id='name' value={name}
              onChange = {onChange} required/>
              <input type="email" className='emailInput' placeholder='Email Address' id='email' value={email}
              onChange = {onChange} required/>

              <div className="passwordInputDiv">
                <input type={showPassword ? 'text' : 'password'}
                className= 'passwordInput' placeholder='Password' id='password' 
                value={password} onChange = {onChange} required />

                <img src={visibilityIcon} alt="Show Password" className="showPassword"
                onClick={() => {setShowPassword((prevState) => !prevState)}}/>
              </div>

              <Link to = '/forgot-password' className='forgotPasswordLink'>Forgot Password</Link>

              <div className="signUpBar">
                <p className="signUpText">
                  Sign up
                </p>
                <button className="signUpButton">
                  <ArrowRightIcon fill='#fffff' width='34px' height='34px'  />
                </button>
              </div>
            </form>

            {/* Google OAuth Component here!  */}
            <Link to ='/sign-in' className='registerLink'>Sign In Instead</Link>
          
          </div>  
    </>
  )
}

export default SignUp