import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const initialState = {
    userName: '',
    email: '',
    password: '',
};

function AuthRegister() {
    const [formData, setFormData] = useState(initialState);
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Initialize navigate
    const { toast } = useToast(); // Initialize toast

    // Handle form submission
    async function onSubmit(event) {
        event.preventDefault();
        console.log("Form Data Submitted:", formData);

        try {
            const actionResult = await dispatch(registerUser(formData));
            console.log("Action Result:", actionResult);

            if (actionResult.error) {
                console.error("Registration Error:", actionResult.error);
                toast({
                    title: 'Registration Failed',
                    description: actionResult.error.message,
                    variant: 'destructive',
                });
            } else {
                console.log("Registration Success:", actionResult.payload);
                toast({
                    title: 'Registration Successful',
                    description: 'You can now log in!',
                    variant: 'success',
                });
                navigate("/auth/login"); // Redirect to login page after successful registration
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            toast({
                title: 'Unexpected Error',
                description: 'Please try again later.',
                variant: 'destructive',
            });
        }
    }

    return (
        <div className="flex items-center flex-auto justify-end">
            <div className="w-full max-w-md mr-24 bg-white p-0 rounded-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-800">Create New Account</h1>
                    <p className="mt-2 text-black-600">
                        Already have an account? 
                        <Link
                            className="font-medium ml-2 text-blue-600 hover:underline"
                            to='/auth/login'
                        >
                            Login
                        </Link>
                    </p>
                </div>

                <CommonForm
                    formControls={registerFormControls}
                    buttonText={'Signup'}
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={onSubmit}
                />
            </div>
        </div>
    );
}

export default AuthRegister;
