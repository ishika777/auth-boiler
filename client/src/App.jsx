import { createBrowserRouter } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/auth/Login"
import Signup from "./pages/auth/Signup"
import MainLayout from "./components/MainLayout"
import { Navigate, RouterProvider } from "react-router"
import ForgotPassword from "./pages/auth/ForgotPassword"
import ResetPassword from "./pages/auth/ResetPassword"
import VerifyEmail from "./pages/auth/VerifyEmail"
import { useDispatch, useSelector } from "react-redux"
import AdminHome from "./pages/AdminHome"
import { checkAuthentication } from "./actions/user-actions"
import { initializeTheme } from "./store/themeSlice"
import Loading from "./components/shared/Loading"
import { useEffect } from "react"

const ProtectedRoutes = ({children}) => {
    const {isAuthenticated, user} = useSelector(state => state.user);
    if(!isAuthenticated){
        return <Navigate to="/login" replace />
    }
    if(!user?.isVerified){
        return <Navigate to="/verify-email" replace />
    }
    return children;
}

const AuthenticatedUser = ({children}) => {
    const {isAuthenticated, user} = useSelector(state => state.user); //cannot go back to login and signup page if a user is authenticated
    if(isAuthenticated && user?.isVerified){
        return <Navigate to="/" replace />
    }
    return children;
}

const AdminProtectedRoute = ({children}) => {
    const {isAuthenticated, user} = useSelector(state => state.user);
    if(!isAuthenticated){
        return <Navigate to="/login" replace />
    }
    if(!user?.admin){
        return <Navigate to="/" replace />
    }
    return children;
}

const appRouter = createBrowserRouter([
    {
        path : "/",
        element : <ProtectedRoutes><MainLayout /></ProtectedRoutes>,
        children : [
            {
                path : "/",
                element : <Home />,
            },
            {
                path : "/admin/yes",
                element : <AdminProtectedRoute><AdminHome /></AdminProtectedRoute>,
            },
        ]
    },
    {
        path : "/login",
        element : <AuthenticatedUser><Login /></AuthenticatedUser>,
    },
    {
        path : "/signup",
        element : <AuthenticatedUser><Signup /></AuthenticatedUser>,
    },
    {
        path : "/forgot-password",
        element : <ForgotPassword />,
    },
    {
        path : "/reset-password/:resetToken",
        element : <ResetPassword />,
    },
    {
        path : "/verify-email",
        element : <AuthenticatedUser><VerifyEmail /></AuthenticatedUser>,
    },
    
])

function App() {

    const {isCheckingAuth, user} = useSelector(state => state.user);
    const dispatch = useDispatch();
    
    useEffect(() => {
        checkAuthentication(dispatch)
        initializeTheme()
    }, [checkAuthentication])

    if(isCheckingAuth){
        return <Loading />
    }
    if(!user){
        return <Loading />
    }


  return (

    <RouterProvider router={appRouter}></RouterProvider>
  )
}

export default App
