import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getUserData, setUserData } from '../utils/firestoreHelpers';

const NotesContext = createContext();

const COLORS = ['#FEFCE8', '#FEF3C7', '#DBEAFE', '#D1FAE5', '#FCE7F3', '#EDE9FE', '#FFF'];

export function NotesProvider({ children }) {
    const [notes, setNotes] = useState(() => {
        try {
            const stored = localStorage.getItem('slh-notes');
            return stored ? JSON.parse(stored) : [];
        } catch { return []; }
    });
    const { user } = useAuth();
    const [synced, setSynced] = useState(false);

    // Load from Firestore when user logs in
    useEffect(() => {
        if (user && !synced) {
            getUserData(user.uid, 'notes').then(data => {
                if (data && Array.isArray(data)) {
                    setNotes(data);
                    localStorage.setItem('slh-notes', JSON.stringify(data));
                }
                setSynced(true);
            });
        }
        if (!user) setSynced(false);
    }, [user]);

    const saveNotes = useCallback((newNotes) => {
        setNotes(newNotes);
        localStorage.setItem('slh-notes', JSON.stringify(newNotes));
        if (user) {
            setUserData(user.uid, 'notes', newNotes);
        }
    }, [user]);

    const addNote = (title = '', content = '', color = COLORS[6]) => {
        const note = {
            id: Date.now().toString(),
            title,
            content,
            color,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        const updated = [note, ...notes];
        saveNotes(updated);
        return note.id;
    };

    const updateNote = (id, updates) => {
        const updated = notes.map(n =>
            n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
        );
        saveNotes(updated);
    };

    const deleteNote = (id) => {
        saveNotes(notes.filter(n => n.id !== id));
    };

    return (
        <NotesContext.Provider value={{ notes, addNote, updateNote, deleteNote, COLORS }}>
            {children}
        </NotesContext.Provider>
    );
}

export function useNotes() {
    const context = useContext(NotesContext);
    if (!context) throw new Error('useNotes must be used within NotesProvider');
    return context;
}

export default NotesContext;
