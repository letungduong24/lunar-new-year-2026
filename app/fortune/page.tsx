"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toPng } from "html-to-image";
import { Download, ChevronLeft, Sparkles, RotateCcw, Origami } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import DownloadModal from "../components/DownloadModal";

export default function FortunePage() {
    const [name, setName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [fortune, setFortune] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isShaking, setIsShaking] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [exportedImageUrl, setExportedImageUrl] = useState("");
    const exportRef = useRef<HTMLDivElement>(null);

    const generateFortune = async () => {
        if (!name) return;
        setIsShaking(true);
        setIsGenerating(true);

        // Simulate shaking for 1.5s
        setTimeout(async () => {
            try {
                const res = await fetch("/api/generate-fortune", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, birthDate }),
                });
                const data = await res.json();
                if (data.text) {
                    setFortune(data.text);
                } else if (data.error) {
                    alert(data.error);
                }
            } catch (err) {
                console.error(err);
                alert("Thầy đồ đang bận, vui lòng thử lại sau.");
            } finally {
                setIsGenerating(false);
                setIsShaking(false);
            }
        }, 1500);
    };

    const exportImage = async () => {
        if (exportRef.current === null) return;
        setIsExporting(true);
        try {
            const dataUrl = await toPng(exportRef.current, { cacheBust: true, pixelRatio: 2 });
            setExportedImageUrl(dataUrl);
            setShowDownloadModal(true);

            const link = document.createElement("a");
            link.download = `fortune-2026-${name}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error("Export failed", err);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <main className="relative min-h-screen w-full flex flex-col items-center p-4 overflow-x-hidden pt-24 md:pt-32 bg-[#fdf6e3]">
            {/* Background Layer */}
            <div className="absolute inset-0 -z-30">
                <Image src="/bg.jpg" alt="Background" fill className="object-cover" priority />
            </div>
            <div className="absolute inset-0 vintage-overlay -z-20" />

            {/* Back Button */}
            <div className="absolute top-6 left-6 z-50">
                <Link href="/" className="flex items-center gap-2 px-4 py-2 bg-[#f2e8cf]/80 backdrop-blur-md rounded-full border border-[#c6ac8f]/30 text-[#bc4749] hover:bg-[#bc4749]/10 transition-all">
                    <ChevronLeft size={20} />
                    <span className="text-sm font-medium">Quay lại</span>
                </Link>
            </div>

            <div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-12">

                {/* Left: Fortune Form */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md flex flex-col gap-6 bg-[#f2e8cf]/60 backdrop-blur-xl p-8 rounded-[2rem] border-2 border-[#c6ac8f]/40 shadow-2xl relative overflow-hidden"
                >
                    {/* Decorative Corner Icons */}
                    <div className="absolute top-4 left-4 opacity-20"><Origami size={40} className="text-[#bc4749]" /></div>

                    <div className="text-center relative">
                        <h1 className="text-3xl font-display text-[#bc4749] uppercase mb-2">Gieo Quẻ Thủ Khoa</h1>
                        <p className="text-[#5e503f] opacity-80 text-sm italic">"Thành tâm xin quẻ, vạn sự hanh thông."</p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-[#bc4749] uppercase tracking-widest pl-1">Danh tính (Họ tên):</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ví dụ: Nguyễn Văn A..."
                                className="w-full bg-white/50 border-2 border-[#c6ac8f]/30 rounded-xl p-3 outline-none focus:border-[#bc4749]/40 transition-all text-[#5e503f]"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-[#bc4749] uppercase tracking-widest pl-1">Ngày sinh (Dương lịch):</label>
                            <input
                                type="text"
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                placeholder="Ví dụ: 01/01/1999..."
                                className="w-full bg-white/50 border-2 border-[#c6ac8f]/30 rounded-xl p-3 outline-none focus:border-[#bc4749]/40 transition-all text-[#5e503f]"
                            />
                        </div>
                    </div>

                    {/* Shaking Stick Container */}
                    <div className="flex justify-center py-4">
                        <motion.div
                            animate={isShaking ? {
                                rotate: [0, -10, 10, -10, 10, 0],
                                x: [0, -5, 5, -5, 5, 0],
                                y: [0, -10, 10, -10, 10, 0]
                            } : {}}
                            transition={{ repeat: Infinity, duration: 0.3 }}
                            className="relative w-24 h-32"
                        >
                            <div className="absolute inset-0 bg-[#bc4749] rounded-b-xl border-x-4 border-b-4 border-[#8d2a2c] shadow-lg flex items-center justify-center">
                                <div className="w-16 h-40 absolute -bottom-12 flex flex-col gap-1 items-center">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className="w-2 h-16 bg-[#e9c46a] rounded-t-sm border border-[#c6ac8f]" />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <button
                        onClick={generateFortune}
                        disabled={isGenerating || !name}
                        className="w-full bg-[#bc4749] text-white py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 font-bold uppercase tracking-widest hover:bg-[#a3393b] disabled:opacity-50 transition-all"
                    >
                        {isGenerating ? <RotateCcw size={20} className="animate-spin" /> : <Sparkles size={20} />}
                        Xin Quẻ Bính Ngọ
                    </button>
                </motion.div>

                {/* Right: Preview Card */}
                <div className="flex flex-col items-center gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        ref={exportRef}
                        className="relative w-[320px] md:w-[420px] aspect-[9/16] bg-[#fdf6e3] rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.3)] border-4 border-white/50"
                    >
                        {/* Blurred Background Image inside Card */}
                        <div
                            className="absolute inset-0 -z-30 bg-center bg-cover blur-[4px] opacity-60"
                            style={{ backgroundImage: "url('/bg.jpg')" }}
                        />

                        {/* Background Image inside Card (Horse) */}
                        <div className="absolute inset-0 -z-20 opacity-40 mix-blend-multiply flex items-center justify-center pointer-events-none">
                            <Image src="/horse.jpg" alt="Horse Background" fill className="object-contain" />
                        </div>

                        {/* Vintage Texture Overlay inside Card */}
                        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] z-10" />

                        <div className="relative z-20 h-full flex flex-col items-center p-6">
                            {/* Header Section */}
                            <div className="w-full text-center border-b-2 border-[#bc4749]/30 pb-4 mb-4 mt-2">
                                <h2 className="text-[10px] tracking-[0.5em] text-[#bc4749]/70 uppercase mb-1 font-bold">Quẻ Đầu Năm</h2>
                                <h3 className="text-2xl font-display text-[#bc4749] uppercase">Bính Ngọ 2026</h3>
                            </div>

                            {/* Fortune Content */}
                            <div className="flex-1 flex flex-col items-center text-center justify-center gap-6">
                                <AnimatePresence mode="wait">
                                    {fortune ? (
                                        <motion.div
                                            key={fortune}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="flex flex-col gap-6"
                                        >
                                            <div className="text-lg font-bold bg-[#bc4749] text-white px-6 py-2 rounded-lg shadow-md uppercase tracking-widest">
                                                {fortune.split('\n')[0].replace(/Tên quẻ:|\*/g, '').trim()}
                                            </div>

                                            <div className="text-base font-serif italic text-[#2b2d42] leading-relaxed max-w-[280px] text-center">
                                                {fortune.split('\n').slice(1).join('\n').replace(/\*/g, '').trim()}
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <div className="text-[#5e503f]/40 italic text-sm">Thành tâm gieo quẻ...</div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Footer Section */}
                            <div className="mt-auto w-full text-center pt-4 border-t border-[#bc4749]/20">
                                <p className="text-sm font-display text-[#bc4749] font-bold tracking-widest uppercase mb-1">{name || "Ẩn danh"}</p>
                                <p className="text-[8px] text-[#5e503f] uppercase tracking-[0.2em] font-medium italic opacity-60">Mã Đáo Thành Công • Vạn Sự Như Ý</p>
                            </div>
                        </div>

                        {/* Red Tassel Decoration (Visual only) */}
                        <div className="absolute top-0 right-10 w-2 h-20 bg-[#bc4749] rounded-b-full shadow-lg" />
                        <div className="absolute top-0 left-10 w-2 h-16 bg-[#bc4749] rounded-b-full shadow-lg" />

                        <div className="absolute inset-0 vintage-overlay pointer-events-none opacity-10" />
                        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#fdf6e3]/50 to-transparent pointer-events-none z-15" />
                    </motion.div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={exportImage}
                        disabled={isExporting}
                        className="w-full bg-[#bc4749] text-white py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 font-bold uppercase tracking-widest hover:bg-[#a3393b] disabled:opacity-50 transition-all"
                    >
                        {isExporting ? <RotateCcw size={20} className="animate-spin" /> : <Download size={20} />}
                        Lưu Quẻ May Mắn
                    </motion.button>
                </div>
            </div>

            <DownloadModal
                isOpen={showDownloadModal}
                onClose={() => setShowDownloadModal(false)}
                imageSrc={exportedImageUrl}
                fileName={`fortune-2026-${name}.png`}
            />
        </main>
    );
}
