import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Search, Trash2, ArrowUpDown } from 'lucide-react';
import { useBookmarks } from '../context/BookmarkContext';
import PromptCard from '../components/PromptCard';
import prompts from '../data/prompts';
import learningData from '../data/learningData';
import './Bookmarks.css';

export default function Bookmarks() {
    const { bookmarks, removeBookmark } = useBookmarks();
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('date');

    const bookmarkedPrompts = prompts.filter(p => bookmarks.includes(p.id));
    const bookmarkedLearning = learningData.filter(l => bookmarks.includes(l.id));

    const allBookmarked = useMemo(() => {
        const items = [
            ...bookmarkedPrompts.map(p => ({ ...p, _type: 'prompt' })),
            ...bookmarkedLearning.map(l => ({ ...l, _type: 'learning' }))
        ];

        // Filter
        const q = search.toLowerCase();
        const filtered = q ? items.filter(i =>
            i.title.toLowerCase().includes(q) ||
            (i.subject || '').toLowerCase().includes(q) ||
            (i.tags || []).some(t => t.toLowerCase().includes(q))
        ) : items;

        // Sort
        if (sortBy === 'title') {
            filtered.sort((a, b) => a.title.localeCompare(b.title, 'th'));
        } else if (sortBy === 'subject') {
            filtered.sort((a, b) => (a.subject || '').localeCompare(b.subject || '', 'th'));
        }

        return filtered;
    }, [bookmarkedPrompts, bookmarkedLearning, search, sortBy]);

    const clearAll = () => {
        if (confirm('ลบบุ๊คมาร์คทั้งหมด?')) {
            bookmarks.forEach(id => removeBookmark(id));
        }
    };

    return (
        <div className="bookmarks-page section">
            <div className="container">
                <h1 className="page-title">บุ๊คมาร์คของฉัน</h1>
                <p className="page-subtitle">
                    {allBookmarked.length > 0
                        ? `คุณมี ${allBookmarked.length} รายการที่บันทึกไว้`
                        : 'บันทึก Prompt หรือเนื้อหาเพื่อเข้าถึงอย่างรวดเร็ว'}
                </p>

                {bookmarks.length > 0 && (
                    <div className="bookmarks-toolbar">
                        <div className="bookmarks-search">
                            <Search size={14} />
                            <input
                                type="text"
                                placeholder="ค้นหาในบุ๊คมาร์ค..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="bookmarks-actions">
                            <select
                                className="bookmarks-sort"
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value)}
                            >
                                <option value="date">เรียงตามวันที่เพิ่ม</option>
                                <option value="title">เรียงตามชื่อ</option>
                                <option value="subject">เรียงตามวิชา</option>
                            </select>
                            <button className="btn btn-secondary btn-sm" onClick={clearAll}>
                                <Trash2 size={14} /> ลบทั้งหมด
                            </button>
                        </div>
                    </div>
                )}

                {allBookmarked.length > 0 ? (
                    <div className="bookmarks-grid">
                        {allBookmarked.map(item =>
                            item._type === 'prompt' ? (
                                <PromptCard key={item.id} prompt={item} />
                            ) : (
                                <Link key={item.id} to={`/learning/${item.id}`} className="bookmark-learning-card card">
                                    <span className="bookmark-type-label">📖 เนื้อหา</span>
                                    <h4>{item.title}</h4>
                                    <span className="bookmark-subject">{item.subject} • {item.topic}</span>
                                </Link>
                            )
                        )}
                    </div>
                ) : (
                    <div className="bookmarks-empty">
                        <div className="bookmarks-empty-icon">
                            <Bookmark size={48} />
                        </div>
                        <h3>ยังไม่มีบุ๊คมาร์ค</h3>
                        <p>เรียกดูคลัง Prompt หรือคลังความรู้ แล้วบุ๊คมาร์ครายการโปรดของคุณ</p>
                        <div className="bookmarks-empty-links">
                            <Link to="/prompts" className="btn btn-primary">เรียกดู Prompt</Link>
                            <Link to="/learning" className="btn btn-secondary">เรียกดูคลังความรู้</Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
