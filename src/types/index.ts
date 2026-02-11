export interface UserType {
    id: string;
    name: string;
    email: string;
    avatarColor?: string;
}

export interface DocumentType {
    _id: string;
    title: string;
    content: string;
    emoji: string;
    isPublic: boolean;
    owner: UserType;
    collaborators: UserType[];
    lastEditedBy?: UserType;
    createdAt: string;
    updatedAt: string;
}

export interface VersionType {
    _id: string;
    documentId: string;
    content: string;
    title: string;
    editedBy: UserType;
    createdAt: string;
}

export interface ActiveUser {
    userId: string;
    userName: string;
    avatarColor: string;
    cursorPosition?: { x: number; y: number };
    isTyping?: boolean;
}
