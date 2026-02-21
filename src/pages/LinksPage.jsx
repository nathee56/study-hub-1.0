import { useState } from 'react';
import { ExternalLink, Search, Globe, Copy, CheckCircle2 } from 'lucide-react';
import { educationLinks } from '../data/resources';
import './LinksPage.css';

const categories = ['ทั้งหมด', ...new Set(educationLinks.map(l => l.category))];

export default function LinksPage() {
    const [activeCategory, setActiveCategory] = useState('ทั้งหมด');
    const [searchTerm, setSearchTerm] = useState('');
    const [copiedId, setCopiedId] = useState(null);

    const filteredLinks = educationLinks.filter(link => {
        const matchCategory = activeCategory === 'ทั้งหมด' || link.category === activeCategory;
        const matchSearch = link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            link.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchCategory && matchSearch;
    });

    const handleCopy = (e, url, id) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="links-page section">
            <div className="container">
                {/* Header */}
                <div className="links-header">
                    <div className="links-header-icon">
                        <Globe size={32} />
                    </div>
                    <h1 className="page-title text-2xl">แอปสโตร์การศึกษา</h1>
                    <p className="page-subtitle">
                        รวมเว็บไซต์ แพลตฟอร์ม และเครื่องมือ AI ที่คัดสรรมาเพื่อการเรียนรู้
                    </p>
                </div>

                {/* Search */}
                <div className="links-search-wrapper">
                    <Search size={18} className="links-search-icon" />
                    <input
                        type="text"
                        className="links-search-input"
                        placeholder="พิมพ์เพื่อค้นหาแอปหรือเว็บไซต์..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Categories */}
                <div className="links-categories">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`links-category-btn ${activeCategory === cat ? 'links-category-btn--active' : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Bento Grid */}
                <div className="bento-links-grid">
                    {filteredLinks.map((link, index) => {
                        // Make every 1st item of a row (or specific items) span 2 columns if space allows
                        const isLarge = index % 5 === 0;
                        // Mocking "Hot" badge randomly for visual effect (In real app, add a property to data)
                        const isHot = index % 4 === 1;

                        return (
                            <a
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`bento-link-card card ${isLarge ? 'bento-span-2' : ''}`}
                            >
                                {isHot && <span className="bento-hot-badge">ยอดฮิต 🔥</span>}

                                <div className="bento-card-top">
                                    <div className="bento-icon-wrapper">{link.icon}</div>
                                    <button
                                        className="bento-copy-btn"
                                        onClick={(e) => handleCopy(e, link.url, link.id)}
                                        title="คัดลอกลิงก์"
                                    >
                                        {copiedId === link.id ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} />}
                                    </button>
                                </div>

                                <div className="bento-card-content">
                                    <h3 className="bento-title">{link.title}</h3>
                                    <p className="bento-desc">{link.description}</p>
                                </div>

                                <div className="bento-card-footer">
                                    <span className="bento-category">{link.category}</span>
                                    <div className="bento-open-action">
                                        <span>เปิดแอป</span>
                                        <ExternalLink size={14} className="bento-external-icon" />
                                    </div>
                                </div>
                            </a>
                        );
                    })}
                </div>

                {filteredLinks.length === 0 && (
                    <div className="links-empty">
                        <Search size={48} />
                        <p>ไม่พบแอพที่ตรงกับการค้นหา</p>
                    </div>
                )}

                {/* Stats */}
                <div className="links-stats mt-8">
                    <span>แสดง {filteredLinks.length} จาก {educationLinks.length} แอปพลิเคชัน</span>
                </div>
            </div>
        </div>
    );
}
