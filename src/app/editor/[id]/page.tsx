'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import {
    Save,
    Share2,
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    Code,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    CheckSquare,
    Quote,
    Minus,
    Highlighter,
    Undo2,
    Redo2,
    Clock,
    X,
    UserPlus,
    FileText,
    Loader2,
    ChevronLeft,
    Check,
    CheckCircle2,
    AlertCircle,
    Plus
} from 'lucide-react';
import { useDocumentStore } from '@/store/useDocumentStore';
import { formatDistanceToNow } from 'date-fns';

export default function EditorPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const params = useParams();
    const documentId = params.id as string;

    const { currentDocument, setCurrentDocument } = useDocumentStore();

    const [title, setTitle] = useState('');
    const [showShareModal, setShowShareModal] = useState(false);
    const [showVersions, setShowVersions] = useState(false);
    const [shareEmail, setShareEmail] = useState('');
    const [shareError, setShareError] = useState('');
    const [shareSuccess, setShareSuccess] = useState('');
    const [versions, setVersions] = useState<any[]>([]);

    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null);

    const initialLoadDone = useRef(false);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
            Placeholder.configure({ placeholder: 'Start typing...' }),
            Highlight.configure({ multicolor: true }),
            TaskList,
            TaskItem.configure({ nested: true }),
            Underline,
            TextStyle,
            Color,
        ],
        content: '',
        editorProps: {
            attributes: {
                class: 'tiptap',
                style: 'max-width: 800px; margin: 0 auto; min-height: 70vh; outline: none; padding: 40px 0;'
            },
        },
    });

    // 1. Authentication Check
    useEffect(() => {
        if (status === 'unauthenticated') router.push('/auth/login');
    }, [status]);

    // 2. Initial Fetch
    useEffect(() => {
        if (status === 'authenticated' && documentId) {
            fetchDocument();
        }
        return () => {
            initialLoadDone.current = false;
            setCurrentDocument(null);
        };
    }, [status, documentId]);

    // 3. Sync Content to Editor (ONCE)
    useEffect(() => {
        if (editor && currentDocument && !initialLoadDone.current) {
            editor.commands.setContent(currentDocument.content || '');
            editor.commands.focus('start'); // Bring cursor to start of page
            setTitle(currentDocument.title || 'Untitled Document');
            initialLoadDone.current = true;
        }
    }, [editor, currentDocument]);

    const fetchDocument = async () => {
        try {
            const res = await fetch(`/api/documents/${documentId}?t=${Date.now()}`, { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                setCurrentDocument(data.document);
                if (data.document.updatedAt) setLastSaved(new Date(data.document.updatedAt));
            }
        } catch (err) {
            console.error('Fetch error:', err);
        }
    };

    const handleManualSave = async () => {
        if (!editor) return;

        const contentToSave = editor.getHTML();
        const titleToSave = title.trim() || 'Untitled Document';

        setSaveError(null);
        setIsSaving(true);

        try {
            const res = await fetch(`/api/documents/${documentId}?t=${Date.now()}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: contentToSave, title: titleToSave }),
                cache: 'no-store'
            });

            const data = await res.json();

            if (res.ok) {
                setCurrentDocument(data.document);
                setLastSaved(new Date());
                setIsSaving(false);
            } else {
                const errorMessage = data.details ? `${data.error}: ${data.details}` : (data.error || 'Failed to save');
                setSaveError(errorMessage);
                setIsSaving(false);
            }
        } catch (err) {
            setSaveError('Network error while saving');
            setIsSaving(false);
        }
    };

    const handleShare = async () => {
        setShareError('');
        setShareSuccess('');
        try {
            const res = await fetch(`/api/documents/${documentId}/collaborators`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: shareEmail }),
            });
            const data = await res.json();
            if (!res.ok) {
                setShareError(data.error);
            } else {
                setShareSuccess(`Shared with ${shareEmail}`);
                setShareEmail('');
                fetchDocument();
            }
        } catch {
            setShareError('Failed to share');
        }
    };

    // Keyboard Shortcuts
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 's' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleManualSave();
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, [editor, title]);

    if (status === 'loading' || !editor) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 className="animate-spin" size={32} color="#6366f1" />
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#fff', color: '#0f172a' }}>
            {/* Navbar */}
            <header style={{ height: 64, borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, background: '#fff', zIndex: 100 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <button
                        onClick={() => window.location.href = '/dashboard'}
                        style={{ padding: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                    >
                        <ChevronLeft size={20} strokeWidth={3} />
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <FileText size={20} color="#6366f1" />
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Untitled Document"
                            style={{ border: 'none', outline: 'none', fontSize: 16, fontWeight: 800, width: 200 }}
                            onBlur={handleManualSave}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 20 }}>
                        {isSaving ? (
                            <div style={{ fontSize: 12, color: '#6366f1', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
                                <Loader2 size={12} className="animate-spin" /> SAVING...
                            </div>
                        ) : lastSaved ? (
                            <div style={{ fontSize: 12, color: '#10b981', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
                                <Check size={12} strokeWidth={3} /> SAVED
                            </div>
                        ) : null}
                        {saveError && (
                            <div style={{ fontSize: 12, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
                                <AlertCircle size={12} /> {saveError}
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button
                        onClick={handleManualSave}
                        disabled={isSaving}
                        style={{ background: '#6366f1', color: '#fff', border: 'none', padding: '8px 24px', borderRadius: 10, fontWeight: 800, cursor: isSaving ? 'default' : 'pointer', fontSize: 13 }}
                    >
                        {isSaving ? 'SYNCING...' : 'SAVE'}
                    </button>
                    <button
                        onClick={() => setShowShareModal(true)}
                        style={{ padding: '8px 16px', background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: 13, color: '#475569' }}
                    >
                        SHARE
                    </button>
                </div>
            </header>

            {/* Toolbar */}
            <div style={{ borderBottom: '1px solid #f1f5f9', padding: '8px', display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap', position: 'sticky', top: 64, background: '#fff', zIndex: 90 }}>
                {[
                    { tag: 'B', action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold') },
                    { tag: 'I', action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic') },
                    { tag: 'U', action: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive('underline') },
                    { tag: 'H1', action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive('heading', { level: 1 }) },
                    { tag: 'H2', action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }) },
                    { tag: 'LIST', action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList') },
                    { tag: 'BLOCK', action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive('blockquote') },
                ].map((btn, i) => (
                    <button
                        key={i}
                        onClick={btn.action}
                        style={{
                            padding: '6px 14px',
                            background: btn.active ? '#0f172a' : '#fff',
                            color: btn.active ? '#fff' : '#475569',
                            border: '1px solid #e2e8f0',
                            borderRadius: 8,
                            fontSize: 11,
                            fontWeight: 800,
                            cursor: 'pointer'
                        }}
                    >
                        {btn.tag}
                    </button>
                ))}
            </div>

            {/* Editor Area */}
            <div style={{ background: '#fff', transition: 'all 0.4s', opacity: initialLoadDone.current ? 1 : 0 }}>
                <EditorContent editor={editor} />
            </div>

            {saveError && (
                <div style={{ position: 'fixed', bottom: 20, right: 20, background: '#ef4444', color: '#fff', padding: '16px 24px', borderRadius: 16, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 12, zIndex: 1000 }}>
                    <AlertCircle size={20} />
                    <div>
                        <div style={{ opacity: 0.8, fontSize: 10, textTransform: 'uppercase', marginBottom: 2 }}>Sync Error</div>
                        {saveError}
                    </div>
                    <button
                        onClick={() => setSaveError(null)}
                        style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', padding: '4px 8px', borderRadius: 6, cursor: 'pointer', fontSize: 10 }}
                    >
                        DISMISS
                    </button>
                </div>
            )}

            {/* Share Modal */}
            <AnimatePresence>
                {showShareModal && (
                    <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 20 }}>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)' }}
                            onClick={() => setShowShareModal(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            style={{
                                position: 'relative',
                                background: '#fff',
                                padding: '40px 32px',
                                borderRadius: 32,
                                width: '100%',
                                maxWidth: 440,
                                boxShadow: '0 30px 100px -15px rgba(0,0,0,0.3)',
                                zIndex: 1
                            }}
                        >
                            <h3 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8, color: '#0f172a', letterSpacing: '-0.03em' }}>Invite Collaborators</h3>
                            <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24, fontWeight: 500 }}>Share this document with your team members by email.</p>

                            <div style={{ display: 'flex', gap: 10 }}>
                                <input
                                    value={shareEmail}
                                    onChange={(e) => setShareEmail(e.target.value)}
                                    placeholder="Enter collaborator email"
                                    style={{
                                        flex: 1,
                                        padding: '14px 18px',
                                        borderRadius: 16,
                                        border: '1.5px solid #eef2f6',
                                        outline: 'none',
                                        background: '#f8fafc',
                                        fontSize: 14,
                                        fontWeight: 500
                                    }}
                                />
                                <button
                                    onClick={handleShare}
                                    style={{
                                        padding: '0 20px',
                                        background: '#6366f1',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: 16,
                                        fontWeight: 900,
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                                    }}
                                >
                                    <Plus size={22} />
                                </button>
                            </div>

                            {shareError && (
                                <div style={{ color: '#ef4444', fontSize: 13, marginTop: 16, background: '#fef2f2', padding: '10px 14px', borderRadius: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <AlertCircle size={14} />
                                    {shareError}
                                </div>
                            )}
                            {shareSuccess && (
                                <div style={{ color: '#10b981', fontSize: 13, marginTop: 16, background: '#f0fdf4', padding: '10px 14px', borderRadius: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <CheckCircle2 size={14} />
                                    {shareSuccess}
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
