import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { motion } from "framer-motion";

/* Reusable dark modal — wraps Headless UI Dialog with noir styling.
   Props: show, onClose, title (optional), children */
export default function Modal({ show, onClose, title, children }) {
    return (
        <Dialog open={show} onClose={onClose} className="relative z-50">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70"
                aria-hidden="true"
            />

            {/* Centered panel */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="w-full max-w-md">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-xl"
                    >
                        {title && (
                            <DialogTitle className="text-white text-lg font-semibold mb-4">
                                {title}
                            </DialogTitle>
                        )}
                        {children}
                    </motion.div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}
