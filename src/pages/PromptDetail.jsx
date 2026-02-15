import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Copy, Bookmark, BookmarkCheck, ArrowLeft, Sparkles, Tag, Calendar, Share2 } from 'lucide-react';
import { useBookmarks } from '../context/BookmarkContext';
import PromptCard from '../components/PromptCard';
import ShareModal from '../components/ShareModal';
import prompts from '../data/prompts';
import './PromptDetail.css';

export default function PromptDetail() {
    const { id } = useParams();
    const prompt = prompts.find(p => p.id === id);
    const { toggleBookmark, isBookmarked } = useBookmarks();
    const [copied, setCopied] = useState(false);
    const [placeholderValues, setPlaceholderValues] = useState({});
    const [showShare, setShowShare] = useState(false);

    if (!prompt) {
        return (
            <div className="container section">
                <div className="prompt-not-found">
                    <h2>ไม่พบ Prompt</h2>
                    <p>Prompt ที่คุณกำลังมองหาไม่มีอยู่</p>
                    <Link to="/prompts" className="btn btn-primary">
                        <ArrowLeft size={16} /> กลับไปคลัง Prompt
                    </Link>
                </div>
            </div>
        );
    }

    const bookmarked = isBookmarked(prompt.id);

    const getProcessedContent = () => {
        let content = prompt.content;
        if (prompt.isTemplate && prompt.placeholders) {
            prompt.placeholders.forEach(ph => {
                const val = placeholderValues[ph];
                if (val) {
                    content = content.replaceAll(`[${ph}]`, val);
                }
            });
        }
        return content;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(getProcessedContent()).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        });
    };

    const relatedPrompts = prompts
        .filter(p => p.id !== prompt.id && (p.subject === prompt.subject || p.tags.some(t => prompt.tags.includes(t))))
        .slice(0, 3);

    const badgeClass = {
        'คณิตศาสตร์': 'badge-math',
        'วิทยาศาสตร์': 'badge-science',
        'ภาษาอังกฤษ': 'badge-english',
        'ประวัติศาสตร์': 'badge-history',
        'วิทยาการคอมพิวเตอร์': 'badge-cs',
        'ทั่วไป': 'badge-primary',
    }[prompt.subject] || 'badge-primary';

    return (
        <div className="prompt-detail-page section">
            <div className="container">
                <Link to="/prompts" className="prompt-back-link">
                    <ArrowLeft size={16} /> กลับไปคลัง Prompt
                </Link>

                <div className="prompt-detail-layout">
                    {/* Main Content */}
                    <div className="prompt-detail-main">
                        <div className="prompt-detail-card card">
                            <div className="prompt-detail-header">
                                <div className="prompt-detail-badges">
                                    <span className={`badge ${badgeClass}`}>{prompt.subject}</span>
                                    <span className="badge badge-primary">{prompt.level}</span>
                                    {prompt.isTemplate && (
                                        <span className="prompt-template-badge">
                                            <Sparkles size={12} /> เทมเพลต
                                        </span>
                                    )}
                                </div>

                                <div className="prompt-detail-actions-top">
                                    <button className="btn btn-secondary" onClick={() => setShowShare(true)}>
                                        <Share2 size={16} /> แชร์
                                    </button>
                                    <button
                                        className={`btn ${bookmarked ? 'btn-primary' : 'btn-secondary'}`}
                                        onClick={() => toggleBookmark(prompt.id)}
                                    >
                                        {bookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                                        {bookmarked ? 'บุ๊คมาร์คแล้ว' : 'บุ๊คมาร์ค'}
                                    </button>
                                </div>
                            </div>

                            <h1 className="prompt-detail-title">{prompt.title}</h1>
                            <p className="prompt-detail-desc">{prompt.description}</p>

                            <div className="prompt-detail-meta">
                                <span className="prompt-meta-item">
                                    <Calendar size={14} /> {prompt.createdDate}
                                </span>
                                <span className="prompt-meta-item">
                                    <Tag size={14} /> {prompt.tags.join(', ')}
                                </span>
                            </div>

                            {/* Template Placeholders */}
                            {prompt.isTemplate && prompt.placeholders && prompt.placeholders.length > 0 && (
                                <div className="prompt-template-section">
                                    <h3 className="prompt-template-title">
                                        <Sparkles size={16} /> กรอกข้อมูลในเทมเพลต
                                    </h3>
                                    <p className="prompt-template-hint">
                                        กรอกข้อมูลด้านล่างเพื่อปรับแต่ง Prompt แล้วคัดลอกไปใช้งาน
                                    </p>
                                    <div className="prompt-template-fields">
                                        {prompt.placeholders.map(ph => (
                                            <div key={ph} className="prompt-template-field">
                                                <label htmlFor={`ph-${ph}`}>{ph.replace(/_/g, ' ')}</label>
                                                <input
                                                    id={`ph-${ph}`}
                                                    type="text"
                                                    placeholder={`กรอก${ph.replace(/_/g, ' ')}...`}
                                                    value={placeholderValues[ph] || ''}
                                                    onChange={(e) => setPlaceholderValues(prev => ({ ...prev, [ph]: e.target.value }))}
                                                    className="prompt-template-input"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Prompt Content */}
                            <div className="prompt-content-section">
                                <div className="prompt-content-header">
                                    <h3>เนื้อหา Prompt</h3>
                                    <button
                                        className={`btn ${copied ? 'btn-copied' : 'btn-primary'}`}
                                        onClick={handleCopy}
                                        id="copy-prompt-btn"
                                    >
                                        <Copy size={16} />
                                        {copied ? 'คัดลอกแล้ว!' : 'คัดลอก Prompt'}
                                    </button>
                                </div>
                                <pre className="prompt-content-box">{getProcessedContent()}</pre>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar (Related) */}
                    {relatedPrompts.length > 0 && (
                        <div className="prompt-detail-sidebar">
                            <h3 className="sidebar-title">Prompt ที่เกี่ยวข้อง</h3>
                            <div className="sidebar-prompts">
                                {relatedPrompts.map(p => (
                                    <PromptCard key={p.id} prompt={p} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ShareModal
                isOpen={showShare}
                onClose={() => setShowShare(false)}
                title={prompt.title}
                content={getProcessedContent()}
            />
        </div>
    );
}
