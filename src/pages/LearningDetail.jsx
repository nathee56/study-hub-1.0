import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Calculator, StickyNote, Bookmark, BookmarkCheck, Tag, Calendar } from 'lucide-react';
import { useBookmarks } from '../context/BookmarkContext';
import learningData from '../data/learningData';
import './LearningDetail.css';

const typeIcons = {
    'สรุป': <BookOpen size={16} />,
    'สูตร': <Calculator size={16} />,
    'บันทึก': <StickyNote size={16} />,
};

function renderMarkdown(text) {
    // Simple markdown to HTML
    let html = text
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
        .replace(/^---$/gm, '<hr/>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br/>');

    // Wrap code blocks
    html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, '<pre><code>$2</code></pre>');

    // Wrap tables
    html = html.replace(/\|(.+)\|/g, (match) => {
        if (match.includes('---')) return '';
        const cells = match.split('|').filter(c => c.trim());
        const row = cells.map(c => `<td>${c.trim()}</td>`).join('');
        return `<tr>${row}</tr>`;
    });

    return `<p>${html}</p>`;
}

export default function LearningDetail() {
    const { id } = useParams();
    const item = learningData.find(l => l.id === id);
    const { toggleBookmark, isBookmarked } = useBookmarks();

    if (!item) {
        return (
            <div className="container section">
                <div className="learning-not-found">
                    <h2>ไม่พบเนื้อหา</h2>
                    <p>เนื้อหาที่คุณกำลังมองหาไม่มีอยู่</p>
                    <Link to="/learning" className="btn btn-primary">
                        <ArrowLeft size={16} /> กลับไปคลังความรู้
                    </Link>
                </div>
            </div>
        );
    }

    const bookmarked = isBookmarked(item.id);
    const related = learningData
        .filter(l => l.id !== item.id && (l.subject === item.subject || l.topic === item.topic))
        .slice(0, 4);

    return (
        <div className="learning-detail-page section">
            <div className="container">
                <Link to="/learning" className="learning-back-link">
                    <ArrowLeft size={16} /> กลับไปคลังความรู้
                </Link>

                <div className="learning-detail-layout">
                    <article className="learning-detail-main card">
                        <div className="learning-detail-header">
                            <div className="learning-detail-badges">
                                <span className="badge badge-primary">{item.subject}</span>
                                <span className="learning-detail-type-badge">
                                    {typeIcons[item.type]} {item.type}
                                </span>
                            </div>
                            <button
                                className={`btn ${bookmarked ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => toggleBookmark(item.id)}
                            >
                                {bookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                                {bookmarked ? 'บุ๊คมาร์คแล้ว' : 'บุ๊คมาร์ค'}
                            </button>
                        </div>

                        <h1 className="learning-detail-title">{item.title}</h1>

                        <div className="learning-detail-meta">
                            <span className="learning-meta-item">
                                <Tag size={14} /> {item.tags.join(', ')}
                            </span>
                            <span className="learning-meta-item">
                                หัวข้อ: {item.topic}
                            </span>
                        </div>

                        <div
                            className="learning-detail-content"
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(item.content) }}
                        />
                    </article>

                    {related.length > 0 && (
                        <aside className="learning-detail-sidebar">
                            <h3 className="sidebar-title">เนื้อหาที่เกี่ยวข้อง</h3>
                            <div className="sidebar-items">
                                {related.map(r => (
                                    <Link key={r.id} to={`/learning/${r.id}`} className="sidebar-item card">
                                        <span className="sidebar-item-type">
                                            {typeIcons[r.type]} {r.type}
                                        </span>
                                        <h4 className="sidebar-item-title">{r.title}</h4>
                                        <span className="sidebar-item-subject">{r.subject}</span>
                                    </Link>
                                ))}
                            </div>
                        </aside>
                    )}
                </div>
            </div>
        </div>
    );
}
