import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getUserData, setUserData } from '../utils/firestoreHelpers';

const BookmarkContext = createContext();

export function BookmarkProvider({ children }) {
    const [bookmarks, setBookmarks] = useState(() => {
        try {
            const stored = localStorage.getItem('slh-bookmarks');
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });
    const { user } = useAuth();
    const [synced, setSynced] = useState(false);

    // Load from Firestore when user logs in
    useEffect(() => {
        if (user && !synced) {
            getUserData(user.uid, 'bookmarks').then(data => {
                if (data && Array.isArray(data)) {
                    setBookmarks(data);
                    localStorage.setItem('slh-bookmarks', JSON.stringify(data));
                }
                setSynced(true);
            });
        }
        if (!user) setSynced(false);
    }, [user]);

    // Save to localStorage + Firestore
    const saveBookmarks = useCallback((newBookmarks) => {
        setBookmarks(newBookmarks);
        localStorage.setItem('slh-bookmarks', JSON.stringify(newBookmarks));
        if (user) {
            setUserData(user.uid, 'bookmarks', newBookmarks);
        }
    }, [user]);

    const addBookmark = (id) => {
        const updated = bookmarks.includes(id) ? bookmarks : [...bookmarks, id];
        saveBookmarks(updated);
    };

    const removeBookmark = (id) => {
        saveBookmarks(bookmarks.filter(b => b !== id));
    };

    const toggleBookmark = (id) => {
        const updated = bookmarks.includes(id)
            ? bookmarks.filter(b => b !== id)
            : [...bookmarks, id];
        saveBookmarks(updated);
    };

    const isBookmarked = (id) => bookmarks.includes(id);

    return (
        <BookmarkContext.Provider value={{ bookmarks, addBookmark, removeBookmark, toggleBookmark, isBookmarked }}>
            {children}
        </BookmarkContext.Provider>
    );
}

export function useBookmarks() {
    const context = useContext(BookmarkContext);
    if (!context) throw new Error('useBookmarks must be used within BookmarkProvider');
    return context;
}

export default BookmarkContext;
