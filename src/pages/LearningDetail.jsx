import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Calculator, StickyNote, Bookmark, BookmarkCheck, Tag, Calendar, List } from 'lucide-react';
import { useBookmarks } from '../context/BookmarkContext';
import learningData from '../data/learningData';
import './LearningDetail.css';

const typeIcons = {
    'สรุป': <BookOpen size={16} />,
    'สูตร': <Calculator size={16} />,
    'บันทึก': <StickyNote size={16} />,
};

function generateId(text) {
    return text.toLowerCase().replace(/[^a-z0-9ก-๙]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

export default function LearningDetail() {
    const { id } = useParams();
    const item = learningData.find(l => l.id === id);
    const { toggleBookmark, isBookmarked } = useBookmarks();

    const [toc, setToc] = useState([]);
    const [activeId, setActiveId] = useState('');
    const [readingProgress, setReadingProgress] = useState(0);
    const contentRef = useRef(null);

    // Parse markdown and extract TOC
    const renderContent = useCallback((text) => {
        let extractedToc = [];

        let html = text
            .replace(/^### (.+)$/gm, (match, title) => {
                const id = generateId(title);
                extractedToc.push({ id, title, level: 3 });
                return `<h3 id="${id}" class="toc-heading">${title}</h3>`;
            })
            .replace(/^## (.+)$/gm, (match, title) => {
                const id = generateId(title);
                extractedToc.push({ id, title, level: 2 });
                return `<h2 id="${id}" class="toc-heading">${title}</h2>`;
            })
            .replace(/^# (.+)$/gm, '<h1>$1</h1>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/^- (.+)$/gm, '<li>$1</li>')
            .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
            .replace(/^---$/gm, '<hr/>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br/>');

        html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
        html = html.replace(/\|(.+)\|/g, (match) => {
            if (match.includes('---')) return '';
            const cells = match.split('|').filter(c => c.trim());
            const row = cells.map(c => `<td>${c.trim()}</td>`).join('');
            return `<tr>${row}</tr>`;
        });

        requestAnimationFrame(() => setToc(extractedToc));
        return `<p>${html}</p>`;
    }, []);

    // Scroll tracking
    useEffect(() => {
        const handleScroll = () => {
            // Calculate progress
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            setReadingProgress(Math.min(100, Math.max(0, progress)));

            // Highlight active TOC item
            const headings = Array.from(document.querySelectorAll('.toc-heading'));
            const scrollPosition = window.scrollY + 100; // Offset for fixed header/nav

            let currentActiveId = '';
            for (let i = headings.length - 1; i >= 0; i--) {
                const heading = headings[i];
                if (heading.offsetTop <= scrollPosition) {
                    currentActiveId = heading.id;
                    break;
                }
            }
            if (currentActiveId !== activeId) {
                setActiveId(currentActiveId);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Init
        return () => window.removeEventListener('scroll', handleScroll);
    }, [activeId]);

    const scrollToHeading = (e, id) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const offset = 80;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

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
            {/* Reading Progress Bar */}
            <div className="reading-progress-container">
                <div className="reading-progress-bar" style={{ width: `${readingProgress}%` }}></div>
            </div>

            <div className="container relative-container">
                <Link to="/learning" className="learning-back-link">
                    <ArrowLeft size={16} /> กลับไปคลังความรู้
                </Link>

                <div className="learning-detail-layout">
                    {/* Main Document */}
                    <article className="learning-detail-main card" ref={contentRef}>
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
                            dangerouslySetInnerHTML={{ __html: renderContent(item.content) }}
                        />
                    </article>

                    {/* Sidebars */}
                    <div className="learning-sidebar-wrapper">
                        {/* Table of Contents */}
                        {toc.length > 0 && (
                            <aside className="learning-toc card">
                                <h3 className="sidebar-title toc-header">
                                    <List size={16} /> สารบัญ
                                </h3>
                                <ul className="toc-list">
                                    {toc.map(heading => (
                                        <li key={heading.id} className={`toc-item toc-level-${heading.level}`}>
                                            <a
                                                href={`#${heading.id}`}
                                                className={`toc-link ${activeId === heading.id ? 'active' : ''}`}
                                                onClick={(e) => scrollToHeading(e, heading.id)}
                                            >
                                                {heading.title}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </aside>
                        )}

                        {/* Related Content */}
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
        </div>
    );
}
