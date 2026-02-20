import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        // Retrieve stored theme, default to 'system'
        return localStorage.getItem('studyhub-theme') || 'system';
    });

    useEffect(() => {
        const root = window.document.documentElement;

        // Remove existing theme classes
        root.classList.remove('theme-light', 'theme-dark');

        let activeTheme = theme;
        if (theme === 'system') {
            activeTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }

        root.classList.add(`theme-${activeTheme}`);
        // Optionally set data attribute for easier CSS targeting
        root.setAttribute('data-theme', activeTheme);

        localStorage.setItem('studyhub-theme', theme);
    }, [theme]);

    // Listen for system theme changes if set to 'system'
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = () => {
            if (theme === 'system') {
                const root = window.document.documentElement;
                root.classList.remove('theme-light', 'theme-dark');
                const newTheme = mediaQuery.matches ? 'dark' : 'light';
                root.classList.add(`theme-${newTheme}`);
                root.setAttribute('data-theme', newTheme);
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => {
            if (prev === 'light') return 'dark';
            if (prev === 'dark') return 'system';
            return 'light'; // system -> light
        });
    };

    const value = {
        theme,
        setTheme,
        toggleTheme
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
