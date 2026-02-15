import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Check, ArrowLeft, CheckSquare, AlertCircle, CircleDot } from 'lucide-react';
import { useTodos } from '../../context/TodoContext';
import './TodoList.css';

const PRIORITY_MAP = {
    'สูง': { color: '#EF4444', icon: <AlertCircle size={14} /> },
    'ปานกลาง': { color: '#F59E0B', icon: <CircleDot size={14} /> },
    'ต่ำ': { color: '#10B981', icon: <Check size={14} /> },
};

export default function TodoList() {
    const { todos, addTodo, toggleTodo, deleteTodo, clearCompleted } = useTodos();
    const [newText, setNewText] = useState('');
    const [newPriority, setNewPriority] = useState('ปานกลาง');
    const [filter, setFilter] = useState('all');

    const handleAdd = (e) => {
        e.preventDefault();
        if (!newText.trim()) return;
        addTodo(newText.trim(), newPriority);
        setNewText('');
    };

    const filteredTodos = todos.filter(t => {
        if (filter === 'active') return !t.completed;
        if (filter === 'completed') return t.completed;
        return true;
    });

    const activeCount = todos.filter(t => !t.completed).length;
    const completedCount = todos.filter(t => t.completed).length;

    return (
        <div className="todo-page section">
            <div className="container">
                <Link to="/tools" className="tool-back-link">
                    <ArrowLeft size={16} /> กลับไปเครื่องมือ
                </Link>

                <div className="todo-wrapper">
                    <div className="todo-card card">
                        <div className="todo-header">
                            <div className="todo-header-icon">
                                <CheckSquare size={24} />
                            </div>
                            <div>
                                <h1 className="todo-title">รายการสิ่งที่ต้องทำ</h1>
                                <p className="todo-subtitle">{activeCount} รายการที่ยังไม่เสร็จ</p>
                            </div>
                        </div>

                        {/* Add Form */}
                        <form onSubmit={handleAdd} className="todo-form">
                            <input
                                type="text"
                                placeholder="เพิ่มสิ่งที่ต้องทำ..."
                                value={newText}
                                onChange={e => setNewText(e.target.value)}
                                className="todo-input"
                            />
                            <select
                                value={newPriority}
                                onChange={e => setNewPriority(e.target.value)}
                                className="todo-priority-select"
                            >
                                <option value="สูง">🔴 สูง</option>
                                <option value="ปานกลาง">🟡 ปานกลาง</option>
                                <option value="ต่ำ">🟢 ต่ำ</option>
                            </select>
                            <button type="submit" className="btn btn-primary todo-add-btn">
                                <Plus size={18} />
                            </button>
                        </form>

                        {/* Filter tabs */}
                        <div className="todo-filters">
                            {[
                                { key: 'all', label: `ทั้งหมด (${todos.length})` },
                                { key: 'active', label: `ยังไม่เสร็จ (${activeCount})` },
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
                                    <p>{filter === 'completed' ? 'ยังไม่มีรายการที่เสร็จ' : 'ยังไม่มีรายการ — เพิ่มเลย!'}</p>
                                </div>
                            ) : (
                                filteredTodos.map(todo => (
                                    <div key={todo.id} className={`todo-item ${todo.completed ? 'todo-item--done' : ''}`}>
                                        <button className="todo-checkbox" onClick={() => toggleTodo(todo.id)}>
                                            {todo.completed && <Check size={14} />}
                                        </button>

                                        <span className="todo-text">{todo.text}</span>

                                        <span
                                            className="todo-priority"
                                            style={{ color: PRIORITY_MAP[todo.priority]?.color }}
                                        >
                                            {PRIORITY_MAP[todo.priority]?.icon}
                                        </span>

                                        <button className="todo-delete" onClick={() => deleteTodo(todo.id)}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {completedCount > 0 && (
                            <button className="todo-clear-btn" onClick={clearCompleted}>
                                ล้างรายการที่เสร็จแล้ว ({completedCount})
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
