import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Search, StickyNote } from 'lucide-react';
import { useNotes } from '../../context/NotesContext';
import './QuickNotes.css';

export default function QuickNotes() {
    const { notes, addNote, updateNote, deleteNote, COLORS } = useNotes();
    const [search, setSearch] = useState('');
    const [editingId, setEditingId] = useState(null);

    const filteredNotes = notes.filter(n => {
        const q = search.toLowerCase();
        return !q || n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
    });

    const handleAdd = () => {
        const id = addNote('บันทึกใหม่', '', COLORS[6]);
        setEditingId(id);
    };

    const handleDelete = (id, e) => {
        e.stopPropagation();
        if (confirm('ลบบันทึกนี้?')) {
            deleteNote(id);
            if (editingId === id) setEditingId(null);
        }
    };

    const editingNote = editingId ? notes.find(n => n.id === editingId) : null;

    return (
        <div className="notes-page section">
            <div className="container">
                <Link to="/tools" className="tool-back-link">
                    <ArrowLeft size={16} /> กลับไปเครื่องมือ
                </Link>

                <div className="notes-layout">
                    {/* Sidebar List */}
                    <div className="notes-sidebar">
                        <div className="notes-sidebar-header">
                            <h2 className="notes-sidebar-title">
                                <StickyNote size={18} /> บันทึกของฉัน
                            </h2>
                            <button className="btn btn-primary btn-sm" onClick={handleAdd}>
                                <Plus size={16} />
                            </button>
                        </div>

                        <div className="notes-search">
                            <Search size={14} />
                            <input
                                type="text"
                                placeholder="ค้นหาบันทึก..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="notes-list">
                            {filteredNotes.length === 0 ? (
                                <div className="notes-empty">
                                    <p>ยังไม่มีบันทึก</p>
                                    <button className="btn btn-secondary btn-sm" onClick={handleAdd}>
                                        <Plus size={14} /> สร้างบันทึก
                                    </button>
                                </div>
                            ) : (
                                filteredNotes.map(note => (
                                    <div
                                        key={note.id}
                                        className={`notes-list-item ${editingId === note.id ? 'active' : ''}`}
                                        onClick={() => setEditingId(note.id)}
                                        style={{ borderLeft: `3px solid ${note.color === '#FFF' ? 'var(--color-border)' : note.color}` }}
                                    >
                                        <div className="notes-list-item-content">
                                            <h4>{note.title || 'ไม่มีชื่อ'}</h4>
                                            <p>{note.content ? note.content.substring(0, 60) + '...' : 'ว่าง'}</p>
                                        </div>
                                        <button className="notes-delete-btn" onClick={(e) => handleDelete(note.id, e)}>
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Editor */}
                    <div className="notes-editor card">
                        {editingNote ? (
                            <>
                                <input
                                    type="text"
                                    className="notes-editor-title"
                                    value={editingNote.title}
                                    onChange={e => updateNote(editingNote.id, { title: e.target.value })}
                                    placeholder="ชื่อบันทึก..."
                                />

                                <div className="notes-color-picker">
                                    {COLORS.map(c => (
                                        <button
                                            key={c}
                                            className={`notes-color-btn ${editingNote.color === c ? 'active' : ''}`}
                                            style={{ background: c === '#FFF' ? '#F9FAFB' : c }}
                                            onClick={() => updateNote(editingNote.id, { color: c })}
                                        />
                                    ))}
                                </div>

                                <textarea
                                    className="notes-editor-content"
                                    value={editingNote.content}
                                    onChange={e => updateNote(editingNote.id, { content: e.target.value })}
                                    placeholder="เริ่มเขียนบันทึก..."
                                    style={{ background: editingNote.color === '#FFF' ? 'var(--color-bg)' : editingNote.color + '40' }}
                                />

                                <div className="notes-editor-meta">
                                    อัปเดตล่าสุด: {new Date(editingNote.updatedAt).toLocaleString('th-TH')}
                                </div>
                            </>
                        ) : (
                            <div className="notes-editor-empty">
                                <StickyNote size={40} />
                                <h3>เลือกบันทึก</h3>
                                <p>เลือกบันทึกจากรายการ หรือสร้างบันทึกใหม่</p>
                                <button className="btn btn-primary" onClick={handleAdd}>
                                    <Plus size={16} /> สร้างบันทึก
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
