import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Lock, PlayCircle, FileText, Download, ExternalLink, ChevronDown, ChevronUp, Award } from 'lucide-react';
import { computerExamData } from '../data/computerExamData.jsx';
import { useAuth } from '../context/AuthContext';
import { registerForCourse, getRegisteredCourses } from '../utils/firestoreHelpers';
import './ComputerExamPage.css';

const COURSE_ID = 'com-competency-2026';

export default function ComputerExamPage() {
    const { user, loginWithGoogle } = useAuth();
    const [isRegistered, setIsRegistered] = useState(false);
    const [expandedModule, setExpandedModule] = useState(1);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            getRegisteredCourses(user.uid).then(courses => {
                setIsRegistered(courses.includes(COURSE_ID));
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [user]);

    const handleRegister = async () => {
        if (!user) {
            loginWithGoogle();
            return;
        }

        const success = await registerForCourse(user.uid, COURSE_ID);
        if (success) {
            setIsRegistered(true);
            alert('ลงทะเบียนสำเร็จ! คุณสามารถเข้าถึงเนื้อหาได้แล้ว');
        }
    };

    const toggleModule = (id) => {
        setExpandedModule(expandedModule === id ? null : id);
    };

    if (!computerExamData) return <div>Loading course data...</div>;

    return (
        <div className="com-exam-page section">
            <div className="container">
                {/* Hero / Header */}
                <div className="com-exam-header card">
                    <div className="com-exam-cover" style={{ backgroundImage: `url(${computerExamData.coverImage})` }}>
                        <div className="com-exam-overlay" />
                        <div className="com-exam-title-wrapper">
                            <span className="com-exam-badge">คอร์สติวเข้ม</span>
                            <h1 className="com-exam-title">{computerExamData.title}</h1>
                            <p className="com-exam-desc">{computerExamData.description}</p>

                            {!isRegistered && (
                                <button className="btn btn-primary com-exam-register-btn" onClick={handleRegister}>
                                    {user ? 'ลงทะเบียนเรียน (ฟรี)' : 'เข้าสู่ระบบเพื่อลงทะเบียน'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="com-exam-content">
                    {/* Status Bar */}
                    {isRegistered && (
                        <div className="com-exam-status card">
                            <div className="com-exam-status-icon">
                                <Award size={24} />
                            </div>
                            <div className="com-exam-status-info">
                                <h3>สถานะ: ลงทะเบียนแล้ว</h3>
                                <p>คุณสามารถเข้าถึงเนื้อหาทั้งหมดได้</p>
                            </div>
                        </div>
                    )}

                    {!isRegistered && !loading && (
                        <div className="com-exam-locked-notice">
                            <Lock size={48} />
                            <h2>เนื้อหาถูกล็อค</h2>
                            <p>กรุณาลงทะเบียนเพื่อเข้าถึงบทเรียน สไลด์ และข้อสอบเก่า</p>
                        </div>
                    )}

                    {/* Modules List */}
                    <div className={`com-exam-modules ${!isRegistered ? 'com-exam-modules--locked' : ''}`}>
                        {computerExamData.modules.map((module) => (
                            <div key={module.id} className={`com-exam-module card ${expandedModule === module.id ? 'active' : ''}`}>
                                <div className="com-exam-module-header" onClick={() => toggleModule(module.id)}>
                                    <div className="com-exam-module-icon">
                                        {module.icon}
                                    </div>
                                    <div className="com-exam-module-info">
                                        <h3 className="com-exam-module-title">{module.title}</h3>
                                        <p className="com-exam-module-meta">{module.duration} • {module.content.length} บทเรียน</p>
                                    </div>
                                    <div className="com-exam-module-toggle">
                                        {expandedModule === module.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </div>
                                </div>

                                {expandedModule === module.id && (
                                    <div className="com-exam-module-body">
                                        <p className="com-exam-module-desc">{module.description}</p>
                                        <div className="com-exam-lessons">
                                            {module.content.map((item, idx) => (
                                                <a
                                                    key={idx}
                                                    href={isRegistered ? item.url : '#'}
                                                    className={`com-exam-lesson ${!isRegistered ? 'disabled' : ''}`}
                                                    target={item.isExternal ? "_blank" : "_self"}
                                                    rel="noreferrer"
                                                    onClick={(e) => {
                                                        if (!isRegistered) e.preventDefault();
                                                        else if (item.url === '#') {
                                                            e.preventDefault();
                                                            alert('เอกสารนี้เป็นตัวอย่าง (Mock Data) ในเวอร์ชันจริงจะลิงก์ไปที่ไฟล์ PDF');
                                                        }
                                                    }}
                                                >
                                                    <div className="com-exam-lesson-icon">
                                                        {item.type === 'video' && <PlayCircle size={18} />}
                                                        {item.type === 'pdf' && <FileText size={18} />}
                                                        {item.type === 'link' && <ExternalLink size={18} />}
                                                        {item.type === 'quiz' && <CheckCircle2 size={18} />}
                                                    </div>
                                                    <span className="com-exam-lesson-title">{item.title}</span>
                                                    {isRegistered && item.type !== 'link' && item.type !== 'quiz' && (
                                                        <Download size={16} className="com-exam-lesson-download" />
                                                    )}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
