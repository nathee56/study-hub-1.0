import { Link } from 'react-router-dom';
import { CheckSquare, Calculator, Timer, StickyNote, ArrowRight } from 'lucide-react';
import './StudyTools.css';

const toolsList = [
    {
        id: 'todo',
        title: 'รายการสิ่งที่ต้องทำ',
        description: 'จัดระเบียบงานและติดตามความก้าวหน้า เพิ่ม ลบ แก้ไข และเช็คเสร็จ',
        icon: CheckSquare,
        color: '#10B981',
        bgColor: '#D1FAE5',
        link: '/tools/todo'
    },
    {
        id: 'gpa',
        title: 'คำนวณเกรดเฉลี่ย',
        description: 'คำนวณเกรดเฉลี่ยรายภาคและสะสม ตามระบบเกรดไทย',
        icon: Calculator,
        color: '#8B5CF6',
        bgColor: '#EDE9FE',
        link: '/tools/gpa'
    },
    {
        id: 'timer',
        title: 'จับเวลาอ่านหนังสือ',
        description: 'จับเวลาแบบ Pomodoro เพื่อเพิ่มสมาธิ พร้อมนับรอบอัตโนมัติ',
        icon: Timer,
        color: '#F59E0B',
        bgColor: '#FEF3C7',
        link: '/tools/timer'
    },
    {
        id: 'notes',
        title: 'จดบันทึกด่วน',
        description: 'จดและจัดระเบียบบันทึกการเรียน เลือกสีป้ายกำกับ ค้นหาได้',
        icon: StickyNote,
        color: '#EC4899',
        bgColor: '#FCE7F3',
        link: '/tools/notes'
    }
];

export default function StudyTools() {
    return (
        <div className="tools-page section">
            <div className="container">
                <div className="tools-header">
                    <h1 className="page-title">เครื่องมือการเรียน</h1>
                    <p className="page-subtitle">
                        เครื่องมือเพิ่มประสิทธิภาพการเรียน ออกแบบมาสำหรับนักเรียนนักศึกษา
                    </p>
                </div>

                <div className="tools-hub-grid">
                    {toolsList.map(tool => (
                        <Link key={tool.id} to={tool.link} className="tool-hub-card card">
                            <div className="tool-hub-icon" style={{ background: tool.bgColor, color: tool.color }}>
                                <tool.icon size={32} />
                            </div>
                            <h3 className="tool-hub-title">{tool.title}</h3>
                            <p className="tool-hub-desc">{tool.description}</p>
                            <span className="tool-hub-link">
                                เปิดใช้งาน <ArrowRight size={16} />
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
