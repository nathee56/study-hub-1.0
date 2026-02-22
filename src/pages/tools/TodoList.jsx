import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Check, ArrowLeft, CheckSquare, AlertCircle, CircleDot, Calendar, Bell, Star } from 'lucide-react';
import { useTodos } from '../../context/TodoContext';
import './TodoList.css';

const PRIORITY_MAP = {
    'สูง': { color: '#EF4444', icon: <AlertCircle size={14} /> },
    'ปานกลาง': { color: '#F59E0B', icon: <CircleDot size={14} /> },
    'ต่ำ': { color: '#10B981', icon: <Check size={14} /> },
};

export default function TodoList() {
    const { todos, addTodo, toggleTodo, deleteTodo, clearCompleted, notificationPermission, requestNotificationPermission } = useTodos();
    const [newText, setNewText] = useState('');
    const [newPriority, setNewPriority] = useState('ปานกลาง');
    const [newDueDate, setNewDueDate] = useState('');
    const [filter, setFilter] = useState('all');

    const handleAdd = (e) => {
        e.preventDefault();
        if (!newText.trim()) return;
        addTodo(newText.trim(), newPriority, newDueDate || null);
        setNewText('');
        setNewDueDate('');
    };

    const handleEnableNotifications = async () => {
        const success = await requestNotificationPermission();
        if (success) {
            new Notification('StudyHub Planner', {
                body: 'เปิดการแจ้งเตือนสำเร็จ! ระบบจะเตือนเมื่อใกล้ถึงกำหนดส่งงาน',
                icon: '/study-hub-1.0/vite.svg'
            });
        }
    };

    const filteredTodos = todos.filter(t => {
        if (filter === 'active') return !t.completed;
        if (filter === 'completed') return t.completed;
        return true;
    }).sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        if (a.dueDate && b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate);
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return 0;
    });

    const activeCount = todos.filter(t => !t.completed).length;
    const completedCount = todos.filter(t => t.completed).length;

    // Gamification Logic
    const progressPercent = todos.length === 0 ? 0 : Math.round((completedCount / todos.length) * 100);
    const getMotivationText = () => {
        if (todos.length === 0) return 'เริ่มวางแผนวันนี้เลย 🎯';
        if (progressPercent === 100) return 'ยอดเยี่ยม! ทำเสร็จหมดแล้ว ✨';
        if (progressPercent > 70) return 'ใกล้ความจริงแล้ว สู้ๆ! 🔥';
        if (progressPercent > 30) return 'ทำไปได้สวย ลุยต่อ! 💪';
        return 'เริ่มต้นได้ดี ค่อยๆ ทำไปนะ 🐢';
    };

    const formatDueDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('th-TH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const isOverdue = (dateStr) => {
        if (!dateStr) return false;
        return new Date(dateStr) < new Date();
    };

    return (
        <div className="todo-page section">
            <div className="container">
                <Link to="/tools" className="tool-back-link">
                    <ArrowLeft size={16} /> กลับไปเครื่องมือ
                </Link>

                <div className="todo-wrapper">
                    {/* Gamification Tracker */}
                    <div className="todo-progress-card liquid-card">
                        <div className="progress-header">
                            <span className="motivation-text">{getMotivationText()}</span>
                            {progressPercent === 100 && todos.length > 0 && <Star className="star-icon bounce" fill="#FBBF24" color="#FBBF24" />}
                        </div>
                        <div className="progress-bar-bg">
                            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
                        </div>
                        <div className="progress-stats">
                            <span>ทำเสร็จ: {completedCount}/{todos.length}</span>
                            <span>{progressPercent}%</span>
                        </div>
                    </div>

                    <div className="todo-card liquid-card">
                        <div className="todo-header-row">
                            <div className="todo-header">
                                <div className="todo-header-icon">
                                    <CheckSquare size={24} />
                                </div>
                                <div>
                                    <h1 className="todo-title">แพลนเนอร์อัจฉริยะ</h1>
                                    <p className="todo-subtitle">{activeCount} รายการที่กำลังรอคุณอยู่</p>
                                </div>
                            </div>

                            {/* Notification Toggle */}
                            {('Notification' in window) && notificationPermission !== 'granted' && (
                                <button className="notify-btn" onClick={handleEnableNotifications} title="เปิดการแจ้งเตือนงาน">
                                    <Bell size={18} />
                                    <span>เปิดแจ้งเตือน</span>
                                </button>
                            )}
                        </div>

                        {/* Add Form */}
                        <form onSubmit={handleAdd} className="todo-form">
                            <div className="todo-input-row">
                                <input
                                    type="text"
                                    placeholder="เพิ่มสิ่งที่ต้องทำ วันนี้มีอะไรบ้าง?"
                                    value={newText}
                                    onChange={e => setNewText(e.target.value)}
                                    className="todo-input"
                                />
                                <button type="submit" className="btn btn-primary todo-add-btn">
                                    <Plus size={18} />
                                </button>
                            </div>
                            <div className="todo-input-options">
                                <div className="todo-datetime-wrapper">
                                    <Calendar size={14} className="input-icon" />
                                    <input
                                        type="datetime-local"
                                        value={newDueDate}
                                        onChange={e => setNewDueDate(e.target.value)}
                                        className="todo-date-input"
                                    />
                                </div>
                                <select
                                    value={newPriority}
                                    onChange={e => setNewPriority(e.target.value)}
                                    className="todo-priority-select"
                                >
                                    <option value="สูง">🔴 สำคัญมาก</option>
                                    <option value="ปานกลาง">🟡 ปานกลาง</option>
                                    <option value="ต่ำ">🟢 ทั่วไป</option>
                                </select>
                            </div>
                        </form>

                        {/* Filter tabs */}
                        <div className="todo-filters">
                            {[
                                { key: 'all', label: `ทั้งหมด (${todos.length})` },
                                { key: 'active', label: `ค้างอยู่ (${activeCount})` },
                                { key: 'completed', label: `เสร็จแล้ว (${completedCount})` },
                            ].map(f => (
                                <button
                                    key={f.key}
                                    className={`todo-filter-btn ${filter === f.key ? 'active' : ''}`}
                                    onClick={() => setFilter(f.key)}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>

                        {/* List */}
                        <div className="todo-list">
                            {filteredTodos.length === 0 ? (
                                <div className="todo-empty">
                                    <div className="empty-icon-wrapper">
                                        <CheckSquare size={32} opacity={0.3} />
                                    </div>
                                    <p>{filter === 'completed' ? 'ยังไม่มีภารกิจที่ทำสำเร็จ' : 'แผ่นงานกระดาษเปล่า... เติมเป้าหมายของวันนี้เลย!'}</p>
                                </div>
                            ) : (
                                filteredTodos.map(todo => (
                                    <div key={todo.id} className={`todo-item glass-item ${todo.completed ? 'todo-item--done' : ''}`}>
                                        <button className="todo-checkbox" onClick={() => toggleTodo(todo.id)}>
                                            {todo.completed && <Check size={14} />}
                                        </button>

                                        <div className="todo-content">
                                            <span className="todo-text">{todo.text}</span>
                                            {todo.dueDate && (
                                                <div className={`todo-due-date ${!todo.completed && isOverdue(todo.dueDate) ? 'overdue' : ''}`}>
                                                    <Calendar size={12} />
                                                    {formatDueDate(todo.dueDate)}
                                                    {!todo.completed && isOverdue(todo.dueDate) && <span className="overdue-badge">เลยกำหนด!</span>}
                                                </div>
                                            )}
                                        </div>

                                        <span className="todo-priority" style={{ color: PRIORITY_MAP[todo.priority]?.color }}>
                                            {PRIORITY_MAP[todo.priority]?.icon}
                                        </span>

                                        <button className="todo-delete" onClick={() => deleteTodo(todo.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {completedCount > 0 && (
                            <button className="todo-clear-btn" onClick={clearCompleted}>
                                ลบรายการเสร็จสมบูรณ์ ({completedCount})
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
