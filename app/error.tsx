"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
                Something went wrong
            </h1>
            <p className="text-lg mb-8" style={{ color: 'var(--muted-foreground)' }}>
                An unexpected error occurred. Please try again.
            </p>
            <button
                onClick={reset}
                className="px-6 py-3 rounded-lg font-medium transition-colors"
                style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-foreground)'
                }}
            >
                Try Again
            </button>
        </div>
    );
}
