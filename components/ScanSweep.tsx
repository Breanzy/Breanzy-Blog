/** Soft accent-tinted scan band that rolls down the hero every 7 s. */
export default function ScanSweep() {
    return (
        <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden z-[19]">
            <div
                className="absolute inset-x-0 h-[140px] opacity-50"
                style={{
                    background:
                        "linear-gradient(180deg, transparent, rgb(80 140 230 / 0.14) 50%, transparent)",
                    animation: "scan-sweep 7s linear infinite",
                }}
            />
        </div>
    );
}
