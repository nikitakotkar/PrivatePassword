import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'; 

function Login() {

    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    })

    const [showPassword, setShowPassword] = useState(false); // Track password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword); // Toggle password visibility
    };

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        const copyLoginInfo = { ...loginInfo };
        copyLoginInfo[name] = value;
        setLoginInfo(copyLoginInfo);
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;
        if (!email || !password) {
            return handleError('email and password are required')
        }
        try {
            const url = `http://localhost:1234/auth/login`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginInfo)
            });
            const result = await response.json();
            const { success, message, jwtToken, name, error } = result;
            if (success) {
                handleSuccess(message);
                localStorage.setItem('token', jwtToken);
                localStorage.setItem('loggedInUser', name);
                setTimeout(() => {
                    navigate('/home')
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
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor='email'><FaEnvelope /> Email</label>
                    <input
                        onChange={handleChange}
                        type='email'
                        name='email'
                        placeholder='Enter your email...'
                        value={loginInfo.email}
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
                              value={loginInfo.password}
                              placeholder="Enter your password..."
                            />
                            <span onClick={togglePasswordVisibility}>
                              {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Toggle eye icon */}
                            </span>
                          </div>
                          </div>
                <button type='submit'>Login</button>
                <span>Does't have an account ?
                    <Link to="/signup"> Signup</Link>
                </span>
            </form>
            <ToastContainer />
        </div>
    )
}

export default Login