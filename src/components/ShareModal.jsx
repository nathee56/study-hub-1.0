import { useState } from 'react';
import { X, Copy, Share2, Check, Link2, FileText } from 'lucide-react';
import './ShareModal.css';

export default function ShareModal({ isOpen, onClose, title, content, url }) {
    const [copied, setCopied] = useState('');

    if (!isOpen) return null;

    const shareUrl = url || window.location.href;
    const shareText = `${title}\n\n${content}`;

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied('link');
            setTimeout(() => setCopied(''), 2000);
        } catch { }
    };

    const copyText = async () => {
        try {
            await navigator.clipboard.writeText(shareText);
            setCopied('text');
            setTimeout(() => setCopied(''), 2000);
        } catch { }
    };

    const nativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title, text: content, url: shareUrl });
            } catch { }
        }
    };

    return (
        <div className="share-overlay" onClick={onClose}>
            <div className="share-modal card" onClick={e => e.stopPropagation()}>
                <div className="share-header">
                    <h3><Share2 size={18} /> แชร์</h3>
                    <button className="share-close" onClick={onClose}><X size={20} /></button>
                </div>

                <p className="share-title-preview">{title}</p>

                <div className="share-actions">
                    <button className="share-action-btn" onClick={copyLink}>
                        {copied === 'link' ? <Check size={18} className="share-success" /> : <Link2 size={18} />}
                        <span>{copied === 'link' ? 'คัดลอกแล้ว!' : 'คัดลอกลิงก์'}</span>
                    </button>

                    <button className="share-action-btn" onClick={copyText}>
                        {copied === 'text' ? <Check size={18} className="share-success" /> : <FileText size={18} />}
                        <span>{copied === 'text' ? 'คัดลอกแล้ว!' : 'คัดลอกข้อความ'}</span>
                    </button>

                    {navigator.share && (
                        <button className="share-action-btn" onClick={nativeShare}>
                            <Share2 size={18} />
                            <span>แชร์ผ่านแอปอื่น</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
