import { createContext, useContext, useState, useMemo } from 'react';
import prompts from '../data/prompts';
import subjectsList from '../data/subjects';
import { educationLinks } from '../data/resources';

const SearchContext = createContext();

export function SearchProvider({ children }) {
    const [query, setQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const results = useMemo(() => {
        if (!query || query.length < 2) return { prompts: [], subjects: [], links: [], total: 0 };

        const q = query.toLowerCase();

        const matchedPrompts = prompts.filter(p =>
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.subject.toLowerCase().includes(q) ||
            p.tags.some(t => t.toLowerCase().includes(q))
        );

        const matchedSubjects = subjectsList.filter(s =>
            s.title.toLowerCase().includes(q) ||
            s.description.toLowerCase().includes(q)
        );

        const matchedLinks = educationLinks.filter(l =>
            l.title.toLowerCase().includes(q) ||
            l.description.toLowerCase().includes(q)
        );

        return {
            prompts: matchedPrompts,
            subjects: matchedSubjects,
            links: matchedLinks,
            total: matchedPrompts.length + matchedSubjects.length + matchedLinks.length
        };
    }, [query]);

    return (
        <SearchContext.Provider value={{ query, setQuery, results, isSearchOpen, setIsSearchOpen }}>
            {children}
        </SearchContext.Provider>
    );
}

export function useSearch() {
    const context = useContext(SearchContext);
    if (!context) throw new Error('useSearch must be used within SearchProvider');
    return context;
}

export default SearchContext;
