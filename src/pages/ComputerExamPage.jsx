import { useState, useEffect } from 'react';
import { CheckCircle2, PlayCircle, FileText, Download, ExternalLink, ChevronDown, ChevronUp, Monitor, Clock, BookOpen, MapPin, Calendar, Users, ArrowRight, Sparkles, Lock, LogIn, Award } from 'lucide-react';
import { computerExamData } from '../data/computerExamData.jsx';
import { useAuth } from '../context/AuthContext';
import { registerForCourse, getRegisteredCourses } from '../utils/firestoreHelpers';
import './ComputerExamPage.css';

const NSRU_URL = 'https://training.nsru.ac.th/course/search/%E0%B8%AA%E0%B8%AD%E0%B8%9A%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B1%E0%B8%99%E0%B8%84%E0%B8%AD%E0%B8%A1%E0%B8%9E%E0%B8%B4%E0%B8%A7%E0%B9%80%E0%B8%95%E0%B8%AD%E0%B8%A3%E0%B9%8C';
const COURSE_ID = 'com-competency-2026';

export default function ComputerExamPage() {
    const { user, loginWithGoogle } = useAuth();
    const [isRegistered, setIsRegistered] = useState(false);
    const [loading, setLoading] = useState(true);
    const [expandedModule, setExpandedModule] = useState(null);

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
        }
    };

    const toggleModule = (id) => {
        if (!isRegistered) return;
        setExpandedModule(expandedModule === id ? null : id);
    };

    if (!computerExamData) return <div>Loading course data...</div>;

    const totalDuration = "~6 ชั่วโมง";
    const totalLessons = computerExamData.modules.reduce((sum, m) => sum + m.content.length, 0);

    return (
        <div className="ce-page">
            {/* Hero Banner */}
            <div className="ce-hero">
                <div className="ce-hero-bg" style={{ backgroundImage: `url(${computerExamData.coverImage})` }} />
                <div className="ce-hero-overlay" />
                <div className="ce-hero-particles">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="ce-particle" style={{ '--delay': `${i * 0.8}s`, '--x': `${15 + i * 15}%` }} />
                    ))}
                </div>
                <div className="container ce-hero-content">
                    <div className="ce-hero-badge">
                        <Sparkles size={14} />
                        คอร์สติวเข้ม
                    </div>
                    <h1 className="ce-hero-title">{computerExamData.title}</h1>
                    <p className="ce-hero-desc">{computerExamData.description}</p>

                    <div className="ce-hero-stats">
                        <div className="ce-stat">
                            <BookOpen size={16} />
                            <span>{computerExamData.modules.length} บทเรียน</span>
                        </div>
                        <div className="ce-stat">
                            <FileText size={16} />
                            <span>{totalLessons} เนื้อหา</span>
                        </div>
                        <div className="ce-stat">
                            <Clock size={16} />
                            <span>{totalDuration}</span>
                        </div>
                        <div className="ce-stat">
                            <Users size={16} />
                            <span>นักศึกษา</span>
                        </div>
                    </div>

                    <div className="ce-hero-actions">
                        {!user ? (
                            <button className="ce-hero-btn ce-hero-btn--primary" onClick={loginWithGoogle}>
                                <LogIn size={18} />
                                เข้าสู่ระบบเพื่อลงทะเบียน
                            </button>
                        ) : !isRegistered ? (
                            <button className="ce-hero-btn ce-hero-btn--primary" onClick={handleRegister}>
                                <Award size={18} />
                                ลงทะเบียนเรียน (ฟรี)
                            </button>
                        ) : (
                            <a href="#modules" className="ce-hero-btn ce-hero-btn--primary">
                                <ArrowRight size={18} />
                                ดูบทเรียน
                            </a>
                        )}
                        <a href={NSRU_URL} target="_blank" rel="noreferrer" className="ce-hero-btn ce-hero-btn--ghost">
                            <ExternalLink size={16} />
                            เปิดในเว็บ NSRU Training
                        </a>
                    </div>
                </div>
            </div>

            {/* Status Bar */}
            <div className="container">
                {isRegistered && (
                    <div className="ce-status-bar">
                        <div className="ce-status-icon">
                            <CheckCircle2 size={20} />
                        </div>
                        <div className="ce-status-info">
                            <strong>ลงทะเบียนแล้ว</strong>
                            <span>คุณสามารถเข้าถึงเนื้อหาทั้งหมดได้</span>
                        </div>
                    </div>
                )}

                {!isRegistered && !loading && (
                    <div className="ce-locked-bar">
                        <Lock size={20} />
                        <div className="ce-locked-info">
                            <strong>เนื้อหาถูกล็อค</strong>
                            <span>{!user ? 'กรุณาเข้าสู่ระบบและลงทะเบียนเพื่อเข้าถึงบทเรียน' : 'กรุณาลงทะเบียนเพื่อเข้าถึงบทเรียน สไลด์ และข้อสอบเก่า'}</span>
                        </div>
                        <button className="ce-locked-btn" onClick={handleRegister}>
                            {!user ? (
                                <><LogIn size={16} /> เข้าสู่ระบบ</>
                            ) : (
                                <><Award size={16} /> ลงทะเบียน</>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Module Cards Grid */}
            <div className="container" id="modules">
                <div className="ce-section-header">
                    <h2 className="ce-section-title">บทเรียนทั้งหมด</h2>
                    <p className="ce-section-subtitle">{computerExamData.modules.length} บทเรียน • {totalLessons} เนื้อหา • ฟรีไม่มีค่าใช้จ่าย</p>
                </div>

                <div className={`ce-module-grid ${!isRegistered ? 'ce-module-grid--locked' : ''}`}>
                    {computerExamData.modules.map((module, index) => (
                        <div
                            key={module.id}
                            className={`ce-card ${expandedModule === module.id ? 'ce-card--expanded' : ''}`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {/* Card Image */}
                            <div className="ce-card-image">
                                <img src={module.image} alt={module.title} loading="lazy" />
                                <div className="ce-card-image-overlay" />
                                <span className="ce-card-duration">
                                    <Clock size={12} />
                                    {module.duration}
                                </span>
                                <span className="ce-card-number" style={{ background: module.color }}>
                                    {module.id}
                                </span>
                                {!isRegistered && (
                                    <div className="ce-card-lock">
                                        <Lock size={24} />
                                    </div>
                                )}
                            </div>

                            {/* Card Body */}
                            <div className="ce-card-body">
                                <h3 className="ce-card-title">{module.title}</h3>
                                <p className="ce-card-desc">{module.description}</p>

                                <div className="ce-card-meta">
                                    <span className="ce-card-count">
                                        <FileText size={14} />
                                        {module.content.length} เนื้อหา
                                    </span>
                                    <span className="ce-card-price">Free</span>
                                </div>

                                {/* Toggle button */}
                                {isRegistered ? (
                                    <button className="ce-card-toggle" onClick={() => toggleModule(module.id)}>
                                        {expandedModule === module.id ? (
                                            <>ซ่อนเนื้อหา <ChevronUp size={16} /></>
                                        ) : (
                                            <>ดูเนื้อหา <ChevronDown size={16} /></>
                                        )}
                                    </button>
                                ) : (
                                    <button className="ce-card-toggle ce-card-toggle--locked" onClick={handleRegister}>
                                        <Lock size={14} />
                                        {!user ? 'เข้าสู่ระบบเพื่อดูเนื้อหา' : 'ลงทะเบียนเพื่อดูเนื้อหา'}
                                    </button>
                                )}

                                {/* Expanded lessons */}
                                {expandedModule === module.id && isRegistered && (
                                    <div className="ce-card-lessons">
                                        {module.content.map((item, idx) => (
                                            <a
                                                key={idx}
                                                href={item.url}
                                                className="ce-lesson"
                                                target={item.isExternal ? "_blank" : "_self"}
                                                rel="noreferrer"
                                                onClick={(e) => {
                                                    if (item.url === '#') {
                                                        e.preventDefault();
                                                        alert('เอกสารนี้เป็นตัวอย่าง (Mock Data) ในเวอร์ชันจริงจะลิงก์ไปที่ไฟล์จริง');
                                                    }
                                                }}
                                            >
                                                <div className="ce-lesson-icon" style={{ background: `${module.color}15`, color: module.color }}>
                                                    {item.type === 'video' && <PlayCircle size={16} />}
                                                    {item.type === 'pdf' && <FileText size={16} />}
                                                    {item.type === 'link' && <ExternalLink size={16} />}
                                                    {item.type === 'quiz' && <CheckCircle2 size={16} />}
                                                </div>
                                                <span className="ce-lesson-title">{item.title}</span>
                                                {item.type !== 'link' && item.type !== 'quiz' && (
                                                    <Download size={14} className="ce-lesson-action" />
                                                )}
                                                {item.isExternal && (
                                                    <ExternalLink size={14} className="ce-lesson-action" />
                                                )}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
