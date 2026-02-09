"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function Loading({ isReady }: { isReady: boolean }) {
    return (
        <AnimatePresence>
            {!isReady && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-[#fdf6e3]"
                >
                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />

                    <div className="relative flex flex-col items-center gap-4">
                        <div
                            className="animate-spin size-12 border-4 border-[#bc4749] border-t-transparent rounded-full shadow-[0_0_15px_rgba(188,71,73,0.3)]"
                            role="status"
                            aria-label="loading"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}