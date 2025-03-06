import React, { useState } from 'react'
import { Link , useNavigate} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import { handleError, handleSuccess } from '../utils';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'; 


function Signup() {

  const [signupInfo, setSignupInfo] = useState({
    name:'',
    email:'',
    password:''
  })

  const [showPassword, setShowPassword] = useState(false); // Track password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle password visibility
  };

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    const copySignupInfo = { ...signupInfo };
    copySignupInfo[name] = value;
    setSignupInfo(copySignupInfo);
  }

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = signupInfo;
    if (!name || !email || !password) {
        return handleError('All fields are required')
    }
    if (password !== confirmPassword) {
      return handleError('Passwords do not match');
    }
    try {
        const url = `http://localhost:1234/auth/signup`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });
        const result = await response.json();
        const { success, message, error } = result;
        if (success) {
            handleSuccess(message);
            setTimeout(() => {
                navigate('/login')
            }, 1000)
        } else if (error) {
            const details = error?.details[0].message;
            handleError(details);
        } else if (!success) {
            handleError(message);
        }
        console.log(result);
    } catch (err) {
        handleError(err);
    }
}

return (
  <div className='container'>
      <h1>Signup</h1>
      <form onSubmit={handleSignup}>
          <div>
              <label htmlFor='name'>
              <FaUser /> Name
              </label>
              <input
                  onChange={handleChange}
                  type='text'
                  name='name'
                  autoFocus
                  placeholder='Enter your name...'
                  value={signupInfo.name}
              />
          </div>
          <div>
              <label htmlFor='email'>
              <FaEnvelope /> Email
              </label>
              <input
                  onChange={handleChange}
                  type='email'
                  name='email'
                  placeholder='Enter your email...'
                  value={signupInfo.email}
              />
          </div>
          <div>
          <label htmlFor="password">
            <FaLock /> Password
          </label>
          <div className="password-container">
            <input
              onChange={handleChange}
              type={showPassword ? "text" : "password"} // Toggle input type
              name="password"
              value={signupInfo.password}
              placeholder="Enter your password..."
            />
            <span onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Toggle eye icon */}
            </span>
          </div>
          </div>
          <div className='password-field'>
          <label htmlFor='confirmPassword'>
          <FaLock /> Confirm Password</label>
          <div className="password-container">
            <input
              onChange={handleChange}
              type={showConfirmPassword ? 'text' : 'password'}
              name='confirmPassword'
              placeholder='Confirm your password...'
            />
            <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
          <button type='submit'>Signup</button>
          <span className='navigate-link'>Already have an account ?
              <Link to="/login"> Login</Link>
          </span>
      </form>
      <ToastContainer />
  </div>
)
}

export default Signup