"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import { ContentMap } from "@/types";

interface SearchResult {
    title: string;
    subtitle: string;
    href: string;
    type: "note" | "section" | "unit" | "subject";
}

interface GlobalSearchProps {
    content: ContentMap;
}

export function GlobalSearch({ content }: GlobalSearchProps) {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    // Flatten content for search
    const index = useMemo(() => {
        const results: SearchResult[] = [];

        // Structure: Sem -> Subject -> Unit -> Section -> Notes
        Object.entries(content).forEach(([sem, subjects]) => {
            Object.entries(subjects).forEach(([subject, units]) => {
                Object.entries(units).forEach(([unit, sections]) => {
                    // Unit match
                    results.push({
                        title: unit,
                        subtitle: `${sem} > ${subject}`,
                        href: `/${sem}/${subject}/${unit}`,
                        type: "unit"
                    });

                    Object.entries(sections).forEach(([section, notes]) => {
                        notes.forEach((note, idx) => {
                            // Note match
                            results.push({
                                title: note.title,
                                subtitle: `${sem} › ${subject} › ${unit} › ${section}`,
                                href: `/${sem}/${subject}/${unit}/${section}?note=${idx}`,
                                type: "note"
                            });
                        });
                    });
                });
            });
        });
        return results;
    }, [content]);

    const filteredResults = useMemo(() => {
        if (!query) return [];
        const lowerQuery = query.toLowerCase();

        return index.filter(item =>
            item.title.toLowerCase().includes(lowerQuery) ||
            item.subtitle.toLowerCase().includes(lowerQuery)
        ).slice(0, 10);
    }, [query, index]);

    return (
        <div className="relative w-full md:w-64">
            <div className="relative flex items-center bg-muted rounded-md px-3 py-2 border border-input">
                <Search className="w-4 h-4 text-muted-foreground mr-2" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                />
            </div>

            {isOpen && query && (
                <div
                    className="absolute top-full left-0 right-0 border border-border shadow-lg rounded-md mt-1 max-h-96 overflow-y-auto z-50"
                    style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
                >
                    {filteredResults.length === 0 ? (
                        <div className="p-3 text-sm text-muted-foreground">No results found.</div>
                    ) : (
                        filteredResults.map((result) => (
                            <Link
                                key={result.href}
                                href={result.href}
                                className="block p-3 hover:bg-accent hover:text-accent-foreground border-b border-border last:border-none"
                                onClick={() => setIsOpen(false)}
                            >
                                <div className="font-semibold text-sm capitalize">{result.title}</div>
                                <div className="text-xs text-muted-foreground capitalize">{result.subtitle}</div>
                            </Link>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
