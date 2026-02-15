import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import './Breadcrumb.css';

const routeNames = {
    prompts: 'คลัง Prompt',
    learning: 'คลังความรู้',
    tools: 'เครื่องมือ',
    todo: 'รายการสิ่งที่ต้องทำ',
    gpa: 'คำนวณเกรดเฉลี่ย',
    timer: 'จับเวลาอ่านหนังสือ',
    notes: 'จดบันทึกด่วน',
    exam: 'โซนสอบ',
    links: 'ลิงก์การศึกษา',
    community: 'ชุมชน',
    bookmarks: 'บุ๊คมาร์ค',
    about: 'เกี่ยวกับ',
    updates: 'มีอะไรใหม่',
};

export default function Breadcrumb() {
    const location = useLocation();
    const pathParts = location.pathname.split('/').filter(Boolean);

    if (pathParts.length === 0) return null;

    const crumbs = pathParts.map((part, index) => {
        const path = '/' + pathParts.slice(0, index + 1).join('/');
        const name = routeNames[part] || decodeURIComponent(part);
        const isLast = index === pathParts.length - 1;
        return { path, name, isLast };
    });

    return (
        <nav className="breadcrumb" aria-label="เส้นทาง">
            <Link to="/" className="breadcrumb-item breadcrumb-home">
                <Home size={14} />
                <span>หน้าแรก</span>
            </Link>
            {crumbs.map((crumb, i) => (
                <span key={i} className="breadcrumb-segment">
                    <ChevronRight size={14} className="breadcrumb-sep" />
                    {crumb.isLast ? (
                        <span className="breadcrumb-item breadcrumb-current">{crumb.name}</span>
                    ) : (
                        <Link to={crumb.path} className="breadcrumb-item">{crumb.name}</Link>
                    )}
                </span>
            ))}
        </nav>
    );
}
