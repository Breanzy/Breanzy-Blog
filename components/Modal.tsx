"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { motion } from "framer-motion";

interface ModalProps {
    show: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

export default function Modal({ show, onClose, title, children }: ModalProps) {
    return (
        <Dialog open={show} onClose={onClose} className="relative z-50">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70"
                aria-hidden="true"
            />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="w-full max-w-md">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
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
