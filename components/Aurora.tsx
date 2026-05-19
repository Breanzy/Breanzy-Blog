/** Matte aurora blobs — low saturation deep-blue glow orbs for hero backgrounds. */
export default function Aurora() {
    return (
        <div
            aria-hidden
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ zIndex: 1 }}
        >
            <div
                className="absolute rounded-full blur-[140px] opacity-30"
                style={{ width: 560, height: 560, left: "5%", top: -180, background: "#1a3a78" }}
            />
            <div
                className="absolute rounded-full blur-[160px] opacity-25"
                style={{ width: 640, height: 640, right: "-10%", top: 260, background: "#0f244c" }}
            />
            <div
                className="absolute rounded-full blur-[180px] opacity-20"
                style={{ width: 480, height: 480, left: "40%", top: 460, background: "#13315e" }}
            />
        </div>
    );
}
