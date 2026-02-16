import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, FileText, Calculator, StickyNote, Filter } from 'lucide-react';
import learningData, { learningSubjects, learningTopics, learningTypes } from '../data/learningData';
import './LearningDatabase.css';

const typeIcons = {
    'สรุป': <BookOpen size={14} />,
    'สูตร': <Calculator size={14} />,
    'บันทึก': <StickyNote size={14} />,
};

const typeColors = {
    'สรุป': { bg: '#EFF6FF', color: '#2563EB' },
    'สูตร': { bg: '#EDE9FE', color: '#7C3AED' },
    'บันทึก': { bg: '#FEF3C7', color: '#D97706' },
};

export default function LearningDatabase() {
    const [search, setSearch] = useState('');
    const [activeSubject, setActiveSubject] = useState('');
    const [activeType, setActiveType] = useState('');

    const filtered = useMemo(() => {
        return learningData.filter(item => {
            const q = search.toLowerCase();
            const matchesSearch = !q ||
                item.title.toLowerCase().includes(q) ||
                item.topic.toLowerCase().includes(q) ||
                item.content.toLowerCase().includes(q) ||
                item.tags.some(t => t.toLowerCase().includes(q));
            const matchesSubject = !activeSubject || item.subject === activeSubject;
            const matchesType = !activeType || item.type === activeType;
            return matchesSearch && matchesSubject && matchesType;
        });
    }, [search, activeSubject, activeType]);

    const groupedByTopic = useMemo(() => {
        const groups = {};
        filtered.forEach(item => {
            if (!groups[item.topic]) groups[item.topic] = [];
            groups[item.topic].push(item);
        });
        return groups;
    }, [filtered]);

    return (
        <div className="learning-page section">
            <div className="container">
                <div className="learning-header">
                    <h1 className="page-title">คลังความรู้</h1>
                    <p className="page-subtitle">
                        สรุปเนื้อหา สูตรสำคัญ และบันทึกการเรียน จัดหมวดหมู่ตามวิชาและหัวข้อ
                    </p>
                </div>

                {/* Search */}
                <div className="learning-search">
                    <Search size={18} className="learning-search-icon" />
                    <input
                        type="text"
                        placeholder="ค้นหาเนื้อหา สูตร บันทึก..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="learning-search-input"
                    />
                </div>

                <div className="learning-layout">
                    {/* Sidebar Filters */}
                    <aside className="learning-sidebar">
                        <div className="learning-filter-group">
                            <h3 className="learning-filter-title">
                                <Filter size={16} /> วิชา
                            </h3>
                            <button
                                className={`learning-filter-btn ${!activeSubject ? 'active' : ''}`}
                                onClick={() => setActiveSubject('')}
                            >
                                ทั้งหมด ({learningData.length})
                            </button>
                            {learningSubjects.map(s => {
                                const count = learningData.filter(l => l.subject === s).length;
                                return (
                                    <button
                                        key={s}
                                        className={`learning-filter-btn ${activeSubject === s ? 'active' : ''}`}
                                        onClick={() => setActiveSubject(s)}
                                    >
                                        {s} ({count})
                                    </button>
                                );
                            })}
                        </div>

                        <div className="learning-filter-group">
                            <h3 className="learning-filter-title">ประเภท</h3>
                            <button
                                className={`learning-filter-btn ${!activeType ? 'active' : ''}`}
                                onClick={() => setActiveType('')}
                            >
                                ทั้งหมด
                            </button>
                            {learningTypes.map(t => (
                                <button
                                    key={t}
                                    className={`learning-filter-btn ${activeType === t ? 'active' : ''}`}
                                    onClick={() => setActiveType(t)}
                                >
                                    {typeIcons[t]} {t}
                                </button>
                            ))}
                        </div>
                    </aside>

                    {/* Content */}
                    <div className="learning-content">
                        <div className="learning-results-info">
                            <span>พบ {filtered.length} รายการ</span>
                        </div>

                        {filtered.length === 0 ? (
                            <div className="learning-empty">
                                <div className="learning-empty-icon">📚</div>
                                <h3>ไม่พบเนื้อหา</h3>
                                <p>ลองใช้คำค้นอื่น หรือเปลี่ยนตัวกรอง</p>
                            </div>
                        ) : (
                            Object.entries(groupedByTopic).map(([topic, items]) => (
                                <div key={topic} className="learning-topic-group">
                                    <h3 className="learning-topic-title">{topic}</h3>
                                    <div className="learning-cards">
                                        {items.map(item => (
                                            <Link
                                                key={item.id}
                                                to={`/learning/${item.id}`}
                                                className="learning-card card"
                                            >
                                                <div className="learning-card-header">
                                                    <span
                                                        className="learning-type-badge"
                                                        style={{
                                                            background: typeColors[item.type]?.bg,
                                                            color: typeColors[item.type]?.color
                                                        }}
                                                    >
                                                        {typeIcons[item.type]} {item.type}
                                                    </span>
                                                    <span className="learning-card-subject">{item.subject}</span>
                                                </div>
                                                <h4 className="learning-card-title">{item.title}</h4>
                                                <div className="learning-card-tags">
                                                    {item.tags.slice(0, 3).map(tag => (
                                                        <span key={tag} className="learning-card-tag">#{tag}</span>
                                                    ))}
                                                </div>
                                                <p className="learning-card-preview">
                                                    {item.content.replace(/[#*`\n|]/g, ' ').substring(0, 100)}...
                                                </p>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
