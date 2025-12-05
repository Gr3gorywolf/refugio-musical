import { useState, useEffect } from "react";

export const useScreenSize = () => {
    const browserWindow = typeof window !== "undefined" ? window: null;
    const [screenSize, setScreenSize] = useState({
        screenWidth: browserWindow?.innerWidth,
        screenHeight: browserWindow?.innerHeight,
    });
    
    useEffect(() => {
        const handleResize = () => {
        setScreenSize({
            screenWidth: browserWindow?.innerWidth,
            screenHeight: browserWindow?.innerHeight,
        });
        };
    
        browserWindow?.addEventListener("resize", handleResize);
        return () => browserWindow?.removeEventListener("resize", handleResize);
    }, []);
    
    return screenSize;
}