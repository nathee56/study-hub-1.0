import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Trophy, BookOpen, FileText, CheckSquare, Clock, TrendingUp, Award, Calendar, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBookmarks } from '../context/BookmarkContext';
import { useNotes } from '../context/NotesContext';
import { useTodos } from '../context/TodoContext';
import { getExamHistory } from '../utils/firestoreHelpers';
import './Profile.css';

export default function Profile() {
    const { user, logout } = useAuth();
    const { bookmarks } = useBookmarks();
    const { notes } = useNotes();
    const { todos } = useTodos();
    const [examHistory, setExamHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }
        getExamHistory(user.uid).then(data => {
            setExamHistory(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
            setLoading(false);
        });
    }, [user, navigate]);

    if (!user) return null;

    const completedTodos = todos.filter(t => t.completed).length;
    const avgScore = examHistory.length > 0
        ? Math.round(examHistory.reduce((sum, r) => sum + r.percentage, 0) / examHistory.length)
        : 0;
    const bestScore = examHistory.length > 0
        ? Math.max(...examHistory.map(r => r.percentage))
        : 0;
    const totalQuizTime = examHistory.reduce((sum, r) => sum + (r.timeSpent || 0), 0);

    const formatTime = (s) => {
        if (s < 60) return `${s} วินาที`;
        const m = Math.floor(s / 60);
        if (m < 60) return `${m} นาที`;
        const h = Math.floor(m / 60);
        return `${h} ชั่วโมง ${m % 60} นาที`;
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const getScoreColor = (pct) => {
        if (pct >= 80) return '#10B981';
        if (pct >= 50) return '#F59E0B';
        return '#EF4444';
    };

    const getScoreLabel = (pct) => {
        if (pct >= 80) return 'ยอดเยี่ยม';
        if (pct >= 50) return 'ดี';
        return 'ต้องปรับปรุง';
    };

    return (
        <div className="profile-page section">
            <div className="container">
                {/* Profile Header */}
                <div className="profile-header card">
                    <div className="profile-header-bg" />
                    <div className="profile-header-content">
                        <div className="profile-avatar-wrapper">
                            {user.photoURL ? (
                                <img src={user.photoURL} alt={user.displayName} className="profile-avatar" />
                            ) : (
                                <div className="profile-avatar-fallback">
                                    <User size={40} />
                                </div>
                            )}
                        </div>
                        <div className="profile-info">
                            <h1 className="profile-name">{user.displayName || 'ผู้ใช้'}</h1>
                            <p className="profile-email">{user.email}</p>
                            <span className="profile-joined">
                                <Calendar size={14} />
                                เข้าร่วมเมื่อ {new Date(user.metadata?.creationTime).toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })}
                            </span>
                        </div>
                        <button className="btn btn-secondary profile-logout-btn" onClick={logout}>
                            <LogOut size={16} /> ออกจากระบบ
                        </button>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="profile-stats-grid">
                    <div className="profile-stat card">
                        <div className="profile-stat-icon" style={{ background: '#EFF6FF', color: '#2563EB' }}>
                            <BookOpen size={22} />
                        </div>
                        <div className="profile-stat-info">
                            <span className="profile-stat-value">{bookmarks.length}</span>
                            <span className="profile-stat-label">บุ๊คมาร์ค</span>
                        </div>
                    </div>
                    <div className="profile-stat card">
                        <div className="profile-stat-icon" style={{ background: '#FEF3C7', color: '#F59E0B' }}>
                            <FileText size={22} />
                        </div>
                        <div className="profile-stat-info">
                            <span className="profile-stat-value">{notes.length}</span>
                            <span className="profile-stat-label">โน้ต</span>
                        </div>
                    </div>
                    <div className="profile-stat card">
                        <div className="profile-stat-icon" style={{ background: '#D1FAE5', color: '#10B981' }}>
                            <CheckSquare size={22} />
                        </div>
                        <div className="profile-stat-info">
                            <span className="profile-stat-value">{completedTodos}/{todos.length}</span>
                            <span className="profile-stat-label">งานสำเร็จ</span>
                        </div>
                    </div>
                    <div className="profile-stat card">
                        <div className="profile-stat-icon" style={{ background: '#EDE9FE', color: '#7C3AED' }}>
                            <Trophy size={22} />
                        </div>
                        <div className="profile-stat-info">
                            <span className="profile-stat-value">{examHistory.length}</span>
                            <span className="profile-stat-label">ครั้งที่สอบ</span>
                        </div>
                    </div>
                </div>

                {/* Exam Performance */}
                {examHistory.length > 0 && (
                    <div className="profile-section">
                        <h2 className="profile-section-title">
                            <TrendingUp size={20} /> ผลสอบโดยรวม
                        </h2>
                        <div className="profile-exam-overview">
                            <div className="profile-exam-stat card">
                                <div className="profile-exam-circle" style={{ borderColor: getScoreColor(avgScore) }}>
                                    <span className="profile-exam-circle-value">{avgScore}%</span>
                                    <span className="profile-exam-circle-label">เฉลี่ย</span>
                                </div>
                            </div>
                            <div className="profile-exam-stat card">
                                <div className="profile-exam-circle" style={{ borderColor: getScoreColor(bestScore) }}>
                                    <span className="profile-exam-circle-value">{bestScore}%</span>
                                    <span className="profile-exam-circle-label">สูงสุด</span>
                                </div>
                            </div>
                            <div className="profile-exam-stat card">
                                <div className="profile-exam-circle" style={{ borderColor: '#3B82F6' }}>
                                    <span className="profile-exam-circle-value" style={{ fontSize: '1.25rem' }}>{formatTime(totalQuizTime)}</span>
                                    <span className="profile-exam-circle-label">เวลารวม</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Exam History */}
                <div className="profile-section">
                    <h2 className="profile-section-title">
                        <Award size={20} /> ประวัติการสอบ
                    </h2>

                    {loading ? (
                        <div className="profile-loading">กำลังโหลด...</div>
                    ) : examHistory.length === 0 ? (
                        <div className="profile-empty card">
                            <Trophy size={40} />
                            <p>ยังไม่มีประวัติการสอบ</p>
                            <a href="/exam" className="btn btn-primary">เริ่มทำข้อสอบ</a>
                        </div>
                    ) : (
                        <div className="profile-history-list">
                            {examHistory.map((result, idx) => (
                                <div key={result.id || idx} className="profile-history-item card">
                                    <div className="profile-history-left">
                                        <div className="profile-history-score" style={{ color: getScoreColor(result.percentage) }}>
                                            {result.percentage}%
                                        </div>
                                        <span className="profile-history-grade" style={{ background: `${getScoreColor(result.percentage)}15`, color: getScoreColor(result.percentage) }}>
                                            {getScoreLabel(result.percentage)}
                                        </span>
                                    </div>
                                    <div className="profile-history-detail">
                                        <span className="profile-history-subject">{result.subject}</span>
                                        <span className="profile-history-meta">
                                            {result.score}/{result.total} ข้อ • {result.timeSpent ? formatTime(result.timeSpent) : '-'}
                                        </span>
                                        <span className="profile-history-date">
                                            <Calendar size={12} /> {formatDate(result.date)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
