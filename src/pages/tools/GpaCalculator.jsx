import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calculator, Plus, Trash2, RotateCcw } from 'lucide-react';
import './GpaCalculator.css';

const GRADES = [
    { label: 'A', value: 4.0 },
    { label: 'B+', value: 3.5 },
    { label: 'B', value: 3.0 },
    { label: 'C+', value: 2.5 },
    { label: 'C', value: 2.0 },
    { label: 'D+', value: 1.5 },
    { label: 'D', value: 1.0 },
    { label: 'F', value: 0.0 },
];

const defaultCourse = () => ({ id: Date.now().toString(), name: '', credits: 3, grade: 'A' });

export default function GpaCalculator() {
    const [courses, setCourses] = useState([defaultCourse(), defaultCourse(), defaultCourse()]);

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

    const gpaColor = gpa >= 3.5 ? '#10B981' : gpa >= 2.5 ? '#F59E0B' : gpa >= 1.5 ? '#F97316' : '#EF4444';

    return (
        <div className="gpa-page section">
            <div className="container">
                <Link to="/tools" className="tool-back-link">
                    <ArrowLeft size={16} /> กลับไปเครื่องมือ
                </Link>

                <div className="gpa-wrapper">
                    {/* Result Card */}
                    <div className="gpa-result-card card">
                        <div className="gpa-result-icon">
                            <Calculator size={24} />
                        </div>
                        <div className="gpa-result-value" style={{ color: gpaColor }}>{gpa}</div>
                        <div className="gpa-result-label">เกรดเฉลี่ย (GPA)</div>
                        <div className="gpa-result-credits">{totalCredits} หน่วยกิต</div>
                    </div>

                    {/* Courses */}
                    <div className="gpa-courses card">
                        <div className="gpa-courses-header">
                            <h2 className="gpa-courses-title">รายวิชา</h2>
                            <button className="btn btn-secondary btn-sm" onClick={resetAll}>
                                <RotateCcw size={14} /> รีเซ็ต
                            </button>
                        </div>

                        <div className="gpa-table-header">
                            <span>ชื่อวิชา</span>
                            <span>หน่วยกิต</span>
                            <span>เกรด</span>
                            <span></span>
                        </div>

                        {courses.map((course) => (
                            <div key={course.id} className="gpa-course-row">
                                <input
                                    type="text"
                                    placeholder="ชื่อวิชา"
                                    value={course.name}
                                    onChange={e => updateCourse(course.id, 'name', e.target.value)}
                                    className="gpa-course-name"
                                />
                                <select
                                    value={course.credits}
                                    onChange={e => updateCourse(course.id, 'credits', Number(e.target.value))}
                                    className="gpa-course-credits"
                                >
                                    {[1, 2, 3, 4, 5, 6].map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                                <select
                                    value={course.grade}
                                    onChange={e => updateCourse(course.id, 'grade', e.target.value)}
                                    className="gpa-course-grade"
                                >
                                    {GRADES.map(g => (
                                        <option key={g.label} value={g.label}>{g.label} ({g.value.toFixed(1)})</option>
                                    ))}
                                </select>
                                <button className="gpa-remove-btn" onClick={() => removeCourse(course.id)}>
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}

                        <button className="gpa-add-btn" onClick={addCourse}>
                            <Plus size={16} /> เพิ่มวิชา
                        </button>
                    </div>

                    {/* Grade Scale */}
                    <div className="gpa-scale card">
                        <h3 className="gpa-scale-title">ตารางเกรด</h3>
                        <div className="gpa-scale-grid">
                            {GRADES.map(g => (
                                <div key={g.label} className="gpa-scale-item">
                                    <span className="gpa-scale-label">{g.label}</span>
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
