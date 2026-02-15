import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import PromptCard from '../components/PromptCard';
import FilterBar from '../components/FilterBar';
import prompts, { subjects, levels, allTags } from '../data/prompts';
import './PromptLibrary.css';

export default function PromptLibrary() {
    const [searchParams] = useSearchParams();
    const initialSearch = searchParams.get('search') || '';

    const [search, setSearch] = useState(initialSearch);
    const [filters, setFilters] = useState({ subject: '', level: '', tag: '' });

    const filteredPrompts = useMemo(() => {
        return prompts.filter(p => {
            const q = search.toLowerCase();
            const matchesSearch = !q ||
                p.title.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.subject.toLowerCase().includes(q) ||
                p.tags.some(t => t.toLowerCase().includes(q));

            const matchesSubject = !filters.subject || p.subject === filters.subject;
            const matchesLevel = !filters.level || p.level === filters.level;
            const matchesTag = !filters.tag || p.tags.includes(filters.tag);

            return matchesSearch && matchesSubject && matchesLevel && matchesTag;
        });
    }, [search, filters]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({ subject: '', level: '', tag: '' });
        setSearch('');
    };

    return (
        <div className="prompt-library-page section">
            <div className="container">
                <div className="prompt-library-header">
                    <h1 className="page-title">คลัง Prompt</h1>
                    <p className="page-subtitle">
                        เรียกดู {prompts.length} Prompt พร้อมใช้งาน คัดลอก ปรับแต่ง แล้วนำไปใช้กับเครื่องมือ AI ที่คุณชอบ
                    </p>
                </div>

                {/* Search */}
                <div className="prompt-search-wrapper">
                    <div className="prompt-search">
                        <Search size={18} className="prompt-search-icon" />
                        <input
                            type="text"
                            placeholder="ค้นหา Prompt..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="prompt-search-input"
                            id="prompt-search"
                        />
                    </div>
                </div>

                {/* Filters */}
                <FilterBar
                    subjects={subjects}
                    levels={levels}
                    tags={allTags}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClear={clearFilters}
                />

                {/* Results */}
                <div className="prompt-results-info">
                    <span>พบ {filteredPrompts.length} Prompt</span>
                </div>

                {filteredPrompts.length > 0 ? (
                    <div className="prompt-grid">
                        {filteredPrompts.map(p => (
                            <PromptCard key={p.id} prompt={p} />
                        ))}
                    </div>
                ) : (
                    <div className="prompt-empty">
                        <div className="prompt-empty-icon">🔍</div>
                        <h3>ไม่พบ Prompt</h3>
                        <p>ลองใช้คำค้นอื่น หรือล้างตัวกรอง</p>
                        <button className="btn btn-secondary" onClick={clearFilters}>
                            ล้างตัวกรองทั้งหมด
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
