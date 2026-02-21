import { Link } from 'react-router-dom';
import { CheckSquare, Calculator, Timer, StickyNote, ArrowRight, Star } from 'lucide-react';
import './StudyTools.css';

const toolsList = [
    {
        id: 'todo',
        title: 'รายการสิ่งที่ต้องทำ',
        description: 'จัดระเบียบงานและติดตามความก้าวหน้า เพิ่ม ลบ แก้ไข และเช็คเสร็จ',
        icon: CheckSquare,
        color: '#10B981',
        bgColor: '#D1FAE5',
        link: '/tools/todo',
        isFeatured: false
    },
    {
        id: 'gpa',
        title: 'คำนวณเกรดเฉลี่ย',
        description: 'ตั้งเป้าหมายและคำนวณเกรดเฉลี่ยรายภาคแบบเรียลไทม์ พร้อมกราฟแสดงผลสวยงาม',
        icon: Calculator,
        color: '#8B5CF6',
        bgColor: '#EDE9FE',
        link: '/tools/gpa',
        isFeatured: true
    },
    {
        id: 'timer',
        title: 'จับเวลาอ่านหนังสือ',
        description: 'จับเวลาแบบ Pomodoro เพื่อเพิ่มสมาธิ พร้อมนับรอบอัตโนมัติ',
        icon: Timer,
        color: '#F59E0B',
        bgColor: '#FEF3C7',
        link: '/tools/timer',
        isFeatured: false
    },
    {
        id: 'notes',
        title: 'จดบันทึกด่วน',
        description: 'จดและจัดระเบียบบันทึกการเรียน เลือกสีป้ายกำกับ ค้นหาได้',
        icon: StickyNote,
        color: '#E91E63',
        bgColor: '#FCE7F3',
        link: '/tools/notes',
        isFeatured: false
    }
];

export default function StudyTools() {
    const featuredTool = toolsList.find(t => t.isFeatured);
    const regularTools = toolsList.filter(t => !t.isFeatured);

    return (
        <div className="tools-page section">
            <div className="container">
                <div className="tools-header">
                    <h1 className="page-title">ศูนย์รวมความโปร</h1>
                    <p className="page-subtitle">
                        เครื่องมือเพิ่มประสิทธิภาพการเรียน พัฒนามาเพื่อนักศึกษาโดยเฉพาะ
                    </p>
                </div>

                <div className="tools-hub-container">
                    {/* Featured App Showcase */}
                    {featuredTool && (
                        <div className="featured-tool-section mb-6">
                            <h2 className="section-title text-sm uppercase text-muted mb-4 flex items-center gap-2">
                                <Star size={16} className="text-amber-500" /> เครื่องมือแนะนำ
                            </h2>
                            <Link to={featuredTool.link} className="featured-tool-card card">
                                <div className="featured-tool-content">
                                    <div className="featured-tool-icon-wrapper" style={{ background: featuredTool.bgColor, color: featuredTool.color }}>
                                        <featuredTool.icon size={48} />
                                    </div>
                                    <div className="featured-tool-text">
                                        <span className="featured-badge">ยอดนิยม 🔥</span>
                                        <h3 className="featured-tool-title">{featuredTool.title}</h3>
                                        <p className="featured-tool-desc">{featuredTool.description}</p>
                                        <span className="btn btn-primary mt-4 inline-flex">
                                            เปิดใช้งานเลย <ArrowRight size={16} />
                                        </span>
                                    </div>
                                </div>
                                {/* Decorative elements for the featured card */}
                                <div className="featured-tool-bg-blob" style={{ background: featuredTool.color }}></div>
                            </Link>
                        </div>
                    )}

                    {/* App Grid */}
                    <div className="regular-tools-section">
                        <h2 className="section-title text-sm uppercase text-muted mb-4">เครื่องมือทั้งหมด</h2>
                        <div className="app-store-grid">
                            {regularTools.map(tool => (
                                <Link key={tool.id} to={tool.link} className="app-store-card card">
                                    <div className="app-store-icon" style={{ background: tool.bgColor, color: tool.color }}>
                                        <tool.icon size={28} />
                                    </div>
                                    <div className="app-store-info">
                                        <h3 className="app-store-title">{tool.title}</h3>
                                        <p className="app-store-desc">{tool.description}</p>
                                    </div>
                                    <div className="app-store-action">
                                        <span className="app-store-btn">เปิด</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
