"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { toPng } from "html-to-image";
import { Download, ChevronLeft, CheckCircle2, Circle, RotateCcw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import DownloadModal from "../components/DownloadModal";

const checklistItems = [
    "Đi du lịch một nơi mới",
    "Cười thật nhiều",
    "Đưa ra quyết định lớn",
    "Nói 'Con yêu bố mẹ'",
    "Ôm một người bạn thương yêu",
    "Đã khóc thật to",
    "Có thêm những người bạn mới",
    "Chăm chỉ tập thể thao",
    "Đi du lịch với bạn thân",
    "Say khướt một trận",
    "Có một nụ hôn hoàn hảo",
    "Bị tan vỡ trái tim",
    "Phải lòng một ai đó",
    "Thầm thương trộm nhớ",
    "Nhuộm một màu tóc mới",
    "Đi hẹn hò",
    "Ngắm hoàng hôn",
    "Đón bình minh",
    "Đọc một cuốn sách hay",
    "Đi xem phim rạp",
    "Đi du lịch nước ngoài",
    "Bị cháy nắng",
    "Đi biển",
    "Đi leo núi",
    "Thức trắng cả một đêm",
    "Đi xem concert",
    "Xăm mình / Xỏ khuyên",
    "Đi du lịch một mình",
    "Thử một điều mới mẻ",
    "Đi tham quan bảo tàng",
    "Học một nhạc cụ mới",
    "Ước mơ thành hiện thực",
    "Ngủ nhà một người lạ",
    "Đi quẩy bar/club",
    "Tiệc tùng hết mình",
    "Đi picnic / dã ngoại",
];

export default function ChecklistPage() {
    const [checked, setChecked] = useState<number[]>([]);
    const [isExporting, setIsExporting] = useState(false);
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [exportedImageUrl, setExportedImageUrl] = useState("");
    const exportRef = useRef<HTMLDivElement>(null);


    const toggleItem = (index: number) => {
        setChecked((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    };

    const exportImage = async () => {
        if (exportRef.current === null) return;
        setIsExporting(true);
        try {
            const dataUrl = await toPng(exportRef.current, { cacheBust: true, pixelRatio: 2 });
            setExportedImageUrl(dataUrl);
            setShowDownloadModal(true);

            const link = document.createElement("a");
            link.download = `my-2025-checklist.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error("Export failed", err);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <main className="relative min-h-screen w-full flex flex-col items-center p-4 pt-24 md:pt-32 overflow-x-hidden bg-[#fdf6e3]">
            {/* Background Layer (bg.jpg) */}
            <div className="absolute inset-0 -z-30">
                <Image
                    src="/bg.jpg"
                    alt="Vintage Background"
                    fill
                    className="object-cover"
                    priority
                />
            </div>
            <div className="absolute inset-0 vintage-overlay -z-20" />

            {/* Back Button */}
            <div className="absolute top-6 left-6 z-50">
                <Link href="/" className="flex items-center gap-2 px-4 py-2 bg-[#f2e8cf]/80 backdrop-blur-md rounded-full border border-[#c6ac8f]/30 text-[#bc4749] hover:bg-[#bc4749]/10 transition-all">
                    <ChevronLeft size={20} />
                    <span className="text-sm font-medium">Quay lại</span>
                </Link>
            </div>

            {/* Main Content Container */}
            <div className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">

                {/* Header/Title Section */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="hidden lg:flex flex-col items-start gap-4 max-w-xs"
                >
                    <h2 className="text-xl font-display tracking-[0.3em] text-[#9d8189] uppercase">
                        2025 Checklist
                    </h2>
                    <h1 className="text-5xl font-display text-[#bc4749] leading-none uppercase drop-shadow-sm">
                        TỔNG KẾT <br /> MỘT NĂM
                    </h1>
                    <p className="text-lg font-serif italic text-[#5e503f] opacity-80">
                        "Lưu lại những cột mốc đáng nhớ trong năm qua."
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={exportImage}
                        disabled={isExporting}
                        className="mt-4 bg-[#bc4749] text-white px-8 py-3 rounded-full shadow-lg flex items-center justify-center gap-2 font-medium transition-all hover:bg-[#a3393b] disabled:opacity-50"
                    >
                        {isExporting ? <RotateCcw size={18} className="animate-spin" /> : <Download size={18} />}
                        Lưu ảnh Story
                    </motion.button>
                </motion.div>

                {/* Story Export Preview Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, type: "spring", damping: 20 }}
                    className="relative flex flex-col items-center gap-4"
                >
                    <div
                        ref={exportRef}
                        className="bg-[#fdf6e3]/80 rounded-2xl p-6 shadow-2xl border-2 border-[#c6ac8f]/30 relative overflow-hidden aspect-[9/16] w-[320px] md:w-[420px] flex-shrink-0"
                    >

                        {/* Blurred Background Image inside Card */}
                        <div
                            className="absolute inset-0 -z-20 bg-center bg-cover blur-[4px] opacity-60"
                            style={{ backgroundImage: "url('/bg.jpg')" }}
                        />

                        {/* Background Image inside Checklist */}
                        <div className="absolute inset-0 -z-10 opacity-50 mix-blend-multiply flex items-center justify-center">
                            <Image src="/horse.jpg" alt="Horse Background" fill className="object-contain" />
                        </div>

                        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] z-0" />

                        <div className="relative z-10 h-full flex flex-col">
                            <header className="mb-4 text-center">
                                <h2 className="text-[10px] tracking-[0.3em] text-[#9d8189] uppercase mb-0.5">Year in Review 2025</h2>
                                <h3 className="text-2xl font-display text-[#bc4749] leading-none uppercase">NHÌN LẠI MỘT NĂM</h3>
                                <div className="h-0.5 w-10 bg-[#bc4749] mx-auto mt-1.5" />
                            </header>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="flex-1 grid grid-cols-2 gap-x-4 gap-y-1 overflow-hidden"
                            >
                                {checklistItems.map((item, index) => (
                                    <div
                                        key={index}
                                        onClick={() => toggleItem(index)}
                                        className="flex items-center gap-1.5 cursor-pointer group/item py-0.5"
                                    >
                                        <div className="flex-shrink-0 flex items-center">
                                            {checked.includes(index) ? (
                                                <CheckCircle2 size={12} className="text-[#bc4749]" />
                                            ) : (
                                                <Circle size={12} className="text-[#c6ac8f]" />
                                            )}
                                        </div>
                                        <span className={`text-[10px] md:text-[12px] leading-none ${checked.includes(index) ? 'text-[#bc4749] font-bold' : 'text-[#5e503f] font-medium'}`}>
                                            {item}
                                        </span>
                                    </div>
                                ))}
                            </motion.div>

                            <footer className="mt-4 text-center pt-3 border-t border-[#c6ac8f]/30">
                                <p className="text-[8px] text-[#bc4749] font-display tracking-[0.2em] uppercase font-bold">
                                    Bính Ngọ 2026 • Chúc Mừng Năm Mới
                                </p>
                            </footer>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={exportImage}
                        disabled={isExporting}
                        className="lg:hidden w-full bg-[#bc4749] text-white py-3 rounded-xl shadow-xl flex items-center justify-center gap-2 font-medium transition-all disabled:opacity-50"
                    >
                        {isExporting ? <RotateCcw size={18} className="animate-spin" /> : <Download size={18} />}
                        Lưu ảnh Story
                    </motion.button>
                </motion.div>
            </div>

            <DownloadModal
                isOpen={showDownloadModal}
                onClose={() => setShowDownloadModal(false)}
                imageSrc={exportedImageUrl}
                fileName="my-2025-checklist.png"
            />
        </main>
    );
}
