"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronRight, FileText, Sun, Moon, Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { ContentMap, Note } from "@/types";
import { useApp } from "@/context/AppContext";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { useTheme } from "next-themes";

interface SidebarProps {
    content: ContentMap;
}

function SidebarContent({ content }: SidebarProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const noteParam = searchParams.get('note');
    const { isSidebarOpen, setSidebarOpen } = useApp();
    const semesters = Object.keys(content);

    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const handleThemeToggle = () => {
        const current = resolvedTheme || theme;
        setTheme(current === 'dark' ? 'light' : 'dark');
    };

    const closeSidebarOnMobile = () => {
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
            setSidebarOpen(false);
        }
    };

    return (
        <>
            {/* Mobile Toggle Button - Top right */}
            {!isSidebarOpen && (
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="md:hidden fixed top-4 right-4 z-50 p-2.5 rounded-lg border border-border shadow-sm"
                    style={{ backgroundColor: 'var(--card)' }}
                    aria-label="Open menu"
                >
                    <Menu className="w-5 h-5" />
                </button>
            )}

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "border-r border-border h-screen overflow-hidden fixed md:relative top-0 transition-all duration-300 flex flex-col z-40",
                    isSidebarOpen ? "w-72 left-0" : "w-0 -left-72 md:w-0"
                )}
                style={{ backgroundColor: 'var(--background)' }}
            >
                {/* Sidebar Header */}
                <div className="p-4 border-b border-border flex-shrink-0">
                    <div className="flex items-center justify-between mb-4">
                        <Link
                            href="/"
                            className="font-bold text-lg hover:text-primary transition-colors"
                        >
                            akash-notes
                        </Link>
                        <div className="flex items-center gap-1">
                            {mounted && (
                                <button
                                    onClick={handleThemeToggle}
                                    className="p-2 rounded-md hover:bg-accent transition-colors"
                                    aria-label="Toggle theme"
                                >
                                    {(resolvedTheme || theme) === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                                </button>
                            )}
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="p-2 rounded-md hover:bg-accent transition-colors md:hidden"
                                aria-label="Close menu"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <GlobalSearch content={content} />
                </div>

                {/* Navigation */}
                <div className="flex-1 p-2 overflow-y-auto no-scrollbar">
                    {semesters.map(sem => (
                        <SemesterItem
                            key={sem}
                            semester={sem}
                            content={content[sem]}
                            pathname={pathname}
                            noteParam={noteParam}
                            closeSidebar={closeSidebarOnMobile}
                        />
                    ))}
                </div>
            </aside>
        </>
    );
}

// Wrapper with Suspense for useSearchParams
export function Sidebar({ content }: SidebarProps) {
    return (
        <Suspense fallback={<div className="w-72 border-r border-border h-screen" style={{ backgroundColor: 'var(--background)' }} />}>
            <SidebarContent content={content} />
        </Suspense>
    );
}

interface NavItemProps {
    pathname: string;
    noteParam: string | null;
    closeSidebar: () => void;
}

