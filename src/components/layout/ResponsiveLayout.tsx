import React, { useState, useEffect } from "react";
import MobileHeader from "../mobile/MobileHeader";

interface ResponsiveLayoutProps {
    logo: string;
    sidebar: React.ReactNode;
    main: React.ReactNode;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ logo, sidebar, main }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    // Check if screen is mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
            // Auto-collapse on mobile when switching to desktop
            if (window.innerWidth > 768) {
                setIsExpanded(false);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    // Mobile Layout
    if (isMobile) {
        return (
            <>
                <MobileHeader 
                    logo={logo}
                    isExpanded={isExpanded}
                    onToggle={toggleExpanded}
                />
                <div style={{
                    height: isExpanded ? "calc(100vh - 60px)" : "100vh",
                    overflow: "hidden"
                }}>
                    {main}
                </div>
            </>
        );
    }

    return (
        <div className="app">
            {sidebar}
            <div className="main">
                {main}
            </div>
        </div>
    );
};

export default ResponsiveLayout;