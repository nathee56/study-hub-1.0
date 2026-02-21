import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Command, BookOpen, Wrench, FileText, ArrowRight } from 'lucide-react';
import prompts from '../data/prompts';
import subjectsList from '../data/subjects';
import tools from '../data/tools';
import './CommandPalette.css';

export default function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    // Toggle Palette on Ctrl+K or Cmd+K
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    // Auto-focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current.focus(), 50);
            setSearchQuery('');
            setActiveIndex(0);
        }
    }, [isOpen]);

    // Gather all searchable items into a unified array
    const allItems = [
        ...prompts.map(p => ({ ...p, type: 'prompt', icon: FileText, route: '/prompts' })),
        ...subjectsList.map(s => ({ ...s, type: 'subject', icon: BookOpen, route: s.link })),
        ...tools.map(t => ({ ...t, type: 'tool', icon: Wrench, route: t.link }))
    ];

    // Filter based on query
    const filteredItems = searchQuery.trim() === ''
        ? allItems.slice(0, 5) // Show top 5 suggestions if empty
        : allItems.filter(item =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
        ).slice(0, 8); // Max 8 results

    // Handle Keyboard Navigation within the list
    useEffect(() => {
        const handleListNavigation = (e) => {
            if (!isOpen) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveIndex(prev => (prev < filteredItems.length - 1 ? prev + 1 : prev));
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveIndex(prev => (prev > 0 ? prev - 1 : 0));
            }
            if (e.key === 'Enter') {
                e.preventDefault();
                if (filteredItems.length > 0) {
                    handleSelect(filteredItems[activeIndex]);
                }
            }
        };

        window.addEventListener('keydown', handleListNavigation);
        return () => window.removeEventListener('keydown', handleListNavigation);
    }, [isOpen, activeIndex, filteredItems]);

    const handleSelect = (item) => {
        setIsOpen(false);
        navigate(item.route);
    };

    if (!isOpen) return null;

    return (
        <div className="command-palette-overlay" onClick={() => setIsOpen(false)}>
            <div className="command-palette-modal" onClick={e => e.stopPropagation()}>
                <div className="command-palette-header">
                    <Search className="command-search-icon" size={20} />
                    <input
                        ref={inputRef}
                        type="text"
                        className="command-search-input"
                        placeholder="ค้นหา Prompt, วิชา หรือเครื่องมือ..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setActiveIndex(0); // Reset selection on type
                        }}
                    />
                    <div className="command-badge">ESC</div>
                </div>

                <div className="command-palette-body">
                    {filteredItems.length === 0 ? (
                        <div className="command-empty-state">
                            <p>ไม่พบผลลัพธ์สำหรับ "{searchQuery}"</p>
                        </div>
                    ) : (
                        <ul className="command-results-list">
                            {filteredItems.map((item, index) => {
                                const Icon = item.icon;
                                const isActive = index === activeIndex;
                                return (
                                    <li
                                        key={`${item.type}-${item.id}`}
                                        className={`command-result-item ${isActive ? 'active' : ''}`}
                                        onClick={() => handleSelect(item)}
                                        onMouseEnter={() => setActiveIndex(index)}
                                    >
                                        <div className="command-item-icon" style={{ background: item.bgColor || `${item.color}15`, color: item.color }}>
                                            <Icon size={16} />
                                        </div>
                                        <div className="command-item-details">
                                            <span className="command-item-title">{item.title}</span>
                                            <span className="command-item-type">{item.type.toUpperCase()}</span>
                                        </div>
                                        {isActive && <ArrowRight size={16} className="command-item-arrow" />}
                                    </li>
                                )
                            })}
                        </ul>
                    )}
                </div>

                <div className="command-palette-footer">
                    <div className="command-footer-hint">
                        <span><kbd>↑</kbd> <kbd>↓</kbd> เลื่อน</span>
                        <span><kbd>↵</kbd> เลือก</span>
                    </div>
                    <div className="command-footer-brand">
                        <Command size={14} /> Study Hub OS
                    </div>
                </div>
            </div>
        </div>
    );
}
