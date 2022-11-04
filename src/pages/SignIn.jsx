import React, {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import{getAuth, signInWithEmailAndPassword} from 'firebase/auth'
import {toast} from 'react-toastify'
import OAuth from '../components/OAuth'

function SignIn() {

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email:'',
    password:''
  })

  //form object to be disptached 
  const {email, password} = formData

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
      const auth = getAuth()

    const userCredential = await signInWithEmailAndPassword(auth, email, password)
      if(userCredential.user) {
        console.log()
        navigate('/')
      }
      } catch (error) {
        toast.error('bad User Credentials')
      }
    }




  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome Back!</p>
          </header>
          
            <form onSubmit={onSubmit}>
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
              <div className="signInBar">
                <p className="signInText">
                  Sign In
                </p>
                <button className="signInButton">
                  <ArrowRightIcon fill='#fffff' width='34px' height='34px'  />
                </button>
              </div>
            </form>

            <OAuth />
            <Link to ='/sign-up' className='registerLink'>Sign up Instead</Link>
          
          </div>  
    </>
  )
}

export default SignIn