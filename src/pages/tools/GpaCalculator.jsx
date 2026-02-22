import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, RotateCcw, Target, BarChart2 } from 'lucide-react';
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

    // Calculate Grade Distribution
    const gradeDistribution = GRADES.map(g => {
        const count = courses.filter(c => c.grade === g.label).length;
        return { ...g, count };
    });
    const maxGradeCount = Math.max(...gradeDistribution.map(g => g.count), 1); // Avoid division by zero

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
                        <h1 className="page-title text-2xl">เครื่องคิดเลข GPA 3D</h1>
                        <p className="text-muted">คำนวณและวิเคราะห์เกรดของคุณแบบเรียลไทม์ ด้วยกราฟิก 3 มิติ</p>
                    </div>

                    <div className="gpa-dashboard-layout">
                        {/* Result Chart Card */}
                        <div className="gpa-charts-column">
                            <div className="gpa-result-card liquid-card">
                                <h3 className="result-card-title"><Target size={18} /> เกรดเฉลี่ยสะสม</h3>

                                <div className="gpa-chart-container">
                                    <div className="gpa-chart-3d-shadow"></div>
                                    <svg viewBox="0 0 200 200" className="gpa-circular-chart">
                                        <defs>
                                            <linearGradient id="gpaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor={gpaColor} />
                                                <stop offset="100%" stopColor={gpaColor} stopOpacity="0.5" />
                                            </linearGradient>
                                            <filter id="glow">
                                                <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                                                <feMerge>
                                                    <feMergeNode in="coloredBlur" />
                                                    <feMergeNode in="SourceGraphic" />
                                                </feMerge>
                                            </filter>
                                        </defs>

                                        {/* Background Track 3D effect */}
                                        <circle cx="100" cy="100" r="85" className="gpa-chart-bg-inner" />
                                        <circle cx="100" cy="100" r="85" className="gpa-chart-bg" />

                                        {/* Progress Arc */}
                                        <circle
                                            cx="100" cy="100" r="85"
                                            className="gpa-chart-progress"
                                            stroke="url(#gpaGradient)"
                                            filter="url(#glow)"
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
                                    <div className="gpa-stat-box glass-stat">
                                        <span className="stat-label">หน่วยกิตรวม</span>
                                        <span className="stat-value">{totalCredits}</span>
                                    </div>
                                    <div className="gpa-stat-box glass-stat">
                                        <span className="stat-label">แต้มสะสม</span>
                                        <span className="stat-value">{totalPoints.toFixed(1)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Distribution Bar Chart */}
                            <div className="gpa-distribution-card liquid-card mt-4">
                                <h3 className="result-card-title"><BarChart2 size={18} /> สัดส่วนเกรด</h3>
                                <div className="gpa-bar-chart">
                                    {gradeDistribution.map(g => (
                                        <div key={g.label} className="gpa-bar-item group">
                                            <div className="gpa-bar-label">{g.label}</div>
                                            <div className="gpa-bar-track">
                                                <div
                                                    className="gpa-bar-fill"
                                                    style={{
                                                        height: `${(g.count / maxGradeCount) * 100}%`,
                                                        backgroundColor: g.color
                                                    }}
                                                >
                                                    {g.count > 0 && <span className="gpa-bar-count">{g.count}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Courses List */}
                        <div className="gpa-courses liquid-card">
                            <div className="gpa-courses-header">
                                <h2 className="gpa-courses-title">รายวิชาเรียน</h2>
                                <button className="btn btn-secondary btn-sm glass-btn" onClick={resetAll}>
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
                                    <div key={course.id} className="gpa-course-row glass-row">
                                        <div className="gpa-input-group">
                                            <input
                                                type="text"
                                                placeholder="ชื่อวิชา (ไม่บังคับ)"
                                                value={course.name}
                                                onChange={e => updateCourse(course.id, 'name', e.target.value)}
                                                className="gpa-course-name glass-input"
                                            />
                                        </div>
                                        <div className="gpa-select-wrapper">
                                            <select
                                                value={course.credits}
                                                onChange={e => updateCourse(course.id, 'credits', Number(e.target.value))}
                                                className="gpa-course-credits glass-input"
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
                                                className="gpa-course-grade glass-input"
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
                    <div className="gpa-scale liquid-card">
                        <h3 className="gpa-scale-title">ระบบหน่วยกิตอ้างอิง</h3>
                        <div className="gpa-scale-grid">
                            {GRADES.map(g => (
                                <div key={g.label} className="gpa-scale-item glass-scale-item" style={{ borderLeftColor: g.color }}>
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
