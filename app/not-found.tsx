import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <h1 className="text-6xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>404</h1>
            <h2 className="text-2xl font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Page Not Found</h2>
            <p className="text-lg mb-8" style={{ color: 'var(--muted-foreground)' }}>
                The page you're looking for doesn't exist or has been moved.
            </p>
            <Link
                href="/"
                className="px-6 py-3 rounded-lg font-medium transition-colors"
                style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-foreground)'
                }}
            >
                Go Home
            </Link>
        </div>
    );
}
