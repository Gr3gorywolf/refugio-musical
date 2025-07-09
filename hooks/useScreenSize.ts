import { useState, useEffect } from "react";

export const useScreenSize = () => {
    const [screenSize, setScreenSize] = useState({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
    });
    
    useEffect(() => {
        const handleResize = () => {
        setScreenSize({
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
        });
        };
    
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    
    return screenSize;
}