'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Plus,
    Search,
    Trash2,
    Clock,
    LogOut,
    MoreVertical,
    File,
    ChevronRight,
} from 'lucide-react';
import { useDocumentStore } from '@/store/useDocumentStore';
import { formatDistanceToNow } from 'date-fns';

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const {
        documents,
        setDocuments,
        searchQuery,
        setSearchQuery,
        isLoading,
        setIsLoading,
    } = useDocumentStore();

    const [activeTab, setActiveTab] = useState<'all' | 'owned' | 'shared'>('all');
    const [contextMenu, setContextMenu] = useState<{ id: string; x: number; y: number } | null>(null);
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login');
        }
    }, [status, router]);

    useEffect(() => {
        if (status === 'authenticated') {
            fetchDocuments();
        }
    }, [status]);

    const fetchDocuments = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/documents?t=${Date.now()}`, { cache: 'no-store' });
            const data = await res.json();
            if (res.ok) {
                setDocuments(data.documents);
            }
        } catch (error) {
            console.error('Failed to fetch documents:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const createDocument = async () => {
        setCreating(true);
        try {
            const res = await fetch('/api/documents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store',
                body: JSON.stringify({ title: 'Untitled Document' }),
            });
            const data = await res.json();
            if (res.ok) {
                router.push(`/editor/${data.document._id}`);
            }
        } catch (error) {
            console.error('Failed to create document:', error);
        } finally {
            setCreating(false);
        }
    };

    const deleteDocument = async (id: string) => {
        try {
            const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchDocuments();
            }
        } catch (error) {
            console.error('Failed to delete:', error);
        }
        setContextMenu(null);
    };

    const userId = (session?.user as any)?.id;

    const filteredDocs = documents.filter((doc: any) => {
        const matchesSearch = doc.title?.toLowerCase().includes(searchQuery.toLowerCase());
        if (activeTab === 'owned') return matchesSearch && (doc.owner?._id === userId || doc.owner === userId);
        if (activeTab === 'shared') return matchesSearch && doc.owner?._id !== userId && doc.owner !== userId;
        return matchesSearch;
    });

    const ownedCount = documents.filter((d: any) => d.owner?._id === userId || d.owner === userId).length;
    const sharedCount = documents.length - ownedCount;

    if (status === 'loading') {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
                <div className="animate-spin" style={{ width: 32, height: 32, border: '3px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
            </div>
        );
    }

    // Styles
    const containerStyle: React.CSSProperties = {
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 24px',
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc' }} onClick={() => setContextMenu(null)}>
            {/* Navbar */}
            <nav style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', sticky: 'top', zIndex: 30, position: 'sticky', top: 0 }}>
                <div
                    className="mobile-padding"
                    style={{ ...containerStyle, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ background: '#6366f1', padding: 8, borderRadius: 10, display: 'flex' }}>
                            <FileText size={20} color="white" />
                        </div>
                        <span style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em' }}>SyncBoard</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div
                            className="mobile-hide"
                            style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', padding: '6px 16px', borderRadius: 100, gap: 8, border: '1px solid #e2e8f0' }}
                        >
                            <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#6366f1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>
                                {session?.user?.name?.[0]?.toUpperCase()}
                            </div>
                            <span style={{ fontSize: 14, fontWeight: 600, color: '#475569' }}>{session?.user?.name}</span>
                        </div>
                        <button
                            onClick={() => signOut({ callbackUrl: '/auth/login' })}
                            style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
                        >
                            <LogOut size={16} />
                            <span className="mobile-hide">Exit</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Content Container */}
            <main
                className="mobile-padding"
                style={{ ...containerStyle, padding: '40px 24px' }}
            >
                <div
                    className="mobile-stack mobile-mb-20"
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, gap: 20 }}
                >
                    <div className="mobile-full">
                        <h1 style={{ fontSize: 'var(--fs-title)', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.04em', margin: 0 }}>Documents</h1>
                        <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
                            {documents.length} files total • {ownedCount} personal • {sharedCount} shared
                        </p>
                    </div>
                    <button
                        onClick={createDocument}
                        disabled={creating}
                        className="mobile-full"
                        style={{
                            background: '#6366f1',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 12,
                            padding: '12px 24px',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 10,
                            cursor: 'pointer',
                            boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)',
                            transition: 'all 0.2s',
                        }}
                    >
                        {creating ? (
                            <div className="animate-spin" style={{ width: 18, height: 18, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
                        ) : (
                            <Plus size={20} strokeWidth={3} />
                        )}
                        New Document
                    </button>
                </div>

                {/* Filters Row */}
                <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }} className="mobile-gap-8">
                    <div
                        className="mobile-full"
                        style={{ background: '#fff', padding: 4, borderRadius: 12, border: '1px solid #e2e8f0', display: 'flex', gap: 4 }}
                    >
                        {[
                            { key: 'all' as const, label: 'Everything' },
                            { key: 'owned' as const, label: 'Personal' },
                            { key: 'shared' as const, label: 'Shared' },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                style={{
                                    flex: 1,
                                    padding: '8px 12px',
                                    fontSize: 12,
                                    fontWeight: 700,
                                    borderRadius: 10,
                                    border: 'none',
                                    cursor: 'pointer',
                                    background: activeTab === tab.key ? '#0f172a' : 'transparent',
                                    color: activeTab === tab.key ? '#fff' : '#64748b',
                                    transition: 'all 0.2s',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div style={{ position: 'relative', flexGrow: 1, minWidth: 260 }} className="mobile-full">
                        <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search your library..."
                            style={{
                                width: '100%',
                                background: '#fff',
                                border: '1px solid #e2e8f0',
                                borderRadius: 12,
                                padding: '12px 16px 12px 48px',
                                fontSize: 14,
                                outline: 'none',
                                transition: 'all 0.2s',
                                color: '#0f172a',
                            }}
                        />
                    </div>
                </div>

                {/* List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {isLoading ? (
                        [1, 2, 3].map((n) => (
                            <div key={n} style={{ height: 80, background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0' }} className="animate-pulse"></div>
                        ))
                    ) : filteredDocs.length === 0 ? (
                        <div style={{ background: '#fff', border: '2px dashed #e2e8f0', borderRadius: 24, padding: '64px 24px', textAlign: 'center' }} className="mobile-p-24">
                            <div style={{ background: '#f8fafc', width: 64, height: 64, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#cbd5e1' }}>
                                <File size={32} />
                            </div>
                            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>No matching records</h3>
                            <p style={{ fontSize: 14, color: '#64748b', marginTop: 8 }}>Try adjusting your search or create a new file.</p>
                        </div>
                    ) : (
                        filteredDocs.map((doc: any, i) => (
                            <motion.div
                                key={doc._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => router.push(`/editor/${doc._id}`)}
                                style={{
                                    background: '#fff',
                                    padding: '16px 20px',
                                    borderRadius: 16,
                                    border: '1px solid #e2e8f0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#6366f1';
                                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.05)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#e2e8f0';
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 0, flex: 1 }}>
                                    <div
                                        style={{ background: '#f8fafc', padding: 10, borderRadius: 12, color: '#64748b' }}
                                    >
                                        <FileText size={24} />
                                    </div>
                                    <div style={{ minWidth: 0, flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.title || 'Untitled Document'}</h3>
                                            {(doc.owner?._id !== userId && doc.owner !== userId) && (
                                                <span style={{
                                                    background: '#eef2ff',
                                                    color: '#6366f1',
                                                    fontSize: 10,
                                                    fontWeight: 800,
                                                    padding: '2px 8px',
                                                    borderRadius: 6,
                                                    textTransform: 'uppercase',
                                                    flexShrink: 0
                                                }}>Shared</span>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                                            <Clock size={12} color="#94a3b8" />
                                            <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500, flexShrink: 0 }}>
                                                {formatDistanceToNow(new Date(doc.updatedAt), { addSuffix: true })}
                                            </span>
                                            {doc.content && (
                                                <>
                                                    <span style={{ color: '#e2e8f0' }} className="mobile-hide">•</span>
                                                    <span
                                                        style={{ fontSize: 12, color: '#64748b', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 400 }}
                                                    >
                                                        {doc.content.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 70)}...
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setContextMenu({ id: doc._id, x: e.clientX, y: e.clientY });
                                        }}
                                        style={{ background: 'none', border: 'none', padding: 8, color: '#94a3b8', cursor: 'pointer', borderRadius: 8 }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#0f172a'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#94a3b8'; }}
                                    >
                                        <MoreVertical size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </main>

            {/* Context Menu */}
            <AnimatePresence>
                {contextMenu && (
                    <>
                        <div style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(2px)' }} onClick={() => setContextMenu(null)} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="mobile-context-menu"
                            style={{
                                position: 'fixed',
                                zIndex: 500,
                                background: '#fff',
                                border: '1px solid #e2e8f0',
                                borderRadius: 16,
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                                padding: 8,
                                minWidth: 200,
                                left: Math.min(contextMenu.x, typeof window !== 'undefined' ? window.innerWidth - 220 : contextMenu.x),
                                top: contextMenu.y,
                            }}
                        >
                            <button
                                onClick={() => router.push(`/editor/${contextMenu.id}`)}
                                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', fontSize: 14, fontWeight: 600, color: '#334155', background: 'none', border: 'none', borderRadius: 10, cursor: 'pointer', textAlign: 'left' }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                            >
                                <FileText size={18} /> Open Document
                            </button>
                            <div style={{ height: 1, background: '#f1f5f9', margin: '4px 0' }} />
                            <button
                                onClick={() => deleteDocument(contextMenu.id)}
                                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', fontSize: 14, fontWeight: 600, color: '#ef4444', background: 'none', border: 'none', borderRadius: 10, cursor: 'pointer', textAlign: 'left' }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                            >
                                <Trash2 size={18} /> Delete Permanently
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
