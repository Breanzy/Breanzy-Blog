import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

/* Reusable dark modal — wraps Headless UI Dialog with noir styling.
   Props: show, onClose, title (optional), children */
export default function Modal({ show, onClose, title, children }) {
    return (
        <Dialog open={show} onClose={onClose} className="relative z-50">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/70" aria-hidden="true" />

            {/* Centered panel */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-xl">
                    {title && (
                        <DialogTitle className="text-white text-lg font-semibold mb-4">
                            {title}
                        </DialogTitle>
                    )}
                    {children}
                </DialogPanel>
            </div>
        </Dialog>
    );
}
