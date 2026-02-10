"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toPng } from "html-to-image";
import { Download, ChevronLeft, Sparkles, Upload, RotateCcw, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { downloadOrOpenImage } from "@/lib/download-utils";

export default function WishesPage() {
    const [wishText, setWishText] = useState("");
    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [isExporting, setIsExporting] = useState(false);
    const exportRef = useRef<HTMLDivElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const generateAIWish = async () => {
        if (!prompt) return;
        setIsGenerating(true);
        try {
            const res = await fetch("/api/generate-greeting", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });
            const data = await res.json();
            if (data.text) {
                setWishText(data.text);
            } else if (data.error) {
                alert(data.error);
            }
        } catch (err) {
            console.error(err);
            alert("Đã có lỗi xảy ra khi tạo lời chúc.");
        } finally {
            setIsGenerating(false);
        }
    };

    const exportImage = async () => {
        if (exportRef.current === null) return;
        setIsExporting(true);
        try {
            const dataUrl = await toPng(exportRef.current, { cacheBust: true, pixelRatio: 2 });
            downloadOrOpenImage(dataUrl, `tet-wishes-2026.png`);
        } catch (err) {
            console.error("Export failed", err);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <main className="relative min-h-screen w-full flex flex-col items-center p-4 lg:p-8 overflow-x-hidden pt-24 md:pt-32 bg-[#fdf6e3]">
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

            <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                {/* Left: Input Controls */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-6 bg-[#f2e8cf]/40 backdrop-blur-xl p-6 lg:p-8 rounded-3xl border border-[#c6ac8f]/30 shadow-xl"
                >
                    <div>
                        <h1 className="text-3xl font-display text-[#bc4749] uppercase mb-2">Tạo Lời Chúc Tết</h1>
                        <p className="text-[#5e503f] opacity-80 text-sm italic">"Gửi gắm yêu thương qua những vần thơ chúc Tết."</p>
                    </div>

                    {/* AI Prompt Input */}
                    <div className="flex flex-col gap-3">
                        <label className="text-sm font-bold text-[#bc4749] uppercase tracking-wider">Ý tưởng lời chúc (AI):</label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Ví dụ: Lời chúc chân thành cho cha mẹ, hoặc lời chúc thăng tiến cho đồng nghiệp..."
                            className="w-full h-24 bg-white/50 border-2 border-[#c6ac8f]/20 rounded-2xl p-4 outline-none focus:border-[#bc4749]/40 transition-all text-[#5e503f] text-sm resize-none"
                        />
                        <button
                            onClick={generateAIWish}
                            disabled={isGenerating || !prompt}
                            className="w-full bg-[#bc4749] text-white py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm font-bold hover:bg-[#a3393b] disabled:opacity-50 transition-all"
                        >
                            {isGenerating ? <RotateCcw size={16} className="animate-spin" /> : <Sparkles size={16} />}
                            Gợi ý lời chúc bằng AI
                        </button>
                    </div>


                    {/* Manual Text Edit */}
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-end">
                            <label className="text-sm font-bold text-[#bc4749] uppercase tracking-wider">Chỉnh sửa lời chúc:</label>
                            <span className={`text-[10px] font-bold ${wishText.length > 140 ? 'text-[#bc4749]' : 'text-[#5e503f]/50'}`}>
                                {wishText.length}/160
                            </span>
                        </div>
                        <textarea
                            value={wishText}
                            onChange={(e) => setWishText(e.target.value.slice(0, 160))}
                            placeholder="Nhập lời chúc của bạn tại đây..."
                            maxLength={160}
                            className="w-full h-32 bg-white/50 border-2 border-[#c6ac8f]/20 rounded-2xl p-4 outline-none focus:border-[#bc4749]/40 transition-all text-[#5e503f] text-sm resize-none"
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="flex flex-col gap-3">
                        <label className="text-sm font-bold text-[#bc4749] uppercase tracking-wider">Thêm ảnh kỷ niệm (Hình vuông):</label>
                        <div className="flex items-center gap-4">
                            <label className="flex-1 flex items-center justify-center gap-2 bg-[#c6ac8f]/20 hover:bg-[#c6ac8f]/30 border-2 border-dashed border-[#c6ac8f] rounded-2xl p-4 cursor-pointer transition-all">
                                <Upload size={18} className="text-[#bc4749]" />
                                <span className="text-sm text-[#5e503f] font-medium">Tải ảnh lên</span>
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            </label>
                            {uploadedImage && (
                                <button
                                    onClick={() => setUploadedImage(null)}
                                    className="p-4 bg-red-100/50 text-[#bc4749] rounded-2xl hover:bg-red-100 transition-all"
                                >
                                    <RotateCcw size={18} />
                                </button>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={exportImage}
                        disabled={isExporting}
                        className="mt-4 bg-[#bc4749] text-white py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 font-bold uppercase tracking-widest hover:bg-[#a3393b] disabled:opacity-50 transition-all"
                    >
                        {isExporting ? <RotateCcw size={20} className="animate-spin" /> : <Download size={20} />}
                        Lưu ảnh Story
                    </button>
                </motion.div>

                {/* Right: Preview Window */}
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
                            className="absolute inset-0 -z-30 bg-center bg-cover blur-[4px] opacity-60"
                            style={{ backgroundImage: "url('/bg.jpg')" }}
                        />

                        {/* Background Image inside Card (Horse) */}
                        <div className="absolute inset-0 -z-20 opacity-50 mix-blend-multiply flex items-center justify-center pointer-events-none">
                            <Image src="/horse.jpg" alt="Horse Background" fill className="object-contain" />
                        </div>

                        {/* Vintage Texture Overlay inside Card */}
                        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] z-10" />

                        {/* Content Layer (z-20 to be above everything) */}
                        <div className="relative z-20 h-full flex flex-col">
                            <div className="w-full border-t border-b border-[#bc4749]/30 py-4 mb-4 text-center mt-4">
                                <h2 className="text-[10px] tracking-[0.4em] text-[#bc4749]/70 uppercase mb-1 font-bold">Chúc Mừng Năm Mới</h2>
                                <h3 className="text-xl font-display text-[#bc4749] uppercase">Bính Ngọ 2026</h3>
                            </div>

                            {/* Wish Text Area */}
                            <div className="flex-1 flex items-center justify-center text-center p-2">
                                <AnimatePresence mode="wait">
                                    <motion.p
                                        key={wishText}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        style={{ color: '#bc4749' }}
                                        className="text-base md:text-lg font-serif font-bold leading-relaxed drop-shadow-[0_1px_1px_rgba(255,255,255,0.3)] px-4"
                                    >
                                        {wishText || "Hãy tạo lời chúc của riêng bạn tại đây..."}
                                    </motion.p>
                                </AnimatePresence>
                            </div>

                            {/* Square Image Slot below text */}
                            <div className="w-full flex justify-center py-4">
                                <div className="relative w-48 h-48 rounded-2xl overflow-hidden border-4 border-[#c6ac8f]/40 shadow-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                    {uploadedImage ? (
                                        <Image src={uploadedImage} alt="Memory" fill className="object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 opacity-30 text-[#bc4749]">
                                            <ImageIcon size={32} />
                                            <span className="text-[10px] uppercase font-bold tracking-widest">Ảnh kỷ niệm</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Branding Footer */}
                            <div className="mt-auto pb-4 text-center">
                                <p className="text-[8px] font-display text-[#bc4749] tracking-widest uppercase font-bold">Mã Đáo Thành Công • Vạn Sự Như Ý</p>
                            </div>
                        </div>

                        {/* Bottom Gradient Overlay */}
                        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#fdf6e3]/30 to-transparent pointer-events-none z-15" />
                    </div>
                    <span className="text-xs text-[#5e503f] opacity-60">Xem trước ảnh Story</span>
                </motion.div>

            </div>
        </main>
    );
}
