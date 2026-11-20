import Cookie from 'js-cookie';
import {Navigate} from 'react-router'
const ProtectedRoute = ({children}) => {
    if(!Cookie.get('token')){
        return <Navigate to="/login" replace={true} />
    }
    return children;
}
export default ProtectedRoute;