/* Dark-only wrapper — no theme toggling needed */
export default function ThemeProvider({ children }) {
    return (
        <div className="min-h-screen bg-black text-white">
            {children}
        </div>
    );
}
