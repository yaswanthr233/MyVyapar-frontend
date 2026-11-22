import './footer.css';
import { AiFillHome } from "react-icons/ai";
import { IoDocument } from "react-icons/io5";
import { FaSuitcase } from "react-icons/fa6";
import { ImUsers } from "react-icons/im";
import { Link } from "react-router";    
import { IoIosAdd } from "react-icons/io";

const Footer = () => {
    return (
        <footer className="footer-container">
            <Link to="/dashboard" className="footer-menu-link">
                <AiFillHome color="#00205f" size="20px" />
                <span className="footer-menu-text">Home</span>
            </Link>
            <Link to="/billing" className="footer-menu-link">
                <IoDocument color="#00205f" size="20px" />
                <span className="footer-menu-text">Billing</span>
            </Link>
            <Link to="/inventory" className="footer-menu-link">
                <FaSuitcase color="#00205f" size="20px" />
                <span className="footer-menu-text">Inventory</span>
            </Link>
            <Link to="/customers" className="footer-menu-link">
                <ImUsers color="#00205f" size="20px" />
                <span className="footer-menu-text">Customers</span>
            </Link>
            <button className="footer-menu-link btn-more">
                <IoIosAdd color="#00205f" size="20px" />
                <span className="footer-menu-text">More</span>
            </button>
        </footer>
    );
}

export default Footer;