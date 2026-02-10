"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { toPng } from "html-to-image";
import { Download, ChevronLeft, QrCode, Wallet, Info, RotateCcw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import DownloadModal from "../components/DownloadModal";

interface Bank {
    name: string;
    code: string;
    short_name: string;
}

export default function LuckyMoneyPage() {
    const [banks, setBanks] = useState<Bank[]>([]);
    const [selectedBank, setSelectedBank] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [accountName, setAccountName] = useState("");
    const [amount, setAmount] = useState("");
    const [message, setMessage] = useState("Lì xì lấy hên Bính Ngọ 2026");
    const [isExporting, setIsExporting] = useState(false);
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [exportedImageUrl, setExportedImageUrl] = useState("");
    const exportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch("https://qr.sepay.vn/banks.json")
            .then((res) => res.json())
            .then((data) => setBanks(data.data || []))
            .catch((err) => console.error("Fetch banks failed", err));
    }, []);

    const qrUrl = selectedBank && accountNumber
        ? `https://qr.sepay.vn/img?acc=${accountNumber}&bank=${selectedBank}&amount=${amount}&des=${encodeURIComponent(message)}&template=compact`
        : null;

    const exportImage = async () => {
        if (exportRef.current === null) return;
        setIsExporting(true);
        try {
            const dataUrl = await toPng(exportRef.current, { cacheBust: true, pixelRatio: 2 });
            setExportedImageUrl(dataUrl);
            setShowDownloadModal(true);

            // Try to download automatically for desktop
            const link = document.createElement("a");
            link.download = `li-xi-2026-${accountNumber}.png`;
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

                {/* Left: Input Form */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md flex flex-col gap-6 bg-[#f2e8cf]/80 backdrop-blur-xl p-8 rounded-[2rem] border-2 border-[#c6ac8f]/40 shadow-2xl"
                >
                    <div>
                        <h1 className="text-3xl font-display text-[#bc4749] uppercase mb-2">Xin Lì Xì 2026</h1>
                        <p className="text-[#5e503f] opacity-80 text-sm italic">"Tạo ảnh QR xin lì xì mang phong cách Tết xưa."</p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-[#bc4749] uppercase tracking-widest pl-1">Ngân hàng:</label>
                            <select
                                value={selectedBank}
                                onChange={(e) => setSelectedBank(e.target.value)}
                                className="w-full bg-white/50 border-2 border-[#c6ac8f]/30 rounded-xl p-3 outline-none focus:border-[#bc4749]/40 transition-all text-[#5e503f] appearance-none"
                            >
                                <option value="">-- Chọn ngân hàng --</option>
                                {banks.map((bank) => (
                                    <option key={bank.code} value={bank.code}>{bank.short_name} - {bank.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-[#bc4749] uppercase tracking-wider pl-1">Số tài khoản:</label>
                            <input
                                type="text"
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                                placeholder="Nhập số tài khoản..."
                                className="w-full bg-white/50 border-2 border-[#c6ac8f]/30 rounded-xl p-3 outline-none focus:border-[#bc4749]/40 transition-all text-[#5e503f]"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-[#bc4749] uppercase tracking-wider pl-1">Tên chủ tài khoản:</label>
                            <input
                                type="text"
                                value={accountName}
                                onChange={(e) => setAccountName(e.target.value)}
                                placeholder="Ví dụ: NGUYEN VAN A..."
                                className="w-full bg-white/50 border-2 border-[#c6ac8f]/30 rounded-xl p-3 outline-none focus:border-[#bc4749]/40 transition-all text-[#5e503f]"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-[#bc4749] uppercase tracking-wider pl-1">Số tiền (Không bắt buộc):</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Ví dụ: 202600"
                                className="w-full bg-white/50 border-2 border-[#c6ac8f]/30 rounded-xl p-3 outline-none focus:border-[#bc4749]/40 transition-all text-[#5e503f]"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-end">
                                <label className="text-xs font-bold text-[#bc4749] uppercase tracking-wider pl-1">Lời nhắn:</label>
                                <span className={`text-[10px] font-bold ${message.length > 50 ? 'text-[#bc4749]' : 'text-[#5e503f]/50'}`}>
                                    {message.length}/60
                                </span>
                            </div>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value.slice(0, 60))}
                                placeholder="Lời nhắn xin lì xì..."
                                maxLength={60}
                                className="w-full h-20 bg-white/50 border-2 border-[#c6ac8f]/30 rounded-xl p-3 outline-none focus:border-[#bc4749]/40 transition-all text-[#5e503f] resize-none"
                            />
                        </div>
                    </div>

                    <button
                        onClick={exportImage}
                        disabled={!accountNumber || !selectedBank || isExporting}
                        className="w-full bg-[#bc4749] text-white py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 font-bold uppercase tracking-widest hover:bg-[#a3393b] disabled:opacity-50 transition-all"
                    >
                        {isExporting ? <RotateCcw size={20} className="animate-spin" /> : <Download size={20} />}
                        Lưu ảnh Story
                    </button>

                    <p className="text-[10px] text-[#5e503f]/60 text-center flex items-center justify-center gap-1">
                        <Info size={12} /> Dịch vụ QR bởi SePay
                    </p>
                </motion.div>

                {/* Right: Story Preview */}
                <div className="flex flex-col items-center gap-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.8, type: "spring", damping: 20 }}
                        className="relative flex flex-col items-center gap-4"
                    >
                        <div
                            ref={exportRef}
                            className="bg-[#fdf6e3]/80 rounded-2xl p-3 shadow-2xl border-2 border-[#c6ac8f]/30 relative overflow-hidden aspect-[9/16] w-[320px] md:w-[420px] flex-shrink-0"
                        >
                            {/* Blurred Background Image inside Card */}
                            <div
                                className="absolute inset-0 -z-20 bg-center bg-cover blur-[4px] opacity-60"
                                style={{ backgroundImage: "url('/bg.jpg')" }}
                            />

                            {/* Background Image inside Card (Horse) */}
                            <div className="absolute inset-0 -z-10 opacity-50 mix-blend-multiply flex items-center justify-center pointer-events-none">
                                <Image src="/horse.jpg" alt="Horse Background" fill className="object-contain" />
                            </div>

                            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] z-10" />

                            {/* Content Layer */}
                            <div className="relative z-20 h-full flex flex-col items-center p-4">
                                <div className="text-center mb-8">
                                    <h2 className="text-[10px] tracking-[0.5em] text-[#bc4749]/70 uppercase mb-2 font-bold">Tết Bính Ngọ 2026</h2>
                                    <h3 className="text-4xl font-display text-[#bc4749] uppercase leading-none">LÌ XÌ</h3>
                                    <div className="h-1 w-12 bg-[#bc4749] mx-auto mt-4 rounded-full" />
                                </div>

                                <div className="flex-1 flex flex-col items-center justify-center w-full gap-6">
                                    {/* QR Code Frame */}
                                    <div className="relative p-6 bg-white/90 backdrop-blur-sm rounded-[2rem] shadow-2xl border-4 border-[#c6ac8f]/30">
                                        <div className="relative w-30 h-30 md:w-40 md:h-40 flex items-center justify-center">
                                            {qrUrl ? (
                                                <img src={qrUrl} alt="QR Code" className="w-full h-full object-contain" />
                                            ) : (
                                                <div className="flex flex-col items-center gap-2 text-[#bc4749]/30">
                                                    <QrCode size={64} />
                                                    <span className="text-[10px] font-bold uppercase tracking-wider">Chưa có thông tin</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute -top-3 -right-3 bg-[#bc4749] text-white p-2 rounded-full shadow-lg">
                                            <Wallet size={16} />
                                        </div>
                                    </div>

                                    <div className="text-center px-4">
                                        <p className="text-[10px] font-display text-[#bc4749] uppercase tracking-[0.2em] mb-1 opacity-80">Lì xì cho:</p>
                                        <p className="text-xl font-display text-[#bc4749] uppercase leading-tight mb-3">
                                            {accountName || "Chưa nhập tên"}
                                        </p>
                                        <p className="text-base font-serif italic text-[#bc4749] font-medium leading-tight mb-2">
                                            "{message}"
                                        </p>
                                        {accountNumber && (
                                            <p className="text-[10px] font-display text-[#5e503f] uppercase tracking-widest opacity-70">
                                                {selectedBank} • {accountNumber}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Footer Section */}
                                <div className="w-full text-center mt-auto">
                                    <div className="border-t border-[#bc4749]/20 pt-4">
                                        <p className="text-[8px] text-[#bc4749] font-display tracking-[0.3em] uppercase font-bold mb-1">An Khang Thịnh Vượng</p>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Overlay */}
                            <div className="absolute inset-0 vintage-overlay pointer-events-none opacity-10" />
                            <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#fdf6e3]/50 to-transparent pointer-events-none z-15" />
                        </div>
                        <span className="text-xs text-[#5e503f] opacity-60">Xem trước ảnh Story</span>
                    </motion.div>
                </div>

            </div>

            <DownloadModal
                isOpen={showDownloadModal}
                onClose={() => setShowDownloadModal(false)}
                imageSrc={exportedImageUrl}
                fileName={`li-xi-2026-${accountNumber}.png`}
            />
        </main>
    );
}
