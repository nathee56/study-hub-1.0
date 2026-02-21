import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calculator, Plus, Trash2, RotateCcw, Target } from 'lucide-react';
import './GpaCalculator.css';

const GRADES = [
    { label: 'A', value: 4.0, color: '#10B981' },
    { label: 'B+', value: 3.5, color: '#34D399' },
    { label: 'B', value: 3.0, color: '#60A5FA' },
    { label: 'C+', value: 2.5, color: '#93C5FD' },
    { label: 'C', value: 2.0, color: '#F59E0B' },
    { label: 'D+', value: 1.5, color: '#FCD34D' },
    { label: 'D', value: 1.0, color: '#F97316' },
    { label: 'F', value: 0.0, color: '#EF4444' },
];

const defaultCourse = () => ({ id: Date.now().toString() + Math.random(), name: '', credits: 3, grade: 'A' });

export default function GpaCalculator() {
    const [courses, setCourses] = useState([defaultCourse(), defaultCourse(), defaultCourse()]);
    const [animatedGpa, setAnimatedGpa] = useState(0);

    const addCourse = () => setCourses(prev => [...prev, defaultCourse()]);

    const removeCourse = (id) => {
        if (courses.length <= 1) return;
        setCourses(prev => prev.filter(c => c.id !== id));
    };

    const updateCourse = (id, field, value) => {
        setCourses(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    const resetAll = () => setCourses([defaultCourse(), defaultCourse(), defaultCourse()]);

    // Calculate GPA
    const totalCredits = courses.reduce((sum, c) => sum + Number(c.credits), 0);
    const totalPoints = courses.reduce((sum, c) => {
        const gradeValue = GRADES.find(g => g.label === c.grade)?.value || 0;
        return sum + gradeValue * Number(c.credits);
    }, 0);
    const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
    const gpaProgress = (gpa / 4.0) * 100;

    // Animation Effect for GPA Number
    useEffect(() => {
        const target = parseFloat(gpa);
        let current = animatedGpa;
        const speed = 0.05;

        const tick = () => {
            if (Math.abs(target - current) > 0.01) {
                current += (target - current) * speed;
                setAnimatedGpa(current);
                requestAnimationFrame(tick);
            } else {
                setAnimatedGpa(target);
            }
        };
        const timer = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gpa]);

    const gpaColor = gpa >= 3.5 ? '#10B981' : gpa >= 2.5 ? '#F59E0B' : gpa >= 1.5 ? '#F97316' : '#EF4444';

    return (
        <div className="gpa-page section">
            <div className="container">
                <Link to="/tools" className="tool-back-link">
                    <ArrowLeft size={16} /> กลับไปเครื่องมือ
                </Link>

                <div className="gpa-wrapper">
                    <div className="gpa-header-text">
                        <h1 className="page-title text-2xl">เครื่องคิดเลข GPA อัจฉริยะ</h1>
                        <p className="text-muted">คำนวณเกรดเฉลี่ยรายภาคแบบเรียลไทม์ วางแผนเกรดที่ตั้งเป้าไว้ได้ง่ายๆ</p>
                    </div>

                    <div className="gpa-dashboard-layout">
                        {/* Result Chart Card */}
                        <div className="gpa-result-card card">
                            <h3 className="result-card-title"><Target size={18} /> ผลการเรียนสะสม</h3>

                            <div className="gpa-chart-container">
                                <svg viewBox="0 0 200 200" className="gpa-circular-chart">
                                    {/* Background Track */}
                                    <circle cx="100" cy="100" r="85" className="gpa-chart-bg" />
                                    {/* Progress Arc */}
                                    <circle
                                        cx="100" cy="100" r="85"
                                        className="gpa-chart-progress"
                                        stroke={gpaColor}
                                        strokeDasharray={`${2 * Math.PI * 85}`}
                                        strokeDashoffset={`${2 * Math.PI * 85 * (1 - gpaProgress / 100)}`}
                                    />
                                </svg>
                                <div className="gpa-inner-content">
                                    <div className="gpa-value-display" style={{ color: gpaColor }}>
                                        {animatedGpa.toFixed(2)}
                                    </div>
                                    <div className="gpa-max-value">/ 4.00</div>
                                </div>
                            </div>

                            <div className="gpa-stats-row">
                                <div className="gpa-stat-box">
                                    <span className="stat-label">หน่วยกิตรวม</span>
                                    <span className="stat-value">{totalCredits}</span>
                                </div>
                                <div className="gpa-stat-box">
                                    <span className="stat-label">แต้มสะสม</span>
                                    <span className="stat-value">{totalPoints.toFixed(1)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Courses List */}
                        <div className="gpa-courses card">
                            <div className="gpa-courses-header">
                                <h2 className="gpa-courses-title">รายวิชาเรียน</h2>
                                <button className="btn btn-secondary btn-sm" onClick={resetAll}>
                                    <RotateCcw size={14} /> เริ่มใหม่
                                </button>
                            </div>

                            <div className="gpa-table-header">
                                <span>ชื่อวิชา</span>
                                <span>หน่วยกิต</span>
                                <span>เกรด</span>
                                <span></span>
                            </div>

                            <div className="gpa-courses-list">
                                {courses.map((course) => (
                                    <div key={course.id} className="gpa-course-row">
                                        <div className="gpa-input-group">
                                            <input
                                                type="text"
                                                placeholder="ชื่อวิชา (ไม่บังคับ)"
                                                value={course.name}
                                                onChange={e => updateCourse(course.id, 'name', e.target.value)}
                                                className="gpa-course-name"
                                            />
                                        </div>
                                        <div className="gpa-select-wrapper">
                                            <select
                                                value={course.credits}
                                                onChange={e => updateCourse(course.id, 'credits', Number(e.target.value))}
                                                className="gpa-course-credits"
                                            >
                                                {[1, 2, 3, 4, 5, 6].map(c => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="gpa-select-wrapper">
                                            <select
                                                value={course.grade}
                                                onChange={e => updateCourse(course.id, 'grade', e.target.value)}
                                                className="gpa-course-grade"
                                                style={{
                                                    color: GRADES.find(g => g.label === course.grade)?.color,
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {GRADES.map(g => (
                                                    <option key={g.label} value={g.label}>{g.label} ({g.value.toFixed(1)})</option>
                                                ))}
                                            </select>
                                        </div>
                                        <button className="gpa-remove-btn" onClick={() => removeCourse(course.id)} title="ลบวิชานี้">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button className="gpa-add-btn" onClick={addCourse}>
                                <Plus size={18} /> <span>เพิ่มรายวิชา</span>
                            </button>
                        </div>
                    </div>

                    {/* Grade Scale */}
                    <div className="gpa-scale card">
                        <h3 className="gpa-scale-title">ระบบหน่วยกิตอ้างอิง</h3>
                        <div className="gpa-scale-grid">
                            {GRADES.map(g => (
                                <div key={g.label} className="gpa-scale-item" style={{ borderLeftColor: g.color }}>
                                    <span className="gpa-scale-label" style={{ color: g.color }}>{g.label}</span>
                                    <span className="gpa-scale-value">{g.value.toFixed(1)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
