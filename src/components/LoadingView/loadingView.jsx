import './loadingView.css';
import { PulseLoader } from 'react-spinners';
const LoadingView = () => {
    return (
        <div className="loading-spinner">
                <PulseLoader color="#3661d7" />
            </div>
    )
}

export default LoadingView;