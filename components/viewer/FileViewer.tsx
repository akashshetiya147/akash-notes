"use client";

import { Maximize2, Minimize2, Download } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface FileViewerProps {
    url: string;
    title: string;
}

function getDriveId(url: string) {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
}

export function FileViewer({ url, title }: FileViewerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const id = getDriveId(url);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const toggleFullscreen = () => {
        if (!containerRef.current) return;

        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch(console.error);
        } else {
            document.exitFullscreen().catch(console.error);
        }
    };

    if (!id) {
        return (
            <div
                className="h-full flex items-center justify-center rounded-lg border border-border"
                style={{ backgroundColor: 'var(--card)' }}
            >
                <p className="text-muted-foreground">Invalid file URL</p>
            </div>
        );
    }

    const embedUrl = url.includes("docs.google.com/presentation")
        ? `https://docs.google.com/presentation/d/${id}/embed?start=false&loop=false&delayms=3000`
        : `https://drive.google.com/file/d/${id}/preview`;

    return (
        <div
            ref={containerRef}
            className={`flex flex-col rounded-lg border border-border overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
                }`}
            style={{
                backgroundColor: 'var(--card)',
                height: isFullscreen ? undefined : '100%'
            }}
        >
            {/* Header */}
            <div
                className="flex items-center justify-between px-3 py-2 border-b border-border"
                style={{ backgroundColor: 'var(--muted)' }}
            >
                <span className="text-sm font-medium truncate pr-2">{title}</span>
                <div className="flex items-center gap-1">
                    <a
                        href={`https://drive.google.com/uc?export=download&id=${id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded hover:bg-accent transition-colors flex-shrink-0"
                        title="Download"
                    >
                        <Download className="w-4 h-4" />
                    </a>
                    <button
                        onClick={toggleFullscreen}
                        className="p-1.5 rounded hover:bg-accent transition-colors flex-shrink-0"
                        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    >
                        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Viewer */}
            <div className="flex-1 relative" style={{ backgroundColor: 'var(--background)' }}>
                {/* Block pop-out button overlay */}
                <div
                    className="absolute top-0 right-0 w-16 h-16 z-10"
                    style={{ backgroundColor: 'var(--background)' }}
                />

                <iframe
                    src={embedUrl}
                    className="absolute inset-0 w-full h-full border-none"
                    allowFullScreen
                    loading="lazy"
                />
            </div>
        </div>
    );
}
