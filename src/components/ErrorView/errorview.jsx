import './errorview.css';

const erroview = ({ error }) => {
        return (
            <div className="error-view">
                <img src="https://res.cloudinary.com/duokznlha/image/upload/v1789262807/ChatGPT_Image_Sep_13_2026_06_56_06_AM_kw7mzh.png" alt="Error" className="error-image" />
                <p className="error-message">{error}</p>
            </div>
        )
    }
export default erroview;