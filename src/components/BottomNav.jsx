import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate, Link } from 'react-router-dom';
import { Home, Lightbulb, Bookmark, User, Search, Menu, X, LogOut, LogIn, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { triggerHaptic } from '../utils/haptics';
import './BottomNav.css';

const navLinks = [
    { to: '/', label: 'หน้าแรก', exact: true },
    {
        label: 'เรียนรู้ & เครื่องมือ',
        dropdown: [
            { to: '/prompts', label: 'คลัง Prompt' },
            { to: '/learning', label: 'คลังความรู้' },
            { to: '/tools', label: 'เครื่องมือ' },
        ],
    },
    { to: '/exam', label: 'โซนสอบ' },
    {
        label: 'เพิ่มเติม',
        dropdown: [
            { to: '/community', label: 'ชุมชน' },
            { to: '/links', label: 'ลิงก์รวบรวม' },
            { to: '/qa-submit', label: 'ประกันคุณภาพ' },
        ],
    },
];

const BottomNav = () => {
    const { user, loginWithGoogle, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();

    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // Bottom sheet & search states
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef(null);

    // Hide bottom nav when scrolling down...
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 100 && !isMenuOpen && !isSearchOpen) {
                setIsVisible(false); // Scrolling down - hide
            } else {
                setIsVisible(true);  // Scrolling up - show
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY, isMenuOpen, isSearchOpen]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/prompts?search=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    // Focus search input when open
    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            setTimeout(() => searchInputRef.current.focus(), 100);
        }
    }, [isSearchOpen]);

    const handleItemClick = (action) => {
        triggerHaptic(50);
        if (action === 'search') {
            setIsSearchOpen(!isSearchOpen);
            setIsMenuOpen(false);
        } else if (action === 'menu') {
            setIsMenuOpen(!isMenuOpen);
            setIsSearchOpen(false);
        } else {
            setIsSearchOpen(false);
            setIsMenuOpen(false);
        }
    };

    const navItems = [
        { path: '/', label: 'หน้าหลัก', icon: <Home size={22} />, type: 'link' },
        { action: 'search', label: 'ค้นหา', icon: <Search size={22} />, type: 'button' },
        { path: '/prompts', label: 'เครื่องมือ', icon: <Lightbulb size={22} />, type: 'link' },
        { path: '/bookmarks', label: 'บันทึก', icon: <Bookmark size={22} />, type: 'link' },
        { action: 'menu', label: 'เมนู', icon: <Menu size={22} />, type: 'button' }
    ];

    return (
        <>
            {/* Search and Menu Overlay */}
            <div className={`bottom-nav-overlay ${isSearchOpen || isMenuOpen ? 'open' : ''}`} onClick={() => { setIsSearchOpen(false); setIsMenuOpen(false); }} />

            {/* Search Bottom Sheet */}
            <div className={`bottom-nav-sheet ${isSearchOpen ? 'open' : ''}`}>
                <div className="sheet-drag-handle" />
                <div className="sheet-content">
                    <h3 className="sheet-title">ค้นหาความรู้เลย!</h3>
                    <form onSubmit={handleSearchSubmit} className="sheet-search-form">
                        <Search size={20} className="sheet-search-icon" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="พิมพ์ชื่อวิชา หรือเครื่องมือ..."
                            className="sheet-search-input"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary sheet-search-btn">ค้นหา</button>
                    </form>
                </div>
            </div>

            {/* Menu Dropdown Bottom Sheet */}
            <div className={`bottom-nav-sheet menu-sheet ${isMenuOpen ? 'open' : ''}`}>
                <div className="sheet-drag-handle" />
                <div className="sheet-content sheet-menu-content">
                    {/* User Profile Section */}
                    <div className="sheet-profile-section">
                        {user ? (
                            <div className="sheet-profile-info">
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt="" className="sheet-avatar" />
                                ) : (
                                    <div className="sheet-avatar-placeholder"><User size={24} /></div>
                                )}
                                <div className="sheet-user-details">
                                    <span className="sheet-user-name">{user.displayName || 'ผู้ใช้'}</span>
                                    <span className="sheet-user-email">{user.email}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="sheet-profile-info login-prompt">
                                <div className="sheet-avatar-placeholder"><User size={24} /></div>
                                <div className="sheet-user-details">
                                    <span className="sheet-user-name">ยินดีต้อนรับ</span>
                                    <span className="sheet-user-email">เข้าสู่ระบบเพื่อบันทึกและอื่นๆ</span>
                                </div>
                                <button className="btn btn-primary sheet-login-btn" onClick={() => { loginWithGoogle(); setIsMenuOpen(false); }}>
                                    <LogIn size={18} /> เข้าสู่ระบบ
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Settings / Theme */}
                    <div className="sheet-menu-group">
                        <button className="sheet-menu-item" onClick={toggleTheme}>
                            <div className="sheet-menu-icon" style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}>
                                {theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) ? <Sun size={18} /> : <Moon size={18} />}
                            </div>
                            <span>โหมดหน้าจอแสงสว่าง/มืด</span>
                        </button>
                        {user && (
                            <button className="sheet-menu-item" onClick={() => { navigate('/profile'); setIsMenuOpen(false); }}>
                                <div className="sheet-menu-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}><User size={18} /></div>
                                <span>จัดการโปรไฟล์ของฉัน</span>
                            </button>
                        )}
                    </div>

                    <div className="sheet-divider" />

                    {/* Navigation Links */}
                    <div className="sheet-nav-links">
                        {navLinks.map((link, idx) => (
                            <div key={idx} className="sheet-nav-group">
                                {link.to ? (
                                    <NavLink
                                        to={link.to}
                                        className={({ isActive }) => `sheet-nav-link ${isActive ? 'active' : ''}`}
                                        onClick={() => setIsMenuOpen(false)}
                                        end={link.exact}
                                    >
                                        {link.label}
                                    </NavLink>
                                ) : (
                                    <>
                                        <div className="sheet-nav-group-title">{link.label}</div>
                                        <div className="sheet-nav-sublinks">
                                            {link.dropdown.map(drop => (
                                                <Link
                                                    key={drop.to}
                                                    to={drop.to}
                                                    className="sheet-sublink"
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    {drop.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    {user && (
                        <>
                            <div className="sheet-divider" />
                            <button className="sheet-menu-item logout" onClick={() => { logout(); setIsMenuOpen(false); }}>
                                <div className="sheet-menu-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}><LogOut size={18} /></div>
                                <span>ออกจากระบบ</span>
                            </button>
                        </>
                    )}
                </div>
            </div>

            <nav className={`bottom-nav ${isVisible ? 'bottom-nav--visible' : 'bottom-nav--hidden'}`}>
                <div className="bottom-nav-inner">
                    {navItems.map((item, index) => {
                        const isActive = item.type === 'link'
                            ? (location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path)))
                            : (item.action === 'search' ? isSearchOpen : (item.action === 'menu' ? isMenuOpen : false));

                        if (item.type === 'link') {
                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={`bottom-nav-item ${isActive ? 'bottom-nav-item--active' : ''}`}
                                    end={item.path === '/'}
                                    onClick={() => handleItemClick('link')}
                                >
                                    <div className="bottom-nav-icon-container">
                                        {item.icon}
                                        {isActive && <div className="bottom-nav-indicator" />}
                                    </div>
                                    <span className="bottom-nav-label">{item.label}</span>
                                </NavLink>
                            );
                        } else {
                            return (
                                <button
                                    key={item.action}
                                    className={`bottom-nav-item ${isActive ? 'bottom-nav-item--active' : ''}`}
                                    onClick={() => handleItemClick(item.action)}
                                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                                >
                                    <div className="bottom-nav-icon-container">
                                        {item.icon}
                                        {isActive && <div className="bottom-nav-indicator" />}
                                    </div>
                                    <span className="bottom-nav-label">{item.label}</span>
                                </button>
                            );
                        }
                    })}
                </div>
            </nav>
        </>
    );
};

export default BottomNav;
