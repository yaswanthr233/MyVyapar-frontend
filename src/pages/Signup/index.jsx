import './signup.css'
import { FaRegUser } from "react-icons/fa6";
import { LuMail } from "react-icons/lu";
import { MdLockOutline } from "react-icons/md";
import { MdOutlinePhone } from "react-icons/md";
import { useState } from 'react';
import { FaArrowRight } from "react-icons/fa";
import { PulseLoader } from "react-spinners";
import { Navigate,useNavigate } from 'react-router'
import Cookies from 'js-cookie'

const Signup = () => {
    if(Cookies.get('token')){
        return <Navigate to='/dashboard' />;
    }
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        password: '',
        businessName: '',
        businessType: '',
        address: ''
    });
    const [error, setError] = useState('');
    const onSubmitGoToBusinessDetails = (e) => {
        e.preventDefault();
        if(formData.name === '' || formData.email === '' || formData.phoneNumber === '' || formData.password === ''){
            setError('Please fill all the required fields');
            return;
        } 
        setError('');
        setStep(step + 1);
    }

    const onSubmitRegistration = async (e) => {
        e.preventDefault();
        if(formData.businessName === '' || formData.businessType === ''){
            setError('Please fill all the required fields');
            return;
        }
        setError('');
        try{
            setIsLoading(true);
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            }
            const response = await fetch(`${import.meta.env.VITE_API_URL}/users/register`, options);
            if(response.ok){
                setError('');
                navigate('/login');
            }
            const data = await response.json();
            if(data.message){
                setError(data.message);
            }

        } catch(err){
            setError('Something went wrong. Please try again later');
        } finally{
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

    const renderBusinessDetailsForm = () => {
        return (
            <>
            <h1 className="signup-create-account-text">Business Details</h1>
                <p className="signup-subtext">Let's get to know your business</p>
                <form className="signup-form" onSubmit={onSubmitRegistration}>
                    <label htmlFor="business-name" className="business-label">Business Name <span className="required">*</span></label>
                    <div className="signup-business-name-container">
                        <input type="text" id="business-name" className="business-input" placeholder="Enter your business name" value={formData.businessName} onChange={(e) => setFormData({...formData, businessName: e.target.value})} />
                    </div>
                    <label htmlFor="business-name" className="business-label">Business Type <span className="required">*</span></label>
                    <div className="signup-business-type-container">
                        <select id="business-type" className="business-select" value={formData.businessType} onChange={(e) => setFormData({...formData, businessType: e.target.value})}>
                            <option value="">Select your business type</option>
                            <option value="retail">Retail</option>
                            <option value="service">Service</option>
                            <option value="manufacturing">Manufacturing</option>
                            <option value="wholesale">Wholesale</option>
                        </select>
                    </div>
                    <label htmlFor="business-address" className="business-label">Business Address <span className="optional">(optional)</span></label>
                    <div className="signup-business-address-container">
                        <input type="text" id="business-address" className="business-input" placeholder="Enter your business address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                    </div>
                    {error && <p className="signup-error">{error}</p>}
                    <div className="signup-business-previous-submit-container">
                        <button type="button" className="signup-previous-button" onClick={() => setStep(step - 1)}>Previous</button>
                        {
                            isLoading ? renderLoadingSpinner() : <button type="submit" className="signup-button-In-business">Submit</button>
                        }
                    </div>
                </form>
                <p className="signup-login-text">Already have an account? <a href="/login" className="signup-login-link">Login</a></p>
            </>
        )
    }

    const renderRegistrationForm = () => {
        return (
            <>
            <h1 className="signup-create-account-text">Create Account</h1>
                <p className="signup-subtext">Start your business journey</p>
                <form className="signup-form" onSubmit={onSubmitGoToBusinessDetails}>
                    <div className="signup-name-container">
                        <FaRegUser className="signup-name-icon" size={20} color='#000'/>
                        <input type="text" id="name" className="signup-input" placeholder="Enter your name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="signup-email-container">
                        <LuMail className="signup-email-icon" size={20} color='#000'/>
                        <input type="email" id="email" className="signup-input" placeholder="Enter your email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div className="signup-phone-container">
                        <MdOutlinePhone className="signup-phone-icon" size={20} color='#000'/>
                        <input type="text" id="phone" className="signup-input" placeholder="Enter your phone number" value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} />
                    </div>
                    <div className="signup-password-container">
                        <MdLockOutline className="password-icon" size={20} color='#000'/>
                        <input type="password" id="password" className="signup-input" placeholder="Enter your password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                    </div>
                    {error && <p className="signup-error">{error}</p>}
                    <button type="submit" className="signup-button">Next <FaArrowRight /></button>
                </form>
                <p className="signup-login-text">Already have an account? <a href="/login" className="signup-login-link">Login</a></p>
            </>
        )
    }
    return (
        <div className="signup-container">
            <div className="signup-left-container">
                <div className="signup-logo-container">
                    <img src="https://res.cloudinary.com/duokznlha/image/upload/v1794983943/Sales_Img-removebg-preview_uufxxx.png" alt="Logo" className="logo" />
                    <h1 className="signup-logo-text">MyVyapar</h1>
                </div>
                <img className="signup-image" src="https://res.cloudinary.com/duokznlha/image/upload/v1794983942/Vector_illustration_for_business__7bac74f7-removebg-preview_eldy18.png" alt="Signup" />
                
            </div>
            <div className="signup-right-container">
                <>
                    <div className="signup-step-container">
                        <div className={step === 1 ? "signup-step active-step" : "signup-step"}/>
                        <div className={step === 2 ? "signup-step active-step" : "signup-step"}/>
                    </div>
                    {step === 1 ? renderRegistrationForm() : renderBusinessDetailsForm()}
                </>
            </div>

        </div>
    )
}

export default Signup;