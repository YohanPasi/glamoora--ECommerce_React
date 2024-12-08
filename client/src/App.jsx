import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './components/ui/auth/layout';
import AuthLogin from './pages/auth/login';
import AuthRegister from './pages/auth/register';
import AdminLayout from './components/admin-view/layout';
import AdminDashboard from './pages/admin-view/dashboard';
import AdminProduct from './pages/admin-view/product';
import AdminOrders from './pages/admin-view/orders';
import AdminFeatures from './pages/admin-view/features';
import ShoppingLayout from './components/shopping-view/layout';
import NotFound from './pages/not-found';
import ShopingHome from './pages/shopping-view/home';
import ShopingListings from './pages/shopping-view/listing';
import ShopingCheckout from './pages/shopping-view/checkout';
import ShopingAccount from './pages/shopping-view/account';
import UnauthPage from './pages/unauth-page';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { checkAuth } from './store/auth-slice';
import { Skeleton } from '@/components/ui/skeleton';

const ProtectedRoute = ({ isAuthenticated, userRole, allowedRoles, redirectTo, children }) => {
    if (!isAuthenticated) {
        return <Navigate to={redirectTo} replace />;
    }

    if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/unauth-page" replace />;
    }

    return children;
};

ProtectedRoute.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    userRole: PropTypes.string.isRequired,
    allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
    redirectTo: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

function App() {
    const { isAuthenticated, isLoading, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);

    const userRole = user?.role || 'guest';

    // Render Skeleton Loading Placeholder
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-black">
                <Skeleton className="w-48 h-6 rounded-md mb-4 bg-gray-500" />
                <Skeleton className="w-36 h-6 rounded-md mb-4 bg-gray-500" />
                <Skeleton className="w-64 h-10 rounded-md bg-gray-500" />
            </div>
        );
    }

    return (
        <div className="flex flex-col overflow-hidden bg-white">
            <Routes>
                {/* Default Route Based on Role */}
                <Route
                    path="/"
                    element={
                        isAuthenticated ? (
                            userRole === 'admin' ? (
                                <Navigate to="/admin/dashboard" replace />
                            ) : (
                                <Navigate to="/shop/home" replace />
                            )
                        ) : (
                            <Navigate to="/auth/login" replace />
                        )
                    }
                />

                {/* Authentication Routes */}
                <Route path="/auth" element={<AuthLayout />}>
                    <Route path="login" element={<AuthLogin />} />
                    <Route path="register" element={<AuthRegister />} />
                </Route>

                {/* Admin Routes */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute
                            isAuthenticated={isAuthenticated}
                            userRole={userRole}
                            allowedRoles={['admin']}
                            redirectTo="/auth/login"
                        >
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="product" element={<AdminProduct />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="features" element={<AdminFeatures />} />
                </Route>

                {/* Shopping Routes */}
                <Route
                    path="/shop"
                    element={
                        <ProtectedRoute
                            isAuthenticated={isAuthenticated}
                            userRole={userRole}
                            allowedRoles={['user']}
                            redirectTo="/auth/login"
                        >
                            <ShoppingLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="home" element={<ShopingHome />} />
                    <Route path="listing" element={<ShopingListings />} />
                    <Route path="checkout" element={<ShopingCheckout />} />
                    <Route path="account" element={<ShopingAccount />} />
                    
                </Route>

                {/* Unauthorized Access */}
                <Route path="/unauth-page" element={<UnauthPage />} />

                {/* Fallback for Unknown Routes */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
}

export default App;
