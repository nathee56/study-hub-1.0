import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Copy, Bookmark, BookmarkCheck, ArrowLeft, Sparkles, Tag, Calendar, Share2, ExternalLink } from 'lucide-react';
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

    const handleTryInAI = (aiPlatform) => {
        // Copy first
        navigator.clipboard.writeText(getProcessedContent());

        // Then open the platform in a new tab
        const urls = {
            chatgpt: 'https://chat.openai.com/',
            claude: 'https://claude.ai/',
            gemini: 'https://gemini.google.com/'
        };
        window.open(urls[aiPlatform], '_blank');
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

                            {/* Template Placeholders (Floating Labels) */}
                            {prompt.isTemplate && prompt.placeholders && prompt.placeholders.length > 0 && (
                                <div className="prompt-template-section">
                                    <div className="prompt-template-header">
                                        <div className="prompt-template-icon-wrapper">
                                            <Sparkles size={18} />
                                        </div>
                                        <div>
                                            <h3 className="prompt-template-title">ปรับแต่ง Prompt ของคุณ</h3>
                                            <p className="prompt-template-hint">
                                                กรอกข้อมูลในช่องว่างด้านล่าง เนื้อหา Prompt จะอัปเดตอัตโนมัติ
                                            </p>
                                        </div>
                                    </div>
                                    <div className="prompt-template-fields">
                                        {prompt.placeholders.map(ph => (
                                            <div key={ph} className="floating-input-group">
                                                <input
                                                    id={`ph-${ph}`}
                                                    type="text"
                                                    placeholder=" "
                                                    value={placeholderValues[ph] || ''}
                                                    onChange={(e) => setPlaceholderValues(prev => ({ ...prev, [ph]: e.target.value }))}
                                                    className="floating-input"
                                                />
                                                <label htmlFor={`ph-${ph}`} className="floating-label">
                                                    ระบุ {ph.replace(/_/g, ' ')}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Prompt Content */}
                            <div className="prompt-content-section">
                                <div className="prompt-content-header">
                                    <h3>เนื้อหา Prompt ที่จะได้</h3>
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

                            {/* Try in AI Section */}
                            <div className="prompt-try-ai-section">
                                <h3>ลองใช้กับ AI เลนตอนนี้ <span className="text-muted">(คัดลอก + เปิดเว็บใหม่)</span></h3>
                                <div className="ai-buttons-grid">
                                    <button className="ai-btn ai-chatgpt" onClick={() => handleTryInAI('chatgpt')}>
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.073zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.8956zm16.0993 3.8558L12.5973 8.3829a.0757.0757 0 0 1-.0379-.052V2.7483a4.4992 4.4992 0 0 1 6.1645 1.637 4.4708 4.4708 0 0 1 .5346 3.0137l-.142-.0852-4.783-2.7582a.7712.7712 0 0 0-.7806 0l-5.8428 3.3685v-2.3324a.0804.0804 0 0 1 .0332-.0615L14.26 2.0498a4.4992 4.4992 0 0 1 6.1408 1.6464zM19.6592 16.1044V12.4a.7664.7664 0 0 0-.3879-.6765L13.4569 8.3692l2.0201-1.1685a.0757.0757 0 0 1 .071 0l4.8303 2.7865a4.504 4.504 0 0 1-2.3655 8.917z" /></svg>
                                        ChatGPT
                                        <ExternalLink size={14} />
                                    </button>
                                    <button className="ai-btn ai-claude" onClick={() => handleTryInAI('claude')}>
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12.013 24c-1.63 0-3.352-.303-4.887-.85-2.261-.806-4.04-1.93-5.342-3.376-1.558-1.731-2.072-3.558-2.072-4.492v-.058L1.625 15l2.483-1.696.068.043c.125.078 1.258.745 3.098 1.401 2.028.723 4.298 1.054 6.74 1.054 5.378 0 8.019-1.928 8.019-5.857 0-2.458-1.077-4.144-3.264-5.111C16.657 3.901 13.916 3.4 12 3.4c-1.396 0-3.32.185-4.856.467-1.139.21-2.359.508-2.618.572l-.08.02-.924-2.812.083-.02c.006-.001 2.502-.638 6.463-.638C17.702.989 24 3.327 24 9.946c0 6.643-5.228 14.054-11.987 14.054ZM2.895 10.978c-.01.002-.516.113-1.272.28L.156 8.5c1.458-.335 2.152-.485 2.164-.488l.081-.018.574 2.964-.08.02Zm-.497-3.929c-.012.003-.509.117-1.298.3l-.681-2.943c.531-.122 1.488-.336 2.227-.492l.082-.017.585 2.962-.083.018Zm1.255-3.665c-.012.003-.496.126-1.28.329l-1.03-2.834c.758-.2 1.579-.395 2.378-.567l.081-.018.736 2.926-.08.018Z" /></svg>
                                        Claude
                                        <ExternalLink size={14} />
                                    </button>
                                    <button className="ai-btn ai-gemini" onClick={() => handleTryInAI('gemini')}>
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M11.666 0c0 5.467-3.931 9.932-9.398 9.932A20.358 20.358 0 0 0 0 9.972v4.055a20.347 20.347 0 0 0 2.268.041c5.467 0 9.398 4.464 9.398 9.932v.001h4.055v-.001c0-5.468 3.931-9.932 9.398-9.932a20.26 20.26 0 0 0 2.269-.041V9.971a20.44 20.44 0 0 0-2.269.041c-5.467 0-9.398-4.465-9.398-9.932H11.666Zm3.176 4.793a10.89 10.89 0 0 0 4.316 4.316 10.844 10.844 0 0 0-4.316 4.316 10.864 10.864 0 0 0-4.316-4.316 10.88 10.88 0 0 0 4.316-4.316Z" /></svg>
                                        Gemini
                                        <ExternalLink size={14} />
                                    </button>
                                </div>
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
