import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
import { useScrollReveal, useMagneticEffect } from '../utils/animations';
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

    // Simulate App Loading for Skeleton Effect
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Mock a 1.2 second network payload before swapping to real data
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    // Scroll reveal hooks for each section
    const { ref: qaRef, isRevealed: qaRevealed } = useScrollReveal();
    const { ref: featRef, isRevealed: featRevealed } = useScrollReveal();
    const { ref: learnRef, isRevealed: learnRevealed } = useScrollReveal();
    const { ref: toolRef, isRevealed: toolRevealed } = useScrollReveal();
    const { ref: examRef, isRevealed: examRevealed } = useScrollReveal();
    const { ref: newsRef, isRevealed: newsRevealed } = useScrollReveal();

    // Magnetic Button Ref
    const magneticBtnRef = useRef(null);
    useMagneticEffect(magneticBtnRef, 0.4);

    const fadeInUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <div className="home-page">
            {/* Hero */}
            <section className="hero-section" id="hero">
                <motion.div
                    className="container hero-content"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
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
                </motion.div>
            </section>

            {/* Quick Access */}
            <section className="section" id="quick-access">
                <motion.div
                    className="container"
                    ref={qaRef}
                    initial="hidden"
                    animate={qaRevealed ? "visible" : "hidden"}
                    variants={fadeInUp}
                >
                    <h2 className="section-title">เข้าถึงด่วน</h2>
                    <p className="section-subtitle">เข้าถึงทุกส่วนได้ในคลิกเดียว</p>
                    <div className="bento-grid">
                        {quickAccess.map((item, index) => {
                            // Creates an asymmetrical look (e.g. some boxes are wide span 8, some span 4)
                            const isWide = index === 0 || index === 3;
                            const itemClass = `quick-access-item card bento-item ${isWide ? 'wide' : ''}`;

                            return (
                                <Link key={item.label} to={item.link} className={itemClass} id={`qa-${item.label}`}>
                                    <div className="quick-access-icon" style={{ background: `${item.color}12`, color: item.color }}>
                                        <item.icon size={24} />
                                    </div>
                                    <span className="quick-access-label">{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </motion.div>
            </section>

            {/* Featured Prompts */}
            <section className="section section-alt" id="featured-prompts">
                <motion.div
                    className="container"
                    ref={featRef}
                    initial="hidden"
                    animate={featRevealed ? "visible" : "hidden"}
                    variants={fadeInUp}
                >
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
                        {isLoading
                            ? Array.from({ length: 3 }).map((_, i) => (
                                <div key={`skeleton-prompt-${i}`} className="prompt-scroll-item">
                                    <div className="card skeleton" style={{ height: '180px', width: '300px' }}>
                                        <div className="skeleton-title" style={{ width: '50%', margin: '20px' }} />
                                        <div className="skeleton-text" style={{ width: '80%', margin: '0 20px 10px' }} />
                                        <div className="skeleton-text" style={{ width: '60%', margin: '0 20px' }} />
                                    </div>
                                </div>
                            ))
                            : featuredPrompts.map(p => (
                                <div key={p.id} className="prompt-scroll-item">
                                    <PromptCard prompt={p} />
                                </div>
                            ))
                        }
                    </div>
                </motion.div>
            </section>

            {/* Learning Categories */}
            <section className="section" id="learning-categories">
                <motion.div
                    className="container"
                    ref={learnRef}
                    initial="hidden"
                    animate={learnRevealed ? "visible" : "hidden"}
                    variants={fadeInUp}
                >
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">หมวดหมู่การเรียน</h2>
                            <p className="section-subtitle">เรียกดูแหล่งเรียนรู้ตามวิชา</p>
                        </div>
                        <Link to="/learning" className="btn btn-secondary">
                            สำรวจ <ArrowRight size={16} />
                        </Link>
                    </div>
                    <div className="marquee-container">
                        <div className="marquee-track">
                            {isLoading
                                ? Array.from({ length: 8 }).map((_, i) => (
                                    <div key={`skeleton-subject-${i}`} className="card skeleton" style={{ height: '140px', width: '250px', flexShrink: 0 }}>
                                        <div className="skeleton-avatar" style={{ margin: '20px' }} />
                                        <div className="skeleton-text" style={{ width: '60%', margin: '0 20px 10px' }} />
                                        <div className="skeleton-text" style={{ width: '40%', margin: '0 20px' }} />
                                    </div>
                                ))
                                : [...subjectsList, ...subjectsList].map((s, idx) => (
                                    <div key={`${s.id}-${idx}`} style={{ width: '250px', flexShrink: 0 }}>
                                        <SubjectCard subject={s} />
                                    </div>
                                ))}
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Study Tools */}
            <section className="section section-alt" id="study-tools">
                <motion.div
                    className="container"
                    ref={toolRef}
                    initial="hidden"
                    animate={toolRevealed ? "visible" : "hidden"}
                    variants={fadeInUp}
                >
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">เครื่องมือการเรียน</h2>
                            <p className="section-subtitle">เครื่องมือเพิ่มประสิทธิภาพการเรียนของคุณ</p>
                        </div>
                        <Link to="/tools" className="btn btn-secondary">
                            ทั้งหมด <ArrowRight size={16} />
                        </Link>
                    </div>
                    <div className="marquee-container">
                        <div className="marquee-track" style={{ animationDirection: 'reverse' }}>
                            {isLoading
                                ? Array.from({ length: 8 }).map((_, i) => (
                                    <div key={`skeleton-tool-${i}`} className="card skeleton" style={{ height: '120px', width: '300px', flexShrink: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', padding: '20px' }}>
                                            <div className="skeleton-avatar" style={{ width: '40px', height: '40px', marginRight: '15px' }} />
                                            <div style={{ flex: 1 }}>
                                                <div className="skeleton-text" style={{ width: '70%', marginBottom: '8px' }} />
                                                <div className="skeleton-text" style={{ width: '50%' }} />
                                            </div>
                                        </div>
                                    </div>
                                ))
                                : [...tools, ...tools].map((t, idx) => (
                                    <div key={`${t.id}-${idx}`} style={{ width: '300px', flexShrink: 0 }}>
                                        <ToolCard tool={t} />
                                    </div>
                                ))}
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Exam Mode Banner */}
            <section className="section" id="exam-banner">
                <motion.div
                    className="container"
                    ref={examRef}
                    initial="hidden"
                    animate={examRevealed ? "visible" : "hidden"}
                    variants={fadeInUp}
                >
                    <div className="exam-banner card">
                        <div className="exam-banner-content">
                            <span className="exam-banner-badge">
                                <GraduationCap size={16} /> เตรียมสอบ
                            </span>
                            <h2 className="exam-banner-title">พร้อมสอบหรือยัง?</h2>
                            <p className="exam-banner-desc">
                                เข้าถึงข้อสอบเก่า แบบทดสอบ และแบบฝึกหัด เข้าโหมดสอบเพื่อทบทวนอย่างมีสมาธิ
                            </p>
                            <Link to="/exam" className="btn btn-primary btn-lg magnetic-btn" ref={magneticBtnRef}>
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
                </motion.div>
            </section>

            {/* What's New */}
            <section className="section section-alt" id="whats-new">
                <motion.div
                    className="container"
                    ref={newsRef}
                    initial="hidden"
                    animate={newsRevealed ? "visible" : "hidden"}
                    variants={fadeInUp}
                >
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
                </motion.div>
            </section>
        </div>
    );
}
