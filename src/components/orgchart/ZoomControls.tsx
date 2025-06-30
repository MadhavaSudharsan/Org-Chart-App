import React, { useState, useEffect } from "react";

interface ZoomControlsProps {
    onZoomIn: () => void;
    onZoomOut: () => void;
    onResetZoom: () => void;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({
    onZoomIn,
    onZoomOut,
    onResetZoom,
}) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div
            style={{
                position: "absolute",
				...(isMobile ? { top: 670 } : { bottom: 7 }),
				...(isMobile ? { right: 14 } : { right: 10 }),
                display: "flex",
                gap: 8,
                backgroundColor: "#fff",
                padding: 8,
                borderRadius: 4,
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                zIndex: 1000,
            }}
        >
            <button
                onClick={onZoomIn}
                style={{
                    background: "#ff5a00",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: 4,
                    cursor: "pointer",
                }}
            >
                +
            </button>
            <button
                onClick={onZoomOut}
                style={{
                    background: "#ff5a00",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: 4,
                    cursor: "pointer",
                }}
            >
                -
            </button>
            <button
                onClick={onResetZoom}
                style={{
                    background: "#ff5a00",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: 4,
                    cursor: "pointer",
                }}
            >
                Reset
            </button>
        </div>
    );
};

export default ZoomControls;
