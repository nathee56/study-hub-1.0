import { Link } from 'react-router-dom';
import {
    FileText, BookOpen, Wrench, GraduationCap,
    Link2, Users, ArrowRight, Sparkles,
    Clock, Zap
} from 'lucide-react';
import SearchBar from '../components/SearchBar';
import PromptCard from '../components/PromptCard';
import SubjectCard from '../components/SubjectCard';
import ToolCard from '../components/ToolCard';
import prompts from '../data/prompts';
import subjectsList from '../data/subjects';
import tools from '../data/tools';
import { whatsNew } from '../data/resources';
import './Home.css';

const quickAccess = [
    { icon: FileText, label: 'คลัง Prompt', link: '/prompts', color: '#2563EB' },
    { icon: BookOpen, label: 'คลังความรู้', link: '/learning', color: '#10B981' },
    { icon: Wrench, label: 'เครื่องมือ', link: '/tools', color: '#8B5CF6' },
    { icon: GraduationCap, label: 'โซนสอบ', link: '/exam', color: '#F59E0B' },
    { icon: Link2, label: 'ลิงก์', link: '/links', color: '#06B6D4' },
    { icon: Users, label: 'ชุมชน', link: '/community', color: '#E91E63' },
];

const typeIcons = {
    prompt: <FileText size={16} />,
    feature: <Sparkles size={16} />,
    upcoming: <Clock size={16} />,
};

export default function Home() {
    const featuredPrompts = prompts.filter(p => p.isFeatured);

    return (
        <div className="home-page">
            {/* Hero */}
            <section className="hero-section" id="hero">
                <div className="container hero-content">
                    <span className="hero-badge">
                        <Zap size={14} /> ศูนย์รวมการเรียนรู้
                    </span>
                    <h1 className="hero-title">
                        เรียนอย่างฉลาด<br />
                        <span className="hero-title-accent">ไม่ใช่เรียนหนัก</span>
                    </h1>
                    <p className="hero-subtitle">
                        แพลตฟอร์มรวมศูนย์สำหรับแหล่งเรียนรู้ Prompt สำเร็จรูป และเครื่องมือช่วยเรียน
                        ทุกอย่างที่คุณต้องการ อยู่ในที่เดียว
                    </p>
                    <SearchBar large autoFocus />
                    <div className="hero-stats">
                        <div className="hero-stat">
                            <strong>{prompts.length}+</strong>
                            <span>Prompt</span>
                        </div>
                        <div className="hero-stat-sep" />
                        <div className="hero-stat">
                            <strong>{subjectsList.length}</strong>
                            <span>วิชา</span>
                        </div>
                        <div className="hero-stat-sep" />
                        <div className="hero-stat">
                            <strong>{tools.length}</strong>
                            <span>เครื่องมือ</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Access */}
            <section className="section" id="quick-access">
                <div className="container">
                    <h2 className="section-title">เข้าถึงด่วน</h2>
                    <p className="section-subtitle">เข้าถึงทุกส่วนได้ในคลิกเดียว</p>
                    <div className="quick-access-grid">
                        {quickAccess.map(item => (
                            <Link key={item.label} to={item.link} className="quick-access-item card" id={`qa-${item.label}`}>
                                <div className="quick-access-icon" style={{ background: `${item.color}12`, color: item.color }}>
                                    <item.icon size={24} />
                                </div>
                                <span className="quick-access-label">{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Prompts */}
            <section className="section section-alt" id="featured-prompts">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">Prompt แนะนำ</h2>
                            <p className="section-subtitle">Prompt ยอดนิยม พร้อมคัดลอกไปใช้งาน</p>
                        </div>
                        <Link to="/prompts" className="btn btn-secondary">
                            ดูทั้งหมด <ArrowRight size={16} />
                        </Link>
                    </div>
                    <div className="prompt-scroll">
                        {featuredPrompts.map(p => (
                            <div key={p.id} className="prompt-scroll-item">
                                <PromptCard prompt={p} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Learning Categories */}
            <section className="section" id="learning-categories">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">หมวดหมู่การเรียน</h2>
                            <p className="section-subtitle">เรียกดูแหล่งเรียนรู้ตามวิชา</p>
                        </div>
                        <Link to="/learning" className="btn btn-secondary">
                            สำรวจ <ArrowRight size={16} />
                        </Link>
                    </div>
                    <div className="subjects-grid">
                        {subjectsList.map(s => (
                            <SubjectCard key={s.id} subject={s} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Study Tools */}
            <section className="section section-alt" id="study-tools">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">เครื่องมือการเรียน</h2>
                            <p className="section-subtitle">เครื่องมือเพิ่มประสิทธิภาพการเรียนของคุณ</p>
                        </div>
                        <Link to="/tools" className="btn btn-secondary">
                            ทั้งหมด <ArrowRight size={16} />
                        </Link>
                    </div>
                    <div className="tools-grid">
                        {tools.map(t => (
                            <ToolCard key={t.id} tool={t} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Exam Mode Banner */}
            <section className="section" id="exam-banner">
                <div className="container">
                    <div className="exam-banner card">
                        <div className="exam-banner-content">
                            <span className="exam-banner-badge">
                                <GraduationCap size={16} /> เตรียมสอบ
                            </span>
                            <h2 className="exam-banner-title">พร้อมสอบหรือยัง?</h2>
                            <p className="exam-banner-desc">
                                เข้าถึงข้อสอบเก่า แบบทดสอบ และแบบฝึกหัด เข้าโหมดสอบเพื่อทบทวนอย่างมีสมาธิ
                            </p>
                            <Link to="/exam" className="btn btn-primary btn-lg">
                                เข้าโซนสอบ <ArrowRight size={18} />
                            </Link>
                        </div>
                        <div className="exam-banner-visual">
                            <div className="exam-visual-card">
                                <div className="exam-visual-line" />
                                <div className="exam-visual-line exam-visual-line-short" />
                                <div className="exam-visual-check">✓</div>
                            </div>
                            <div className="exam-visual-card exam-visual-card-2">
                                <div className="exam-visual-line" />
                                <div className="exam-visual-line exam-visual-line-short" />
                                <div className="exam-visual-check">✓</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* What's New */}
            <section className="section section-alt" id="whats-new">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">มีอะไรใหม่</h2>
                            <p className="section-subtitle">อัปเดตและเพิ่มเติมล่าสุด</p>
                        </div>
                        <Link to="/updates" className="btn btn-secondary">
                            ทั้งหมด <ArrowRight size={16} />
                        </Link>
                    </div>
                    <div className="whats-new-list">
                        {whatsNew.map(item => (
                            <Link key={item.id} to={item.link} className="whats-new-item card">
                                <div className={`whats-new-icon whats-new-icon--${item.type}`}>
                                    {typeIcons[item.type]}
                                </div>
                                <div className="whats-new-content">
                                    <h4 className="whats-new-title">{item.title}</h4>
                                    <p className="whats-new-desc">{item.description}</p>
                                </div>
                                <span className="whats-new-date">{item.date}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
