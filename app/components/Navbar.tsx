"use client";

import { motion } from "framer-motion";
import { ClipboardList, MessageSquare, Home, Share2, Sparkles, Wallet } from "lucide-react";
import Link from "next/link";

export default function PillNavbar() {
    const navItems = [
        { icon: Home, label: "Trang chủ", href: "/" },
        { icon: ClipboardList, label: "Checklist", href: "/checklist" },
        { icon: MessageSquare, label: "Lời chúc", href: "/wishes" },
        { icon: Sparkles, label: "Gieo quẻ", href: "/fortune" },
        { icon: Wallet, label: "Lì xì", href: "/lucky-money" },
    ];



    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-fit pointer-events-auto"
        >
            <div className="flex items-center gap-1 bg-[#f2e8cf]/80 backdrop-blur-xl border border-[#c6ac8f]/30 px-2 py-2 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.1)]">
                {navItems.map((item, index) => (
                    <Link
                        key={index}
                        href={item.href}
                        className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 rounded-full hover:bg-[#bc4749]/10 text-[#5e503f] hover:text-[#bc4749] transition-all duration-300 group"
                    >
                        <item.icon size={18} className="group-hover:scale-110 transition-transform flex-shrink-0" />
                        <span className="text-[10px] md:text-xs text-nowrap font-medium tracking-wide hidden md:block">
                            {item.label}
                        </span>
                    </Link>
                ))}
            </div>
        </motion.nav>
    );
}
