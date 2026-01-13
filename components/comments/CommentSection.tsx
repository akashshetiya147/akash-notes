"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Send } from "lucide-react";

interface Comment {
    id: string;
    created_at: string;
    author_name: string;
    content: string;
}

interface CommentSectionProps {
    unitPath: string;
}

export function CommentSection({ unitPath }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchComments();
    }, [unitPath]);

    async function fetchComments() {
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;

        const { data, error } = await supabase
            .from("comments")
            .select("*")
            .eq("unit_path", unitPath)
            .order("created_at", { ascending: true });

        if (error) {
            console.error("Error fetching comments:", error.message);
        } else {
            setComments(data || []);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!newComment.trim()) return;

        if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
            setError("Supabase not configured.");
            return;
        }

        setLoading(true);
        const { error } = await supabase.from("comments").insert({
            unit_path: unitPath,
            content: newComment,
            author_name: name.trim() || "Anonymous",
        });

        setLoading(false);

        if (error) {
            alert("Error posting comment");
        } else {
            setNewComment("");
            fetchComments();
        }
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        return null;
    }

    return (
        <div className="mt-6">
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--foreground)' }}>Comments</h3>

            <div className="space-y-3 mb-6">
                {comments.length === 0 ? (
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>No comments yet. Be the first to comment!</p>
                ) : (
                    comments.map((comment) => (
                        <div
                            key={comment.id}
                            className="p-3 rounded-lg border"
                            style={{
                                backgroundColor: 'var(--card)',
                                borderColor: 'var(--border)',
                                color: 'var(--foreground)'
                            }}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
                                    {comment.author_name}
                                </span>
                                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                                    {new Date(comment.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--foreground)' }}>
                                {comment.content}
                            </p>
                        </div>
                    ))
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    type="text"
                    placeholder="Name (optional)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-lg px-3 py-2 text-sm w-full md:w-1/3 outline-none transition-colors"
                    style={{
                        backgroundColor: 'var(--card)',
                        borderColor: 'var(--border)',
                        border: '1px solid var(--border)',
                        color: 'var(--foreground)'
                    }}
                />
                <textarea
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="rounded-lg px-3 py-2 text-sm w-full h-24 outline-none resize-none transition-colors"
                    style={{
                        backgroundColor: 'var(--card)',
                        borderColor: 'var(--border)',
                        border: '1px solid var(--border)',
                        color: 'var(--foreground)'
                    }}
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
                    style={{
                        backgroundColor: 'var(--primary)',
                        color: 'var(--primary-foreground)'
                    }}
                >
                    <Send className="w-4 h-4" />
                    {loading ? 'Posting...' : 'Post Comment'}
                </button>
                {error && <p className="text-red-500 text-sm">{error}</p>}
            </form>
        </div>
    );
}
