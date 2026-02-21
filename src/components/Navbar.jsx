import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Bookmark, User, LogOut, LogIn, Moon, Sun, Search, ChevronDown } from 'lucide-react';
import { useBookmarks } from '../context/BookmarkContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

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

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Scroll state for Smart Hide & Dynamic Island
    const [scrolled, setScrolled] = useState(false);
    const [hidden, setHidden] = useState(false);
    const lastScrollY = useRef(0);

    // Sliding Pill State
    const [pillStyle, setPillStyle] = useState({ opacity: 0, left: 0, width: 0 });
    const [activeDropdown, setActiveDropdown] = useState(null);
    const navRefs = useRef([]);
    const location = useLocation();

    const { bookmarks } = useBookmarks();
    const { user, loginWithGoogle, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const profileRef = useRef(null);
    const searchRef = useRef(null);

    // Handle scroll
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }

            if (currentScrollY > lastScrollY.current && currentScrollY > 150) {
                setHidden(true); // hide when scrolling down past 150px
                setActiveDropdown(null);
                setShowProfile(false);
                setIsSearchOpen(false);
            } else {
                setHidden(false); // show when scrolling up
            }
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Spotlight Effect logic
    useEffect(() => {
        const navbar = document.getElementById('main-navbar');
        if (!navbar) return;

        const handleMouseMove = (e) => {
            const rect = navbar.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            navbar.style.setProperty('--mouse-x', `${x}px`);
            navbar.style.setProperty('--mouse-y', `${y}px`);
        };

        navbar.addEventListener('mousemove', handleMouseMove);
        return () => navbar.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Close click outside
    useEffect(() => {
        function handleClickOutside(e) {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setShowProfile(false);
            }
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setIsSearchOpen(false);
            }
            if (!e.target.closest('.navbar-link-wrapper') && !e.target.closest('.navbar-dropdown-menu')) {
                setActiveDropdown(null);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Pill logic
    useEffect(() => {
        updatePillToActive();
        window.addEventListener('resize', updatePillToActive);
        return () => window.removeEventListener('resize', updatePillToActive);
    }, [location.pathname]);

    const updatePillToActive = () => {
        let activeIndex = -1;
        navLinks.forEach((link, idx) => {
            if (link.to && (link.exact ? location.pathname === link.to : location.pathname.startsWith(link.to))) {
                activeIndex = idx;
            } else if (link.dropdown) {
                if (link.dropdown.some(drop => location.pathname.startsWith(drop.to))) {
                    activeIndex = idx;
                }
            }
        });

        if (activeIndex !== -1 && navRefs.current[activeIndex]) {
            const el = navRefs.current[activeIndex];
            // slight delay to ensure render layout
            setTimeout(() => {
                const container = el.closest('.navbar-links');
                if (container) {
                    const containerRect = container.getBoundingClientRect();
                    const rect = el.getBoundingClientRect();
                    setPillStyle({
                        opacity: 1,
                        left: rect.left - containerRect.left,
                        width: rect.width,
                    });
                }
            }, 50);
        } else {
            setPillStyle({ opacity: 0, left: 0, width: 0 });
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/prompts?search=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    return (
        <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${hidden ? 'navbar--hidden' : ''}`} id="main-navbar">
            <div className={`navbar-spotlight ${scrolled ? 'active' : ''}`} />

            <div className="navbar-inner">
                {/* Brand */}
                <Link to="/" className="navbar-brand" onClick={() => setIsOpen(false)}>
                    <div className="navbar-logo">
                        <img src={`${import.meta.env.BASE_URL}logo.png`} alt="StudyHub Logo" className="navbar-logo-img" />
                    </div>
                    <span className="navbar-title">StudyHub</span>
                </Link>

                {/* Desktop Menu */}
                <div className={`navbar-links desktop-only`} onMouseLeave={updatePillToActive}>
                    <div className="navbar-pill-indicator" style={{
                        opacity: pillStyle.opacity,
                        transform: `translate(${pillStyle.left}px, -50%)`,
                        width: `${pillStyle.width}px`
                    }} />

                    {navLinks.map((link, idx) => (
                        <div
                            key={idx}
                            ref={el => navRefs.current[idx] = el}
                            className="navbar-link-wrapper"
                            onMouseEnter={(e) => {
                                const container = e.currentTarget.closest('.navbar-links');
                                const containerRect = container.getBoundingClientRect();
                                const rect = e.currentTarget.getBoundingClientRect();
                                setPillStyle({
                                    opacity: 1,
                                    left: rect.left - containerRect.left,
                                    width: rect.width
                                });
                                if (link.dropdown) setActiveDropdown(idx);
                                else setActiveDropdown(null);
                            }}
                        >
                            {link.to ? (
                                <NavLink
                                    to={link.to}
                                    className={({ isActive }) => `navbar-link ${isActive ? 'navbar-link--active' : ''}`}
                                    end={link.exact}
                                    onClick={() => setActiveDropdown(null)}
                                >
                                    {link.label}
                                </NavLink>
                            ) : (
                                <button className={`navbar-link navbar-dropdown-trigger ${activeDropdown === idx ? 'active' : ''}`}>
                                    {link.label}
                                    <ChevronDown size={14} className={`dropdown-icon ${activeDropdown === idx ? 'rotated' : ''}`} />
                                </button>
                            )}

                            {/* Dropdown Menu Desktop */}
                            {link.dropdown && (
                                <div className={`navbar-dropdown-menu ${activeDropdown === idx ? 'show' : ''}`}>
                                    {link.dropdown.map((dropItem) => (
                                        <Link
                                            key={dropItem.to}
                                            to={dropItem.to}
                                            className="navbar-dropdown-item-link"
                                            onClick={() => setActiveDropdown(null)}
                                        >
                                            {dropItem.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="navbar-actions">
                    {/* Expandable Search */}
                    <div className={`navbar-search-container ${isSearchOpen ? 'open' : ''}`} ref={searchRef}>
                        <form onSubmit={handleSearchSubmit} className={`navbar-search-form ${isSearchOpen ? 'open' : ''}`}>
                            <input
                                type="text"
                                placeholder="ค้นหา prompt..."
                                className="navbar-search-input"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </form>
                        <button
                            className={`navbar-theme-btn navbar-search-btn ${isSearchOpen ? 'active' : ''}`}
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            aria-label="ค้นหา"
                        >
                            {isSearchOpen ? <X size={20} /> : <Search size={20} />}
                        </button>
                    </div>

                    <button
                        className="navbar-theme-btn"
                        onClick={toggleTheme}
                        aria-label="เปลี่ยนธีม สว่าง/มืด"
                    >
                        {theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) ? (
                            <Sun size={20} />
                        ) : (
                            <Moon size={20} />
                        )}
                    </button>

                    <Link to="/bookmarks" className="navbar-bookmark-btn" aria-label="บุ๊คมาร์ค">
                        <Bookmark size={20} />
                        {bookmarks.length > 0 && (
                            <span className="navbar-bookmark-count">{bookmarks.length}</span>
                        )}
                    </Link>

                    {/* Auth */}
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
                                <div className="navbar-dropdown navbar-profile-dropdown">
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

            {/* Mobile Menu Overlay */}
            <div className={`navbar-mobile-overlay ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(false)} />

            {/* Mobile Menu Content */}
            <div className={`navbar-mobile-menu ${isOpen ? 'open' : ''}`}>
                <div className="mobile-menu-inner">
                    {navLinks.map((link, idx) => (
                        <div key={idx} className="mobile-nav-group">
                            {link.to ? (
                                <NavLink
                                    to={link.to}
                                    className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                                    onClick={() => setIsOpen(false)}
                                    end={link.exact}
                                >
                                    {link.label}
                                </NavLink>
                            ) : (
                                <>
                                    <div className="mobile-nav-group-title">{link.label}</div>
                                    <div className="mobile-nav-sublinks">
                                        {link.dropdown.map(drop => (
                                            <Link
                                                key={drop.to}
                                                to={drop.to}
                                                className="mobile-nav-sublink"
                                                onClick={() => setIsOpen(false)}
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
            </div>
        </nav>
    );
}