function SemesterItem({ semester, content, pathname, noteParam, closeSidebar }: { semester: string; content: any } & NavItemProps) {
    const basePath = `/${semester}`;
    const isActive = pathname.startsWith(basePath);
    const [isOpen, setIsOpen] = useState(isActive);

    useEffect(() => { if (isActive) setIsOpen(true); }, [isActive]);

    return (
        <div className="mb-1">
            <div className="flex items-center">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-1 rounded hover:bg-accent transition-colors"
                >
                    <ChevronRight className={cn("w-4 h-4 transition-transform", isOpen && "rotate-90")} />
                </button>
                <Link
                    href={basePath}
                    className={cn(
                        "flex-1 p-2 rounded hover:bg-accent transition-colors capitalize text-sm",
                        isActive && "font-semibold text-primary"
                    )}
                >
                    {semester}
                </Link>
            </div>
            {isOpen && (
                <div className="ml-4 pl-2 border-l border-border">
                    {Object.keys(content).filter(subject => content[subject] && typeof content[subject] === 'object' && Object.keys(content[subject]).length > 0).map(subject => (
                        <SubjectItem
                            key={subject}
                            semester={semester}
                            subject={subject}
                            content={content[subject]}
                            pathname={pathname}
                            noteParam={noteParam}
                            closeSidebar={closeSidebar}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function SubjectItem({ semester, subject, content, pathname, noteParam, closeSidebar }: { semester: string; subject: string; content: any } & NavItemProps) {
    const basePath = `/${semester}/${subject}`;
    const isActive = pathname.startsWith(basePath);
    const [isOpen, setIsOpen] = useState(isActive);

    useEffect(() => { if (isActive) setIsOpen(true); }, [isActive]);

    return (
        <div className="mb-1">
            <div className="flex items-center">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-1 rounded hover:bg-accent transition-colors"
                >
                    <ChevronRight className={cn("w-3 h-3 transition-transform", isOpen && "rotate-90")} />
                </button>
                <Link
                    href={basePath}
                    className={cn(
                        "flex-1 p-1.5 rounded hover:bg-accent transition-colors capitalize text-xs",
                        isActive && "font-medium text-primary"
                    )}
                >
                    {subject}
                </Link>
            </div>
            {isOpen && (
                <div className="ml-3 pl-2 border-l border-border">
                    {Object.keys(content).filter(unit => content[unit] && typeof content[unit] === 'object' && Object.keys(content[unit]).length > 0).map(unit => (
                        <UnitItem
                            key={unit}
                            semester={semester}
                            subject={subject}
                            unit={unit}
                            content={content[unit]}
                            pathname={pathname}
                            noteParam={noteParam}
                            closeSidebar={closeSidebar}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function UnitItem({ semester, subject, unit, content, pathname, noteParam, closeSidebar }: { semester: string; subject: string; unit: string; content: any } & NavItemProps) {
    const basePath = `/${semester}/${subject}/${unit}`;
    const isActive = pathname.startsWith(basePath);
    const [isOpen, setIsOpen] = useState(isActive);

    useEffect(() => { if (isActive) setIsOpen(true); }, [isActive]);

    return (
        <div className="mb-1">
            <div className="flex items-center">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-1 rounded hover:bg-accent transition-colors"
                >
                    <ChevronRight className={cn("w-3 h-3 transition-transform", isOpen && "rotate-90")} />
                </button>
                <Link
                    href={basePath}
                    className={cn(
                        "flex-1 p-1.5 rounded hover:bg-accent transition-colors capitalize text-xs",
                        isActive && "font-medium text-primary"
                    )}
                >
                    {unit}
                </Link>
            </div>
            {isOpen && (
                <div className="ml-3 pl-2 border-l border-border">
                    {Object.keys(content).filter(section => Array.isArray(content[section]) && content[section].length > 0).map(section => (
                        <SectionItem
                            key={section}
                            semester={semester}
                            subject={subject}
                            unit={unit}
                            section={section}
                            notes={content[section]}
                            pathname={pathname}
                            noteParam={noteParam}
                            closeSidebar={closeSidebar}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function SectionItem({ semester, subject, unit, section, notes, pathname, noteParam, closeSidebar }: { semester: string; subject: string; unit: string; section: string; notes: Note[] } & NavItemProps) {
    const sectionPath = `/${semester}/${subject}/${unit}/${section}`;
    const isActive = pathname === sectionPath || pathname.startsWith(sectionPath + '/');
    const [isOpen, setIsOpen] = useState(isActive);

    useEffect(() => { if (isActive) setIsOpen(true); }, [isActive]);

    return (
        <div className="mb-1">
            <div className="flex items-center">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-1 rounded hover:bg-accent transition-colors"
                >
                    <ChevronRight className={cn("w-3 h-3 transition-transform", isOpen && "rotate-90")} />
                </button>
                <Link
                    href={sectionPath}
                    className={cn(
                        "flex-1 p-1.5 rounded hover:bg-accent transition-colors capitalize text-xs",
                        isActive && "font-medium text-primary"
                    )}
                >
                    {section}
                </Link>
            </div>
            {isOpen && Array.isArray(notes) && notes.length > 0 && (
                <div className="ml-3 pl-2 border-l border-border">
                    {notes.map((note, idx) => {
                        const notePath = `${sectionPath}?note=${idx}`;
                        const isNoteActive = pathname === sectionPath && noteParam === String(idx);

                        return (
                            <Link
                                key={idx}
                                href={notePath}
                                onClick={closeSidebar}
                                className={cn(
                                    "flex items-center gap-1.5 p-1.5 rounded text-[11px] mb-0.5 truncate transition-colors",
                                    isNoteActive
                                        ? "bg-primary/10 text-primary font-medium"
                                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                )}
                                title={note.title}
                            >
                                <FileText className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{note.title}</span>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
