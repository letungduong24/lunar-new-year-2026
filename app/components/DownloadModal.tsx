"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Info } from "lucide-react";
import Image from "next/image";

interface DownloadModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageSrc: string;
    fileName: string;
}

export default function DownloadModal({ isOpen, onClose, imageSrc, fileName }: DownloadModalProps) {
    const handleDownload = () => {
        const link = document.createElement("a");
        link.download = fileName;
        link.href = imageSrc;
        link.click();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-sm bg-[#fdf6e3] rounded-[2rem] overflow-hidden shadow-2xl border-2 border-[#c6ac8f]/30"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-[#c6ac8f]/20 bg-[#f2e8cf]/50">
                            <h3 className="text-[#bc4749] font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                                <Download size={16} /> Lưu ảnh của bạn
                            </h3>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-[#bc4749]/10 rounded-full text-[#bc4749] transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Image Preview */}
                        <div className="p-4 flex flex-col items-center gap-4">
                            <div className="relative w-full aspect-[9/16] max-h-[60vh] rounded-xl overflow-hidden shadow-lg border border-[#c6ac8f]/20">
                                <img
                                    src={imageSrc}
                                    alt="Generated Story"
                                    className="w-full h-full object-contain bg-white"
                                />
                            </div>

                            {/* Instructions for Mobile */}
                            <div className="w-full bg-[#bc4749]/5 p-4 rounded-2xl flex flex-col gap-2">
                                <p className="text-xs text-[#5e503f] font-medium flex items-start gap-2">
                                    <Info size={14} className="text-[#bc4749] shrink-0 mt-0.5" />
                                    <span>
                                        Nếu bạn đang mở bằng <strong>Messenger, Instagram, Zalo...</strong> và không tải được:
                                    </span>
                                </p>
                                <p className="text-sm text-[#bc4749] font-bold text-center py-1">
                                    👉 Nhấn giữ vào ảnh trên và chọn "Lưu hình ảnh"
                                </p>
                            </div>

                            {/* Download Button for standard browsers */}
                            <button
                                onClick={handleDownload}
                                className="w-full bg-[#bc4749] text-white py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 font-bold uppercase tracking-widest hover:bg-[#a3393b] transition-all"
                            >
                                <Download size={20} /> Tải ảnh trực tiếp
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
