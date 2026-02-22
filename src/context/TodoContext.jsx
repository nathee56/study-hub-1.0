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

    // Notification permission status
    const [notificationPermission, setNotificationPermission] = useState('default');

    useEffect(() => {
        if ('Notification' in window) {
            setNotificationPermission(Notification.permission);
        }
    }, []);

    const requestNotificationPermission = async () => {
        if (!('Notification' in window)) return false;
        try {
            const permission = await Notification.requestPermission();
            setNotificationPermission(permission);
            return permission === 'granted';
        } catch (e) {
            console.error('Error requesting notification permission:', e);
            return false;
        }
    };

    const scheduleNotification = (text, dueDate) => {
        if (notificationPermission !== 'granted' || !dueDate) return;

        const timeToDue = new Date(dueDate).getTime() - new Date().getTime();
        // Warn 1 hour before due date
        const warnTime = timeToDue - (60 * 60 * 1000);

        if (warnTime > 0) {
            setTimeout(() => {
                new Notification('StudyHub Planner: ใกล้ถึงกำหนดส่ง!', {
                    body: `งาน "${text}" กำลังจะถึงกำหนดในอีก 1 ชั่วโมง`,
                    icon: '/study-hub-1.0/vite.svg'
                });
            }, warnTime);
        }
    };

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
    }, [user, synced]);

    const saveTodos = useCallback((newTodos) => {
        setTodos(newTodos);
        localStorage.setItem('slh-todos', JSON.stringify(newTodos));
        if (user) {
            setUserData(user.uid, 'todos', newTodos);
        }
    }, [user]);

    const addTodo = (text, priority = 'ปานกลาง', dueDate = null) => {
        const id = Date.now().toString();
        const updated = [...todos, {
            id,
            text,
            completed: false,
            priority,
            dueDate,
            createdAt: new Date().toISOString()
        }];
        saveTodos(updated);

        if (dueDate) {
            scheduleNotification(text, dueDate);
        }
    };

    const toggleTodo = (id) => {
        saveTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const deleteTodo = (id) => {
        saveTodos(todos.filter(t => t.id !== id));
    };

    const editTodo = (id, text, dueDate = null) => {
        saveTodos(todos.map(t => t.id === id ? { ...t, text, dueDate: dueDate !== null ? dueDate : t.dueDate } : t));
    };

    const clearCompleted = () => {
        saveTodos(todos.filter(t => !t.completed));
    };

    return (
        <TodoContext.Provider value={{
            todos, addTodo, toggleTodo, deleteTodo, editTodo, clearCompleted,
            notificationPermission, requestNotificationPermission
        }}>
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
