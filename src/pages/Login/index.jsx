import './login.css'
import { HiOutlineMail } from "react-icons/hi";
import { MdLockOutline } from "react-icons/md";
import { useState} from 'react';
import {Navigate, useNavigate } from 'react-router';
import { PulseLoader } from "react-spinners";
import Cookies from 'js-cookie'


const userDetails = {
    email: '',
    password: ''
}

const Login = () => {
    if(Cookies.get('token')){
        return <Navigate to='/dashboard' />;
    }
    const [user, setUser] = useState(userDetails);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try{
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({ email: user.email, password: user.password })
            }
            if(!user.email || !user.password){
                setError('Please fill in all fields');
                setIsLoading(false);
                return;
            }
            const response = await fetch(`${import.meta.env.VITE_API_URL}/users/login`,options)
            const data = await response.json();
            if(!response.ok){
                setError(data.message);
            } else {
                Cookies.set('token', data.token, { expires: 7 });
                navigate('/dashboard');
            }
        } catch (error) {
            setError('Something went wrong. Please try again later...');
        } finally {
            setIsLoading(false);
        }
    }

    const renderLoadingSpinner = () => {
        return (
            <div className="loading-spinner">
                <PulseLoader color="#3661d7" />
            </div>
        )
    }

    return (
        <div className="login-container">
            <div className="login-top-container">
                <div className="logo-container">
                    <img src="https://res.cloudinary.com/duokznlha/image/upload/v1794983943/Sales_Img-removebg-preview_uufxxx.png" alt="Logo" className="logo" />
                    <h1 className="logo-text">MyVyapar</h1>
                </div>
                <p className="login-left-text">Grow Your Business Smarter & Simpler</p>
                <p className="login-left-subtext">Manage Billing, Inventory, Customersand Credit - All in One Place</p>
                <img className="login-image" src="https://res.cloudinary.com/duokznlha/image/upload/v1794983942/Vector_illustration_for_business__7bac74f7-removebg-preview_eldy18.png" alt="Login" />
            </div>
            <div className="login-bottom-container">
                <h2 className="login-heading">Welcome Back!</h2>
                <p className="login-subheading">Login to your account</p>
                <form className="login-form" onSubmit={handleLogin}>
                    <div className="email-container">
                        <HiOutlineMail className="email-icon" size={20} color='#000'/>
                        <input type="email" id="email" className="login-input" placeholder="Enter your email" value={user.email} onChange={(e) => setUser({...user, email: e.target.value})} />
                    </div>
                    <div className="password-container">
                        <MdLockOutline className="password-icon" size={20} color='#000'/>
                        <input type="password" id="password" className="login-input" placeholder="Enter your password" value={user.password} onChange={(e) => setUser({...user, password: e.target.value})} />
                    </div>
                    <div className="forgot-container">
                        <a href="#" className="forgot-text-link">Forgot Password?</a>
                    </div>
                    {error && <p className="error-text">{error}</p>}
                    {
                        isLoading? renderLoadingSpinner(): 
                    <button type="submit" className="login-button"  disabled={isLoading}>
                        Login
                    </button>
                    }
                    
                </form>
                <div className="login-signup-container">
                        <p className="signup-text">Don't have an account? <a href="/signup" className="signup-link">Sign up</a></p>
                    </div>
            </div>
        </div>
    )
}
export default Login