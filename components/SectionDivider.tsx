import FadeIn from "./FadeIn";

interface SectionDividerProps {
    /** Numeric or alphanumeric section label, e.g. "01" */
    index: string;
    /** Human-readable section name shown on the right */
    label: string;
}

/** Animated section divider with a flowing dashed accent line. */
export default function SectionDivider({ index, label }: SectionDividerProps) {
    return (
        <FadeIn variant="left" className="flex items-center gap-4 mb-10">
            <span className="text-blue-500/60 text-xs font-mono tracking-widest shrink-0">{index}</span>
            <div className="divider-flow flex-1" />
            <span className="text-neutral-600 text-xs uppercase tracking-widest shrink-0">{label}</span>
        </FadeIn>
    );
}
