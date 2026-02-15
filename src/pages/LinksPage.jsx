import { useState } from 'react';
import { ExternalLink, Search, Globe } from 'lucide-react';
import { educationLinks } from '../data/resources';
import './LinksPage.css';

const categories = ['ทั้งหมด', ...new Set(educationLinks.map(l => l.category))];

export default function LinksPage() {
    const [activeCategory, setActiveCategory] = useState('ทั้งหมด');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredLinks = educationLinks.filter(link => {
        const matchCategory = activeCategory === 'ทั้งหมด' || link.category === activeCategory;
        const matchSearch = link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            link.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchCategory && matchSearch;
    });

    return (
        <div className="links-page section">
            <div className="container">
                {/* Header */}
                <div className="links-header">
                    <div className="links-header-icon">
                        <Globe size={28} />
                    </div>
                    <h1 className="section-title">ลิงก์การศึกษา</h1>
                    <p className="section-subtitle">
                        รวมเว็บไซต์การเรียนรู้ แพลตฟอร์มออนไลน์ เครื่องมือ AI และแหล่งอ้างอิงวิชาการที่คัดสรรแล้ว
                    </p>
                </div>

                {/* Search */}
                <div className="links-search-wrapper">
                    <Search size={18} className="links-search-icon" />
                    <input
                        type="text"
                        className="links-search-input"
                        placeholder="ค้นหาลิงก์..."
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

                {/* Links Grid */}
                <div className="links-grid">
                    {filteredLinks.map(link => (
                        <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link-card card"
                        >
                            <div className="link-card-icon">{link.icon}</div>
                            <div className="link-card-content">
                                <div className="link-card-header">
                                    <h3 className="link-card-title">{link.title}</h3>
                                    <ExternalLink size={14} className="link-card-external" />
                                </div>
                                <p className="link-card-desc">{link.description}</p>
                                <span className="link-card-category">{link.category}</span>
                            </div>
                        </a>
                    ))}
                </div>

                {filteredLinks.length === 0 && (
                    <div className="links-empty">
                        <Search size={48} />
                        <p>ไม่พบลิงก์ที่ตรงกับการค้นหา</p>
                    </div>
                )}

                {/* Stats */}
                <div className="links-stats">
                    <span>แสดง {filteredLinks.length} จาก {educationLinks.length} ลิงก์</span>
                </div>
            </div>
        </div>
    );
}
