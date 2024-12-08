import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

// Import background images
import backgroundImage1 from "../../../../src/register-images/image01.jpeg";
import backgroundImage2 from "../../../../src/register-images/image03.jpeg";
import backgroundImage3 from "../../../../src/register-images/image04.jpeg";
import backgroundImage4 from "../../../../src/register-images/logo.jpeg";  // Assuming you want to keep the logo as one of the images

function AuthLayout() {
    // State to manage the current background image index
    const [bgImageIndex, setBgImageIndex] = useState(0);

    // Array of background images
    const backgroundImages = [
        backgroundImage1,
        backgroundImage2,
        backgroundImage3,
        backgroundImage4
    ];

    // Change background image every 5 seconds (auto slide)
    useEffect(() => {
        const intervalId = setInterval(() => {
            setBgImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
        }, 5000); // 5000 ms = 5 seconds

        // Clean up the interval on component unmount
        return () => clearInterval(intervalId);
    }, [backgroundImages.length]); // Dependency array with backgroundImages.length


    return (
        <div className="flex h-screen w-screen">
            {/* Left Section with Dynamic Background Image */}
            <div
                className="hidden lg:flex items-center justify-center bg-cover bg-center w-1/2 px-14 relative animate-fadeIn transition-all duration-1000"
                style={{ backgroundImage: `url(${backgroundImages[bgImageIndex]})` }}
            >
                {/* Dark overlay to make the text stand out more */}
                <div className="absolute inset-0 bg-black opacity-40"></div>
               
            </div>

            {/* Right Section (Auth Form Area) */}
            <div className="flex flex-1 items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8 relative z-10">
                <div className="w-full max-w-md space-y-4 animate-fadeIn">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default AuthLayout;
