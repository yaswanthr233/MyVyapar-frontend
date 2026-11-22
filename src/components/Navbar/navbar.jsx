import './navbar.css'
const Navbar = () => {
    return (
        <div className="navbar">
            <div className="navbar-left">
                <img src="https://res.cloudinary.com/duokznlha/image/upload/v1794983943/Sales_Img-removebg-preview_uufxxx.png" alt="Logo" className="navbar-logo" />
                <h1 className="navbar-logo-text">MyVyapar</h1>
            </div>
            <div className="navbar-right">
                <div className="user-name-circle">
                    <span className="user-name-logo">{localStorage.getItem('user')?.substr(0, 2).toUpperCase()}</span>
                </div>
            </div>
        </div>
    )
}

export default Navbar