import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Lightbulb, Bookmark, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './BottomNav.css';

const BottomNav = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // Hide bottom nav when scrolling down, show when scrolling up
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false); // Scrolling down - hide
            } else {
                setIsVisible(true);  // Scrolling up - show
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const navItems = [
        { path: '/', label: 'หน้าหลัก', icon: <Home size={22} /> },
        { path: '/prompts', label: 'เครื่องมือ', icon: <Lightbulb size={22} /> },
        { path: '/bookmarks', label: 'บันทึก', icon: <Bookmark size={22} /> },
        { path: '/profile', label: user ? 'โปรไฟล์' : 'เข้าสู่ระบบ', icon: <User size={22} /> }
    ];

    return (
        <nav className={`bottom-nav ${isVisible ? 'bottom-nav--visible' : 'bottom-nav--hidden'}`}>
            <div className="bottom-nav-inner">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={`bottom-nav-item ${isActive ? 'bottom-nav-item--active' : ''}`}
                            end={item.path === '/'}
                        >
                            <div className="bottom-nav-icon-container">
                                {item.icon}
                                {isActive && <div className="bottom-nav-indicator" />}
                            </div>
                            <span className="bottom-nav-label">{item.label}</span>
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;
