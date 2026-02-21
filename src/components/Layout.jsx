import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumb from './Breadcrumb';
import BottomNav from './BottomNav';
import CommandPalette from './CommandPalette';
import { useRipple } from '../utils/animations';

export default function Layout() {
    const location = useLocation();
    const isHome = location.pathname === '/';

    // Initialize global button ripple
    useRipple();

    return (
        <>
            <Navbar />
            <main className="main-content">
                {!isHome && (
                    <div className="container" style={{ paddingTop: 'var(--space-4)' }}>
                        <Breadcrumb />
                    </div>
                )}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        style={{ display: 'flex', flexDirection: 'column', flex: 1 }}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>
            <Footer />
            <BottomNav />
            <CommandPalette />
        </>
    );
}
