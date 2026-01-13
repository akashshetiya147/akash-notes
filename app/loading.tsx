export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
                <div
                    className="w-8 h-8 border-2 rounded-full animate-spin"
                    style={{
                        borderColor: 'var(--muted)',
                        borderTopColor: 'var(--primary)'
                    }}
                />
                <p style={{ color: 'var(--muted-foreground)' }}>Loading...</p>
            </div>
        </div>
    );
}
