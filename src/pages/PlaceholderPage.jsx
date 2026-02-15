import { Link } from 'react-router-dom';
import { Construction, ArrowRight } from 'lucide-react';
import './Placeholder.css';

export default function PlaceholderPage({ title, description, icon: Icon = Construction, links = [] }) {
    return (
        <div className="placeholder-page section">
            <div className="container">
                <div className="placeholder-card card">
                    <div className="placeholder-icon">
                        <Icon size={48} />
                    </div>
                    <h1 className="placeholder-title">{title}</h1>
                    <p className="placeholder-desc">{description}</p>
                    <div className="placeholder-badge">
                        <Construction size={16} /> เร็วๆ นี้
                    </div>
                    {links.length > 0 && (
                        <div className="placeholder-links">
                            <p className="placeholder-links-label">ระหว่างนี้ สามารถดูได้ที่:</p>
                            {links.map(link => (
                                <Link key={link.to} to={link.to} className="btn btn-secondary">
                                    {link.label} <ArrowRight size={16} />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
