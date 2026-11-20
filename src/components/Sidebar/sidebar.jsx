import './sidebar.css'
import { AiFillHome } from "react-icons/ai";
import { Link } from "react-router";
import { IoDocument ,IoSettings} from "react-icons/io5";
import { FaSuitcase } from "react-icons/fa6";
import { ImUsers } from "react-icons/im";
import { IoMdCart} from "react-icons/io";
import { FaDollarSign } from "react-icons/fa";
import { TbLogout2 } from "react-icons/tb";
import Cookies from 'js-cookie'
import {useNavigate} from 'react-router'

const Sidebar = () => {

    const navigate = useNavigate();

    const onLogout = () => {
        localStorage.removeItem('user');
        Cookies.remove('token');
        navigate('/login', { replace: true });
    }


    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <img src="https://res.cloudinary.com/duokznlha/image/upload/v1794983943/Sales_Img-removebg-preview_uufxxx.png" alt="Logo" className="sidebar-logo" />
                <h1 className="sidebar-logo-text">MyVyapar</h1>
            </div>
            <div className="sidebar-menu">
                <Link to="/" className="sidebar-menu-link">
                    <AiFillHome color="#00205f" size="20px" />
                    <span className="sidebar-menu-text">Dashboard</span>
                </Link>
                <Link to="/billing" className="sidebar-menu-link">
                    <IoDocument color="#00205f" size="20px" />
                    <span className="sidebar-menu-text">Billing</span>
                </Link>
                <Link to="/inventory" className="sidebar-menu-link">
                    <FaSuitcase color="#00205f" size="20px" />
                    <span className="sidebar-menu-text">Inventory</span>
                </Link>
                <Link to="/customers" className="sidebar-menu-link">
                    <ImUsers color="#00205f" size="20px" />
                    <span className="sidebar-menu-text">Customers</span>
                </Link>
                <Link to="/purchases" className="sidebar-menu-link">
                    <IoMdCart color="#00205f" size="20px" />
                    <span className="sidebar-menu-text">Purchases</span>
                </Link>
                <Link to="/credit-collections" className="sidebar-menu-link">
                    <FaDollarSign color="#00205f" size="20px" />
                    <span className="sidebar-menu-text">Credit & Collections</span>
                </Link>
                <Link to="/settings" className="sidebar-menu-link">
                    <IoSettings color="#00205f" size="20px" />
                    <span className="sidebar-menu-text">Settings</span>
                </Link>
            </div>    
            <div className="sidebar-footer">
                <div className="user-name-container">
                    <div className="user-name-circle">
                        <span className="user-name-logo">{localStorage.getItem('user')?.substr(0, 2)}</span>
                    </div>
                    <div>
                        <p className="user-name-text">{localStorage.getItem('user')}</p>
                    </div>
                </div>
                <button className="logout-button" type="button" onClick={() => onLogout()}>
                    <TbLogout2 color="#00205f" size="20px" />
                    <span className="logout-text">Logout</span>
                </button>
            </div>
        </div>
    )
}

export default Sidebar;