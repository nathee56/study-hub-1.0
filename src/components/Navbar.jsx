import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Bookmark, User, LogOut, LogIn } from 'lucide-react';
import { useBookmarks } from '../context/BookmarkContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const navLinks = [
    { to: '/', label: 'หน้าแรก' },
    { to: '/prompts', label: 'คลัง Prompt' },
    { to: '/learning', label: 'คลังความรู้' },
    { to: '/tools', label: 'เครื่องมือ' },
    { to: '/exam', label: 'โซนสอบ' },
    { to: '/com-competency', label: 'ติวสอบคอมฯ' },
    { to: '/qa-submit', label: 'ประกันคุณภาพ' },
    { to: '/links', label: 'ลิงก์' },
    { to: '/community', label: 'ชุมชน' },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const { bookmarks } = useBookmarks();
    const { user, loginWithGoogle, logout } = useAuth();
    const navigate = useNavigate();
    const profileRef = useRef(null);

    // Close profile dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e) {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setShowProfile(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="navbar" id="main-navbar">
            <div className="navbar-inner container">
                <Link to="/" className="navbar-brand" onClick={() => setIsOpen(false)}>
                    <div className="navbar-logo">
                        <img src={`${import.meta.env.BASE_URL}logo.png`} alt="StudyHub Logo" className="navbar-logo-img" />
                    </div>
                    <span className="navbar-title">StudyHub</span>
                </Link>

                <div className={`navbar-links ${isOpen ? 'navbar-links--open' : ''}`}>
                    {navLinks.map(link => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) => `navbar-link ${isActive ? 'navbar-link--active' : ''}`}
                            onClick={() => setIsOpen(false)}
                            end={link.to === '/'}
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </div>

                <div className="navbar-actions">
                    <Link to="/bookmarks" className="navbar-bookmark-btn" aria-label="บุ๊คมาร์ค">
                        <Bookmark size={20} />
                        {bookmarks.length > 0 && (
                            <span className="navbar-bookmark-count">{bookmarks.length}</span>
                        )}
                    </Link>

                    {/* Auth Button */}
                    {user ? (
                        <div className="navbar-profile" ref={profileRef}>
                            <button
                                className="navbar-avatar-btn"
                                onClick={() => setShowProfile(!showProfile)}
                                aria-label="โปรไฟล์"
                            >
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt={user.displayName} className="navbar-avatar" />
                                ) : (
                                    <div className="navbar-avatar-placeholder">
                                        <User size={18} />
                                    </div>
                                )}
                            </button>

                            {showProfile && (
                                <div className="navbar-dropdown">
                                    <div className="navbar-dropdown-header">
                                        {user.photoURL && (
                                            <img src={user.photoURL} alt="" className="navbar-dropdown-avatar" />
                                        )}
                                        <div className="navbar-dropdown-info">
                                            <span className="navbar-dropdown-name">{user.displayName || 'ผู้ใช้'}</span>
                                            <span className="navbar-dropdown-email">{user.email}</span>
                                        </div>
                                    </div>
                                    <div className="navbar-dropdown-divider" />
                                    <button className="navbar-dropdown-item" onClick={() => { navigate('/profile'); setShowProfile(false); }}>
                                        <User size={16} />
                                        โปรไฟล์ของฉัน
                                    </button>
                                    <button className="navbar-dropdown-item" onClick={() => { logout(); setShowProfile(false); }}>
                                        <LogOut size={16} />
                                        ออกจากระบบ
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button className="navbar-login-btn" onClick={loginWithGoogle} aria-label="เข้าสู่ระบบ">
                            <LogIn size={18} />
                            <span className="navbar-login-text">เข้าสู่ระบบ</span>
                        </button>
                    )}

                    <button
                        className="navbar-menu-btn"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label={isOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
                        id="mobile-menu-toggle"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {isOpen && <div className="navbar-overlay" onClick={() => setIsOpen(false)} />}
        </nav>
    );
}
