import './FilterBar.css';

export default function FilterBar({ subjects, levels, tags, filters, onFilterChange, onClear }) {
    const hasActiveFilters = filters.subject || filters.level || filters.tag;

    return (
        <div className="filter-bar">
            <div className="filter-bar-selects">
                <select
                    className="filter-select"
                    value={filters.subject || ''}
                    onChange={(e) => onFilterChange('subject', e.target.value)}
                    id="filter-subject"
                >
                    <option value="">ทุกวิชา</option>
                    {subjects.map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>

                <select
                    className="filter-select"
                    value={filters.level || ''}
                    onChange={(e) => onFilterChange('level', e.target.value)}
                    id="filter-level"
                >
                    <option value="">ทุกระดับ</option>
                    {levels.map(l => (
                        <option key={l} value={l}>{l}</option>
                    ))}
                </select>

                <select
                    className="filter-select"
                    value={filters.tag || ''}
                    onChange={(e) => onFilterChange('tag', e.target.value)}
                    id="filter-tag"
                >
                    <option value="">ทุกแท็ก</option>
                    {tags.map(t => (
                        <option key={t} value={t}>#{t}</option>
                    ))}
                </select>
            </div>

            {hasActiveFilters && (
                <button className="filter-clear-btn" onClick={onClear}>
                    ล้างตัวกรอง
                </button>
            )}
        </div>
    );
}
