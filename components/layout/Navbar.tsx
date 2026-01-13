"use client";

import Link from "next/link";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { ContentMap } from "@/types";
import { useApp } from "@/context/AppContext";
import { Sun, Moon, Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useTheme } from "next-themes";
// import { Button } from "@/components/ui/button"; 
import { useEffect, useState } from "react";

// Simple Select component since we don't have shadcn fully installed yet maybe?
// Let's use standard select for simplicity or build a small custom one.

interface NavbarProps {
    content: ContentMap;
}

export function Navbar({ content }: NavbarProps) {
    const { selectedSemester, setSelectedSemester, isSidebarOpen, setSidebarOpen } = useApp();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    return (
        <nav className="h-16 border-b border-border flex items-center justify-between px-4 bg-card sticky top-0 z-10 transition-colors duration-300">
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => setSidebarOpen(!isSidebarOpen)}
                    className="p-2 hover:bg-accent rounded-md text-foreground"
                >
                    {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
                </button>

                {/* Breadcrumbs or Title */}
                <Link href="/" className="font-bold text-lg hidden md:block">
                    Akash Notes
                </Link>
            </div>

            <div className="flex items-center space-x-3">
                <div className="hidden md:block">
                    <GlobalSearch content={content} />
                </div>

                {mounted && (
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="p-2 rounded-full hover:bg-accent transition-colors text-foreground"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                )}
            </div>
        </nav>
    );
}
