interface AnimatedDividerProps {
    label?: string;
    marker?: string;
}

/** Pulsing-dot + flowing data-stream line section divider. */
export default function AnimatedDivider({ label, marker }: AnimatedDividerProps) {
    return (
        <div aria-hidden className="relative max-w-6xl mx-auto px-6">
            <div className="flex items-center gap-4 py-1">
                <span className="divider-dot" />
                <span className="divider-flow" />
                {(label || marker) && (
                    <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-neutral-500 whitespace-nowrap">
                        {marker && (
                            <span className="mr-1" style={{ color: "rgb(80 140 230 / 0.7)" }}>
                                {marker}
                            </span>
                        )}
                        {label}
                    </span>
                )}
                <span className="divider-flow" />
                <span className="divider-dot" />
            </div>
        </div>
    );
}
