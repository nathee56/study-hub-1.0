import { useState } from 'react';
import { MessageSquare, ThumbsUp, Send, Search, Tag } from 'lucide-react';
import './Community.css';

// Simulated community posts
const INITIAL_POSTS = [
    {
        id: 'cp1',
        author: 'นักเรียน A',
        type: 'prompt',
        title: 'Prompt สรุปบทเรียน 5 นาที',
        content: 'สรุปบทเรียน [วิชา] หัวข้อ [หัวข้อ] ให้อ่านจบภายใน 5 นาที เน้นประเด็นสำคัญ ใช้ภาษาเข้าใจง่าย',
        tags: ['สรุป', 'ประหยัดเวลา'],
        likes: 12,
        date: '2026-02-14'
    },
    {
        id: 'cp2',
        author: 'นักศึกษา B',
        type: 'note',
        title: 'เทคนิคจำศัพท์ภาษาอังกฤษ 100 คำใน 1 สัปดาห์',
        content: 'ใช้วิธี Spaced Repetition: วันที่ 1 เรียน 20 คำ, วันที่ 2 ทบทวน + เพิ่ม 15 คำ, วันที่ 3 ทบทวนทั้งหมด + เพิ่ม 15 คำ...',
        tags: ['เทคนิค', 'ภาษาอังกฤษ', 'จำศัพท์'],
        likes: 24,
        date: '2026-02-13'
    },
    {
        id: 'cp3',
        author: 'ครูสมชาย',
        type: 'prompt',
        title: 'Prompt ตรวจการบ้านอัตโนมัติ',
        content: 'ตรวจคำตอบต่อไปนี้: [คำตอบ] สำหรับโจทย์: [โจทย์] ให้คะแนน 0-10 พร้อมบอกจุดที่ต้องแก้ไข',
        tags: ['ตรวจงาน', 'คณิตศาสตร์', 'ครู'],
        likes: 8,
        date: '2026-02-12'
    },
    {
        id: 'cp4',
        author: 'นักเรียน C',
        type: 'note',
        title: 'สรุปสูตรฟิสิกส์ ม.ปลาย ที่ออกสอบบ่อย',
        content: 'F=ma, v=u+at, s=ut+½at², v²=u²+2as, W=Fs, P=W/t, KE=½mv², PE=mgh',
        tags: ['ฟิสิกส์', 'สูตร', 'เตรียมสอบ'],
        likes: 31,
        date: '2026-02-11'
    }
];

export default function Community() {
    const [posts, setPosts] = useState(() => {
        try {
            const stored = localStorage.getItem('slh-community');
            return stored ? JSON.parse(stored) : INITIAL_POSTS;
        } catch { return INITIAL_POSTS; }
    });

    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [newPost, setNewPost] = useState({ title: '', content: '', type: 'prompt', tags: '' });

    const savePosts = (updated) => {
        setPosts(updated);
        localStorage.setItem('slh-community', JSON.stringify(updated));
    };

    const handleLike = (id) => {
        savePosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newPost.title.trim() || !newPost.content.trim()) return;
        const post = {
            id: Date.now().toString(),
            author: 'คุณ',
            type: newPost.type,
            title: newPost.title.trim(),
            content: newPost.content.trim(),
            tags: newPost.tags.split(',').map(t => t.trim()).filter(Boolean),
            likes: 0,
            date: new Date().toISOString().split('T')[0]
        };
        savePosts([post, ...posts]);
        setNewPost({ title: '', content: '', type: 'prompt', tags: '' });
        setShowForm(false);
    };

    const filtered = posts.filter(p => {
        const q = search.toLowerCase();
        return !q || p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q) ||
            p.tags.some(t => t.toLowerCase().includes(q));
    });

    return (
        <div className="community-page section">
            <div className="container">
                <div className="community-header">
                    <div>
                        <h1 className="page-title">ชุมชนนักเรียน</h1>
                        <p className="page-subtitle">แชร์ Prompt บันทึก และเทคนิคการเรียน กับเพื่อนๆ</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                        <Send size={16} /> {showForm ? 'ยกเลิก' : 'โพสต์ใหม่'}
                    </button>
                </div>

                {/* New Post Form */}
                {showForm && (
                    <form className="community-form card" onSubmit={handleSubmit}>
                        <div className="community-form-row">
                            <select value={newPost.type} onChange={e => setNewPost({ ...newPost, type: e.target.value })} className="community-select">
                                <option value="prompt">📝 Prompt</option>
                                <option value="note">📌 บันทึก</option>
                            </select>
                            <input
                                type="text" placeholder="หัวข้อ..."
                                value={newPost.title} onChange={e => setNewPost({ ...newPost, title: e.target.value })}
                                className="community-input" required
                            />
                        </div>
                        <textarea
                            placeholder="เนื้อหา..."
                            value={newPost.content} onChange={e => setNewPost({ ...newPost, content: e.target.value })}
                            className="community-textarea" rows={3} required
                        />
                        <div className="community-form-row">
                            <input
                                type="text" placeholder="แท็ก (คั่นด้วยคอมม่า)"
                                value={newPost.tags} onChange={e => setNewPost({ ...newPost, tags: e.target.value })}
                                className="community-input"
                            />
                            <button type="submit" className="btn btn-primary">โพสต์</button>
                        </div>
                    </form>
                )}

                {/* Search */}
                <div className="community-search">
                    <Search size={16} />
                    <input type="text" placeholder="ค้นหาโพสต์..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>

                {/* Posts */}
                <div className="community-posts">
                    {filtered.length === 0 ? (
                        <div className="community-empty">
                            <MessageSquare size={40} />
                            <h3>ไม่พบโพสต์</h3>
                            <p>ลองค้นหาด้วยคำอื่น หรือเป็นคนแรกที่โพสต์!</p>
                        </div>
                    ) : (
                        filtered.map(post => (
                            <div key={post.id} className="community-post card">
                                <div className="community-post-header">
                                    <div className="community-post-avatar">{post.author.charAt(0)}</div>
                                    <div>
                                        <span className="community-post-author">{post.author}</span>
                                        <span className="community-post-date">{post.date}</span>
                                    </div>
                                    <span className={`community-post-type community-post-type--${post.type}`}>
                                        {post.type === 'prompt' ? '📝 Prompt' : '📌 บันทึก'}
                                    </span>
                                </div>

                                <h3 className="community-post-title">{post.title}</h3>
                                <p className="community-post-content">{post.content}</p>

                                {post.tags.length > 0 && (
                                    <div className="community-post-tags">
                                        {post.tags.map(tag => (
                                            <span key={tag} className="community-tag"><Tag size={10} /> {tag}</span>
                                        ))}
                                    </div>
                                )}

                                <div className="community-post-actions">
                                    <button className="community-like-btn" onClick={() => handleLike(post.id)}>
                                        <ThumbsUp size={14} /> {post.likes}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
