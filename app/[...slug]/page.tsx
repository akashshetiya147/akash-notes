import { getContent } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, FileText, ArrowLeft } from "lucide-react";
import { FileViewer } from "@/components/viewer/FileViewer";
import { CommentSection } from "@/components/comments/CommentSection";
import { Note, SECTION_ORDER } from "@/types";

function getData(content: any, slug: string[]) {
    let current = content;
    for (const segment of slug) {
        if (current && current[segment]) {
            current = current[segment];
        } else {
            return null;
        }
    }
    return current;
}

interface PageProps {
    params: Promise<{ slug: string[] }>;
    searchParams: Promise<{ note?: string }>;
}

export default async function DynamicPage({ params, searchParams }: PageProps) {
    const { slug } = await params;
    const { note: noteIndex } = await searchParams;
    const content = getContent();
    const data = getData(content, slug);

    if (!data) {
        notFound();
    }

    const depth = slug.length;

    // 1. Semester/Subject View (List sub-items)
    if (depth < 3) {
        const keys = Object.keys(data);
        const title = decodeURIComponent(slug[depth - 1]);

        return (
            <div className="max-w-4xl mx-auto px-4 py-6">
                <h1 className="text-2xl md:text-3xl font-bold mb-6 capitalize">{title}</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    {keys.map((key) => (
                        <Link
                            key={key}
                            href={`/${slug.join("/")}/${key}`}
                            className="p-4 rounded-lg border border-border hover:border-primary/50 flex items-center justify-between group transition-all card-hover"
                            style={{ backgroundColor: 'var(--card)' }}
                        >
                            <span className="font-medium capitalize text-sm md:text-base">{key}</span>
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </Link>
                    ))}
                    {keys.length === 0 && (
                        <p className="text-muted-foreground col-span-full text-center py-8">No content found.</p>
                    )}
                </div>
            </div>
        );
    }

    // 2. Unit View (Lists sections)
    if (depth === 3) {
        const unitData = data as Record<string, Note[]>;
        const existingSections = SECTION_ORDER.filter(s => unitData[s]);

        return (
            <div className="max-w-5xl mx-auto px-4 py-6">
                <h1 className="text-2xl md:text-3xl font-bold mb-6 capitalize">{slug[2]}</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {existingSections.map(section => (
                        <Link
                            key={section}
                            href={`/${slug.join("/")}/${section}`}
                            className="p-5 rounded-lg border border-border hover:border-primary/50 transition-all card-hover"
                            style={{ backgroundColor: 'var(--card)' }}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-5 h-5 text-primary" />
                                <h3 className="text-lg font-semibold capitalize">{section}</h3>
                            </div>
                            <p className="text-muted-foreground text-sm">{unitData[section]?.length || 0} files</p>
                        </Link>
                    ))}
                    {existingSections.length === 0 && (
                        <p className="text-muted-foreground col-span-full text-center py-8">No content in this unit.</p>
                    )}
                </div>

                <div className="mt-10">
                    <CommentSection unitPath={slug.join("/")} />
                </div>
            </div>
        );
    }

    // 3. Section View
    if (depth === 4) {
        const notes = data as Note[];
        const sectionName = slug[3];
        const unitSlug = slug.slice(0, 3).join("/");
        const sectionPath = `/${slug.join("/")}`;

        // Note Detail View
        if (noteIndex !== undefined) {
            const activeIndex = parseInt(noteIndex);
            const activeNote = notes[activeIndex];

            if (!activeNote) return notFound();

            return (
                <div className="max-w-6xl mx-auto px-4 py-4">
                    {/* Back button and title */}
                    <div className="flex items-center gap-3 mb-4">
                        <Link
                            href={sectionPath}
                            className="p-2 rounded-lg hover:bg-accent transition-colors flex-shrink-0"
                            title="Back to list"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="min-w-0 flex-1">
                            <h1 className="text-lg md:text-xl font-bold truncate">{activeNote.title}</h1>
                            {activeNote.tags && activeNote.tags.length > 0 && (
                                <div className="flex gap-1.5 mt-1 flex-wrap">
                                    {activeNote.tags.slice(0, 3).map(tag => (
                                        <span key={tag} className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* File Viewer - Fixed height */}
                    <div className="h-[60vh] md:h-[70vh] mb-6">
                        <FileViewer url={activeNote.url} title={activeNote.title} />
                    </div>

                    {/* Comments - Below viewer */}
                    <div className="pt-6 border-t border-border">
                        <CommentSection unitPath={unitSlug} />
                    </div>
                </div>
            );
        }

        // Note Grid View
        return (
            <div className="max-w-5xl mx-auto px-4 py-6">
                <h1 className="text-2xl md:text-3xl font-bold mb-6 capitalize">{sectionName}</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {notes.map((note, idx) => (
                        <Link
                            key={idx}
                            href={`${sectionPath}?note=${idx}`}
                            className="p-5 rounded-lg border border-border hover:border-primary/50 transition-all card-hover group"
                            style={{ backgroundColor: 'var(--card)' }}
                        >
                            <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                {note.title}
                            </h3>
                            {note.tags && note.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                    {note.tags.slice(0, 3).map(tag => (
                                        <span key={tag} className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                                            #{tag}
                                        </span>
                                    ))}
                                    {note.tags.length > 3 && (
                                        <span className="text-xs text-muted-foreground">+{note.tags.length - 3}</span>
                                    )}
                                </div>
                            )}
                        </Link>
                    ))}
                    {notes.length === 0 && (
                        <p className="text-muted-foreground col-span-full text-center py-8">No notes available.</p>
                    )}
                </div>

                <div className="mt-10">
                    <CommentSection unitPath={unitSlug} />
                </div>
            </div>
        );
    }

    return notFound();
}
