"use client";

/**
 * Thin wrapper around react-parallax-tilt that applies our site-wide
 * tilt + glare preset. Import this instead of the library directly so
 * settings (max angle, glare opacity, perspective) stay in one place.
 */

import Tilt from "react-parallax-tilt";

interface TiltCardProps {
    children: React.ReactNode;
    className?: string;
    /** Max rotation in degrees on each axis. Default 10 */
    maxTilt?: number;
    /** Glare max opacity 0–1. Default 0.10 */
    glareOpacity?: number;
}

export default function TiltCard({
    children,
    className = "",
    maxTilt = 10,
    glareOpacity = 0.10,
}: TiltCardProps) {
    return (
        <Tilt
            tiltMaxAngleX={maxTilt}
            tiltMaxAngleY={maxTilt}
            glareEnable
            glareMaxOpacity={glareOpacity}
            glareColor="rgba(255,255,255,1)"
            glarePosition="all"
            perspective={1200}
            transitionSpeed={600}
            className={className}
        >
            {children}
        </Tilt>
    );
}
