import { Link } from 'react-router-dom';
import { Copy, Bookmark, BookmarkCheck, Sparkles } from 'lucide-react';
import { useBookmarks } from '../context/BookmarkContext';
import { useState } from 'react';
import './PromptCard.css';

export default function PromptCard({ prompt }) {
    const { toggleBookmark, isBookmarked } = useBookmarks();
    const [copied, setCopied] = useState(false);
    const bookmarked = isBookmarked(prompt.id);

    const subjectClass = {
        'คณิตศาสตร์': 'badge-math',
        'วิทยาศาสตร์': 'badge-science',
        'ภาษาอังกฤษ': 'badge-english',
        'ประวัติศาสตร์': 'badge-history',
        'วิทยาการคอมพิวเตอร์': 'badge-cs',
        'ทั่วไป': 'badge-primary',
    }[prompt.subject] || 'badge-primary';

    const handleCopy = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(prompt.content).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleBookmark = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleBookmark(prompt.id);
    };

    return (
        <Link to={`/prompts/${prompt.id}`} className="prompt-card card" id={`prompt-${prompt.id}`}>
            <div className="prompt-card-header">
                <div className="prompt-card-badges">
                    <span className={`badge ${subjectClass}`}>{prompt.subject}</span>
                    <span className="badge badge-primary">{prompt.level}</span>
                </div>
                {prompt.isTemplate && (
                    <span className="prompt-template-badge">
                        <Sparkles size={12} /> เทมเพลต
                    </span>
                )}
            </div>

            <h3 className="prompt-card-title">{prompt.title}</h3>
            <p className="prompt-card-desc">{prompt.description}</p>

            <div className="prompt-card-tags">
                {prompt.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="prompt-tag">#{tag}</span>
                ))}
                {prompt.tags.length > 3 && (
                    <span className="prompt-tag prompt-tag-more">+{prompt.tags.length - 3}</span>
                )}
            </div>

            <div className="prompt-card-actions">
                <button
                    className={`prompt-action-btn ${copied ? 'prompt-action-btn--copied' : ''}`}
                    onClick={handleCopy}
                    aria-label="คัดลอก Prompt"
                >
                    <Copy size={16} />
                    <span>{copied ? 'คัดลอกแล้ว!' : 'คัดลอก'}</span>
                </button>
                <button
                    className={`prompt-action-btn ${bookmarked ? 'prompt-action-btn--active' : ''}`}
                    onClick={handleBookmark}
                    aria-label={bookmarked ? 'ลบบุ๊คมาร์ค' : 'บุ๊คมาร์ค'}
                >
                    {bookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                </button>
            </div>
        </Link>
    );
}
