"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AppContextType {
    selectedSemester: string;
    setSelectedSemester: (sem: string) => void;
    isSidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children, initialSemester }: { children: React.ReactNode; initialSemester: string }) {
    const [selectedSemester, setSelectedSemesterState] = useState(initialSemester);
    const [isSidebarOpen, setSidebarOpen] = useState(false); // Start closed, will open on desktop
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem("selectedSemester");
        if (saved) {
            setSelectedSemesterState(saved);
        }
        // Open sidebar by default on desktop (>768px)
        if (window.innerWidth >= 768) {
            setSidebarOpen(true);
        }
    }, []);

    const setSelectedSemester = (sem: string) => {
        setSelectedSemesterState(sem);
        localStorage.setItem("selectedSemester", sem);
        // Redirect logic might be needed if we are on a different semester page?
        // Or we just let the user navigate. 
        // Ideally, changing semester should probably go to home of that semester?
        // For now just state.
    };

    if (!mounted) {
        // Prevent hydration mismatch by initially rendering null or default
        // But we need to render children for SEO if it was sever side.
        // Actually sidebar depends on this. 
        // Let's just return children with default.
    }

    return (
        <AppContext.Provider
            value={{
                selectedSemester,
                setSelectedSemester,
                isSidebarOpen,
                setSidebarOpen,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useApp must be used within an AppProvider");
    }
    return context;
}
