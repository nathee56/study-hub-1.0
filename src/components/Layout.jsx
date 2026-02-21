import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumb from './Breadcrumb';
import BottomNav from './BottomNav';

export default function Layout() {
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <>
            <Navbar />
            <main className="main-content">
                {!isHome && (
                    <div className="container" style={{ paddingTop: 'var(--space-4)' }}>
                        <Breadcrumb />
                    </div>
                )}
                <Outlet />
            </main>
            <Footer />
            <BottomNav />
        </>
    );
}
