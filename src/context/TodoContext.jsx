import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getUserData, setUserData } from '../utils/firestoreHelpers';

const TodoContext = createContext();

export function TodoProvider({ children }) {
    const [todos, setTodos] = useState(() => {
        try {
            const stored = localStorage.getItem('slh-todos');
            return stored ? JSON.parse(stored) : [];
        } catch { return []; }
    });
    const { user } = useAuth();
    const [synced, setSynced] = useState(false);

    // Load from Firestore when user logs in
    useEffect(() => {
        if (user && !synced) {
            getUserData(user.uid, 'todos').then(data => {
                if (data && Array.isArray(data)) {
                    setTodos(data);
                    localStorage.setItem('slh-todos', JSON.stringify(data));
                }
                setSynced(true);
            });
        }
        if (!user) setSynced(false);
    }, [user]);

    const saveTodos = useCallback((newTodos) => {
        setTodos(newTodos);
        localStorage.setItem('slh-todos', JSON.stringify(newTodos));
        if (user) {
            setUserData(user.uid, 'todos', newTodos);
        }
    }, [user]);

    const addTodo = (text, priority = 'ปานกลาง') => {
        const updated = [...todos, {
            id: Date.now().toString(),
            text,
            completed: false,
            priority,
            createdAt: new Date().toISOString()
        }];
        saveTodos(updated);
    };

    const toggleTodo = (id) => {
        saveTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const deleteTodo = (id) => {
        saveTodos(todos.filter(t => t.id !== id));
    };

    const editTodo = (id, text) => {
        saveTodos(todos.map(t => t.id === id ? { ...t, text } : t));
    };

    const clearCompleted = () => {
        saveTodos(todos.filter(t => !t.completed));
    };

    return (
        <TodoContext.Provider value={{ todos, addTodo, toggleTodo, deleteTodo, editTodo, clearCompleted }}>
            {children}
        </TodoContext.Provider>
    );
}

export function useTodos() {
    const context = useContext(TodoContext);
    if (!context) throw new Error('useTodos must be used within TodoProvider');
    return context;
}

export default TodoContext;
