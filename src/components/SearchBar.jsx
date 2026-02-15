import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, FileText, BookOpen, ExternalLink } from 'lucide-react';
import { useSearch } from '../context/SearchContext';
import './SearchBar.css';

export default function SearchBar({ large = false, autoFocus = false }) {
    const { query, setQuery, results, isSearchOpen, setIsSearchOpen } = useSearch();
    const [localQuery, setLocalQuery] = useState(query);
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const debounceRef = useRef(null);

    useEffect(() => {
        if (autoFocus && inputRef.current) inputRef.current.focus();
    }, [autoFocus]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setIsSearchOpen]);

    const handleChange = (e) => {
        const val = e.target.value;
        setLocalQuery(val);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setQuery(val);
            setIsSearchOpen(val.length >= 2);
        }, 200);
    };

    const handleClear = () => {
        setLocalQuery('');
        setQuery('');
        setIsSearchOpen(false);
        inputRef.current?.focus();
    };

    const handleResultClick = (link) => {
        setIsSearchOpen(false);
        setLocalQuery('');
        setQuery('');
        navigate(link);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (localQuery.length >= 2) {
            navigate(`/prompts?search=${encodeURIComponent(localQuery)}`);
            setIsSearchOpen(false);
        }
    };

    return (
        <div className={`search-bar-wrapper ${large ? 'search-bar-large' : ''}`} ref={dropdownRef}>
            <form onSubmit={handleSubmit} className="search-bar">
                <Search className="search-icon" size={large ? 22 : 18} />
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="ค้นหา Prompt, วิชา, แหล่งเรียนรู้..."
                    value={localQuery}
                    onChange={handleChange}
                    onFocus={() => localQuery.length >= 2 && setIsSearchOpen(true)}
                    className="search-input"
                    id="global-search"
                />
                {localQuery && (
                    <button type="button" onClick={handleClear} className="search-clear" aria-label="ล้างการค้นหา">
                        <X size={16} />
                    </button>
                )}
            </form>

            {isSearchOpen && (
                <div className="search-dropdown">
                    {results.total === 0 ? (
                        <div className="search-empty">
                            <p>ไม่พบผลลัพธ์สำหรับ "<strong>{localQuery}</strong>"</p>
                            <p className="search-empty-hint">ลองใช้คำค้นอื่น หรือเรียกดูตามหมวดหมู่</p>
                        </div>
                    ) : (
                        <>
                            {results.prompts.length > 0 && (
                                <div className="search-group">
                                    <div className="search-group-title">
                                        <FileText size={14} /> Prompt
                                    </div>
                                    {results.prompts.slice(0, 4).map(p => (
                                        <button key={p.id} className="search-result" onClick={() => handleResultClick(`/prompts/${p.id}`)}>
                                            <div className="search-result-title">{p.title}</div>
                                            <div className="search-result-meta">{p.subject} · {p.level}</div>
                                        </button>
                                    ))}
                                </div>
                            )}
                            {results.subjects.length > 0 && (
                                <div className="search-group">
                                    <div className="search-group-title">
                                        <BookOpen size={14} /> วิชา
                                    </div>
                                    {results.subjects.map(s => (
                                        <button key={s.id} className="search-result" onClick={() => handleResultClick(s.link)}>
                                            <div className="search-result-title">{s.title}</div>
                                            <div className="search-result-meta">{s.description}</div>
                                        </button>
                                    ))}
                                </div>
                            )}
                            {results.links.length > 0 && (
                                <div className="search-group">
                                    <div className="search-group-title">
                                        <ExternalLink size={14} /> แหล่งเรียนรู้
                                    </div>
                                    {results.links.map(l => (
                                        <button key={l.id} className="search-result" onClick={() => window.open(l.url, '_blank')}>
                                            <div className="search-result-title">{l.title}</div>
                                            <div className="search-result-meta">{l.description}</div>
                                        </button>
                                    ))}
                                </div>
                            )}
                            {results.total > 4 && (
                                <button className="search-view-all" onClick={() => handleResultClick(`/prompts?search=${encodeURIComponent(localQuery)}`)}>
                                    ดูผลลัพธ์ทั้งหมด {results.total} รายการ →
                                </button>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
