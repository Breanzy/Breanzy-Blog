/**
 * Decorative animated gradient orb background.
 * Each orb uses a CSS keyframe class (orb-a / orb-b / orb-c) defined in globals.css.
 * Pass a custom `orbs` array to override the defaults.
 */

interface OrbConfig {
    /** Tailwind position classes, e.g. "top-[-10%] left-[-8%]" */
    className: string;
    /** CSS color for the radial-gradient center */
    color: string;
    /** CSS size string, e.g. "560px" */
    size: string;
    opacity: number;
    /** Which keyframe animation to use */
    animClass: "orb-a" | "orb-b" | "orb-c";
}

const DEFAULT_ORBS: OrbConfig[] = [
    { className: "top-[-10%] left-[-8%]",   color: "#2563eb", size: "560px", opacity: 0.18, animClass: "orb-a" },
    { className: "top-[10%] right-[-6%]",   color: "#7c3aed", size: "420px", opacity: 0.12, animClass: "orb-b" },
    { className: "bottom-[-5%] left-[35%]", color: "#0d9488", size: "320px", opacity: 0.09, animClass: "orb-c" },
];

interface GradientOrbsProps {
    orbs?: OrbConfig[];
    className?: string;
}

export default function GradientOrbs({ orbs = DEFAULT_ORBS, className = "" }: GradientOrbsProps) {
    return (
        <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
            {orbs.map((orb, i) => (
                <div
                    key={i}
                    className={`${orb.animClass} absolute rounded-full blur-3xl ${orb.className}`}
                    style={{
                        width: orb.size,
                        height: orb.size,
                        opacity: orb.opacity,
                        background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
                    }}
                />
            ))}
        </div>
    );
}
