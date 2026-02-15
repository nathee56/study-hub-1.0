import { useState, useEffect, useRef } from 'react';
import { CheckCircle2, XCircle, Clock, ChevronRight, RotateCcw, Trophy, Target } from 'lucide-react';
import examData, { examSubjects } from '../data/examData';
import { useAuth } from '../context/AuthContext';
import { saveExamResult } from '../utils/firestoreHelpers';
import './ExamZone.css';

const PHASES = { SELECT: 'select', QUIZ: 'quiz', RESULT: 'result' };

export default function ExamZone() {
    const [phase, setPhase] = useState(PHASES.SELECT);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [questions, setQuestions] = useState([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showExplanation, setShowExplanation] = useState(false);
    const [timer, setTimer] = useState(0);
    const [saved, setSaved] = useState(false);
    const timerRef = useRef(null);
    const { user } = useAuth();

    const startQuiz = (subject) => {
        const qs = subject
            ? examData.filter(q => q.subject === subject)
            : [...examData].sort(() => Math.random() - 0.5).slice(0, 10);
        setQuestions(qs);
        setSelectedSubject(subject || 'ทุกวิชา');
        setCurrentQ(0);
        setAnswers({});
        setShowExplanation(false);
        setTimer(0);
        setSaved(false);
        setPhase(PHASES.QUIZ);
    };

    // Timer
    useEffect(() => {
        if (phase === PHASES.QUIZ) {
            timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [phase]);

    const selectAnswer = (qIndex, choiceIndex) => {
        if (answers[qIndex] !== undefined) return;
        setAnswers(prev => ({ ...prev, [qIndex]: choiceIndex }));
        setShowExplanation(true);
    };

    const nextQuestion = () => {
        setShowExplanation(false);
        if (currentQ < questions.length - 1) {
            setCurrentQ(currentQ + 1);
        } else {
            clearInterval(timerRef.current);
            setPhase(PHASES.RESULT);
        }
    };

    const formatTimer = (s) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    };

    // Calculate results
    const score = questions.reduce((sum, q, i) => sum + (answers[i] === q.answer ? 1 : 0), 0);
    const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

    // Save exam result to Firestore when entering RESULT phase
    useEffect(() => {
        if (phase === PHASES.RESULT && user && !saved) {
            saveExamResult(user.uid, {
                subject: selectedSubject,
                score,
                total: questions.length,
                percentage,
                timeSpent: timer,
            });
            setSaved(true);
        }
    }, [phase, user, saved]);

    // ===== SELECT PHASE =====
    if (phase === PHASES.SELECT) {
        return (
            <div className="exam-page section">
                <div className="container">
                    <div className="exam-select-header">
                        <h1 className="page-title">🎯 โซนสอบ</h1>
                        <p className="page-subtitle">
                            ทดสอบความรู้ของคุณ เลือกวิชาแล้วเริ่มทำแบบทดสอบได้เลย
                        </p>
                    </div>

                    <div className="exam-subject-grid">
                        <button className="exam-subject-card card" onClick={() => startQuiz('')}>
                            <div className="exam-subject-icon" style={{ background: '#DBEAFE', color: '#2563EB' }}>
                                <Target size={28} />
                            </div>
                            <h3>สุ่มจากทุกวิชา</h3>
                            <p>{examData.length} ข้อ</p>
                        </button>
                        {examSubjects.map(subject => {
                            const count = examData.filter(q => q.subject === subject).length;
                            return (
                                <button key={subject} className="exam-subject-card card" onClick={() => startQuiz(subject)}>
                                    <div className="exam-subject-icon" style={{ background: '#EDE9FE', color: '#7C3AED' }}>
                                        <Target size={28} />
                                    </div>
                                    <h3>{subject}</h3>
                                    <p>{count} ข้อ</p>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    // ===== QUIZ PHASE =====
    if (phase === PHASES.QUIZ) {
        const q = questions[currentQ];
        const userAnswer = answers[currentQ];
        const isAnswered = userAnswer !== undefined;
        const isCorrect = userAnswer === q.answer;

        return (
            <div className="exam-page section">
                <div className="container">
                    <div className="quiz-wrapper">
                        <div className="quiz-topbar">
                            <span className="quiz-subject-badge">{selectedSubject}</span>
                            <span className="quiz-timer"><Clock size={14} /> {formatTimer(timer)}</span>
                        </div>

                        {/* Progress */}
                        <div className="quiz-progress">
                            <div className="quiz-progress-bar">
                                <div className="quiz-progress-fill" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
                            </div>
                            <span className="quiz-progress-text">ข้อ {currentQ + 1} / {questions.length}</span>
                        </div>

                        {/* Question */}
                        <div className="quiz-question card">
                            <h2 className="quiz-question-text">{q.question}</h2>

                            <div className="quiz-choices">
                                {q.choices.map((choice, i) => {
                                    let cls = 'quiz-choice';
                                    if (isAnswered) {
                                        if (i === q.answer) cls += ' quiz-choice--correct';
                                        else if (i === userAnswer && !isCorrect) cls += ' quiz-choice--wrong';
                                        else cls += ' quiz-choice--disabled';
                                    }
                                    return (
                                        <button
                                            key={i}
                                            className={cls}
                                            onClick={() => selectAnswer(currentQ, i)}
                                            disabled={isAnswered}
                                        >
                                            <span className="quiz-choice-letter">{String.fromCharCode(65 + i)}</span>
                                            <span className="quiz-choice-text">{choice}</span>
                                            {isAnswered && i === q.answer && <CheckCircle2 size={18} className="quiz-choice-icon" />}
                                            {isAnswered && i === userAnswer && !isCorrect && i !== q.answer && <XCircle size={18} className="quiz-choice-icon" />}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Explanation */}
                            {showExplanation && (
                                <div className={`quiz-explanation ${isCorrect ? 'quiz-explanation--correct' : 'quiz-explanation--wrong'}`}>
                                    <p><strong>{isCorrect ? '✅ ถูกต้อง!' : '❌ ไม่ถูก'}</strong></p>
                                    <p>{q.explanation}</p>
                                </div>
                            )}

                            {isAnswered && (
                                <button className="btn btn-primary quiz-next-btn" onClick={nextQuestion}>
                                    {currentQ < questions.length - 1 ? <>ข้อต่อไป <ChevronRight size={16} /></> : 'ดูผลลัพธ์ 🎉'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ===== RESULT PHASE =====
    return (
        <div className="exam-page section">
            <div className="container">
                <div className="result-wrapper">
                    <div className="result-card card">
                        <div className="result-trophy">
                            <Trophy size={48} />
                        </div>
                        <h1 className="result-title">ผลการทดสอบ</h1>
                        <div className="result-score" style={{
                            color: percentage >= 80 ? '#10B981' : percentage >= 50 ? '#F59E0B' : '#EF4444'
                        }}>
                            {score}/{questions.length}
                        </div>
                        <div className="result-percentage">{percentage}%</div>
                        <div className="result-time">
                            <Clock size={14} /> เวลาที่ใช้: {formatTimer(timer)}
                        </div>

                        {saved && (
                            <div className="result-saved-badge">
                                <CheckCircle2 size={14} /> บันทึกผลเรียบร้อย
                            </div>
                        )}

                        <div className="result-msg">
                            {percentage >= 80 ? '🌟 ยอดเยี่ยม! คุณเข้าใจเนื้อหาดีมาก' :
                                percentage >= 50 ? '👍 ดีมาก! ลองทบทวนหัวข้อที่ผิดอีกครั้ง' :
                                    '💪 ไม่ต้องท้อ! ลองทบทวนเนื้อหาแล้วทำใหม่'}
                        </div>

                        <div className="result-actions">
                            <button className="btn btn-primary" onClick={() => startQuiz(selectedSubject === 'ทุกวิชา' ? '' : selectedSubject)}>
                                <RotateCcw size={16} /> ทำอีกครั้ง
                            </button>
                            <button className="btn btn-secondary" onClick={() => setPhase(PHASES.SELECT)}>
                                เลือกวิชาใหม่
                            </button>
                        </div>
                    </div>

                    {/* Review wrong answers */}
                    <div className="result-review">
                        <h3 className="result-review-title">ทบทวนคำตอบ</h3>
                        {questions.map((q, i) => {
                            const correct = answers[i] === q.answer;
                            return (
                                <div key={q.id} className={`result-review-item card ${correct ? 'result-review--correct' : 'result-review--wrong'}`}>
                                    <div className="result-review-header">
                                        {correct ? <CheckCircle2 size={16} className="text-success" /> : <XCircle size={16} className="text-danger" />}
                                        <span>ข้อ {i + 1}</span>
                                    </div>
                                    <p className="result-review-question">{q.question}</p>
                                    {!correct && (
                                        <div className="result-review-answers">
                                            <p className="result-your-answer">คำตอบของคุณ: <strong>{q.choices[answers[i]]}</strong></p>
                                            <p className="result-correct-answer">คำตอบที่ถูก: <strong>{q.choices[q.answer]}</strong></p>
                                        </div>
                                    )}
                                    <p className="result-review-explanation">{q.explanation}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
