import { create } from 'zustand';
import { DocumentType, ActiveUser } from '@/types';

interface DocumentStore {
    documents: DocumentType[];
    currentDocument: DocumentType | null;
    activeUsers: ActiveUser[];
    isLoading: boolean;
    isSaving: boolean;
    sidebarOpen: boolean;
    searchQuery: string;

    setDocuments: (docs: DocumentType[]) => void;
    setCurrentDocument: (doc: DocumentType | null) => void;
    addDocument: (doc: DocumentType) => void;
    updateDocument: (id: string, updates: Partial<DocumentType>) => void;
    removeDocument: (id: string) => void;
    setActiveUsers: (users: ActiveUser[]) => void;
    addActiveUser: (user: ActiveUser) => void;
    removeActiveUser: (userId: string) => void;
    updateActiveUser: (userId: string, updates: Partial<ActiveUser>) => void;
    setIsLoading: (loading: boolean) => void;
    setIsSaving: (saving: boolean) => void;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    setSearchQuery: (query: string) => void;
}

export const useDocumentStore = create<DocumentStore>((set) => ({
    documents: [],
    currentDocument: null,
    activeUsers: [],
    isLoading: false,
    isSaving: false,
    sidebarOpen: true,
    searchQuery: '',

    setDocuments: (documents) => set({ documents }),
    setCurrentDocument: (currentDocument) => set({ currentDocument }),
    addDocument: (doc) =>
        set((state) => ({ documents: [doc, ...state.documents] })),
    updateDocument: (id, updates) =>
        set((state) => ({
            documents: state.documents.map((d) =>
                d._id === id ? { ...d, ...updates } : d
            ),
            currentDocument:
                state.currentDocument?._id === id
                    ? { ...state.currentDocument, ...updates }
                    : state.currentDocument,
        })),
    removeDocument: (id) =>
        set((state) => ({
            documents: state.documents.filter((d) => d._id !== id),
            currentDocument:
                state.currentDocument?._id === id ? null : state.currentDocument,
        })),
    setActiveUsers: (activeUsers) => set({ activeUsers }),
    addActiveUser: (user) =>
        set((state) => ({
            activeUsers: state.activeUsers.some((u) => u.userId === user.userId)
                ? state.activeUsers.map((u) => (u.userId === user.userId ? user : u))
                : [...state.activeUsers, user],
        })),
    removeActiveUser: (userId) =>
        set((state) => ({
            activeUsers: state.activeUsers.filter((u) => u.userId !== userId),
        })),
    updateActiveUser: (userId, updates) =>
        set((state) => ({
            activeUsers: state.activeUsers.map((u) =>
                u.userId === userId ? { ...u, ...updates } : u
            ),
        })),
    setIsLoading: (isLoading) => set({ isLoading }),
    setIsSaving: (isSaving) => set({ isSaving }),
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
    setSearchQuery: (searchQuery) => set({ searchQuery }),
}));
