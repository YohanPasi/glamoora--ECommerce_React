import CommonForm from "@/components/common/form";
import { loginFormControls } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { loginUser, clearError } from "@/store/auth-slice";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const initialState = {
    email: '',
    password: '',
};

function AuthLogin() {
    const [formData, setFormData] = useState(initialState);
    const [loading, setLoading] = useState(false); // Loader state
    const { toast } = useToast();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { error, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/shop/home'); // Redirect if already logged in
        }
    }, [isAuthenticated, navigate]);

    // Handle form submission
    const onSubmit = (event) => {
        event.preventDefault();
    
        // Client-side validation
        if (!formData.email || !formData.password) {
            return toast({
                title: 'Validation Error',
                description: 'Email and password are required.',
                variant: 'destructive',
            });
        }
    
        setLoading(true); // Show loader during submission
    
        dispatch(loginUser(formData)).then((result) => {
            setLoading(false); // Hide loader after submission
    
            console.log("Login Response:", result.payload); // Debug log
    
            if (result.payload?.success) {
                toast({
                    title: 'Login Successful',
                    description: `Welcome back, ${result.payload.user.userName}!`, // Fallback if userName is missing
                    variant: 'success',
                });
                // Redirect based on role
                if (result.payload.user.role === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/shop/home');
                }
            } else {
                toast({
                    title: 'Login Failed',
                    description: result.payload || 'Invalid credentials. Please try again.',
                    variant: 'destructive',
                });
            }
        });
    };
    

    // Clear errors on unmount or user input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (error) {
            dispatch(clearError()); // Clear error as user types
        }
    };

    useEffect(() => {
        if (error) {
            toast({
                title: 'Error',
                description: error,
                variant: 'destructive',
            });
            dispatch(clearError());
        }
    }, [error, dispatch, toast]);

    return (
        <div className="flex items-center flex-auto justify-end">
            <div className="w-full max-w-md mr-24 bg-white p-0 rounded-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-800">Sign In to Account</h1>
                    <p className="mt-2 text-black-600">
                        Don&apos;t have an account?
                        <Link
                            className="font-medium ml-2 text-blue-600 hover:underline"
                            to='/auth/register'
                        >
                            Register
                        </Link>
                    </p>
                </div>
                <CommonForm
                    formControls={loginFormControls}
                    buttonText={loading ? 'Signing In...' : 'Signin'}
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={onSubmit}
                    handleInputChange={handleInputChange}
                    isDisabled={loading} // Disable form while loading
                />
            </div>
        </div>
    );
}

export default AuthLogin;
