import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCcw, SkipForward, Timer, Coffee } from 'lucide-react';
import './StudyTimer.css';

export default function StudyTimer() {
    const [workMin, setWorkMin] = useState(25);
    const [breakMin, setBreakMin] = useState(5);
    const [seconds, setSeconds] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [isBreak, setIsBreak] = useState(false);
    const [sessions, setSessions] = useState(0);
    const intervalRef = useRef(null);
    const audioRef = useRef(null);

    const totalSeconds = isBreak ? breakMin * 60 : workMin * 60;
    const progress = ((totalSeconds - seconds) / totalSeconds) * 100;

    const playSound = useCallback(() => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 800;
            gain.gain.value = 0.3;
            osc.start();
            setTimeout(() => { osc.stop(); ctx.close(); }, 300);
        } catch { }
    }, []);

    useEffect(() => {
        if (!isRunning) return;
        intervalRef.current = setInterval(() => {
            setSeconds(prev => {
                if (prev <= 0) {
                    playSound();
                    if (!isBreak) {
                        setSessions(s => s + 1);
                        setIsBreak(true);
                        return breakMin * 60;
                    } else {
                        setIsBreak(false);
                        return workMin * 60;
                    }
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(intervalRef.current);
    }, [isRunning, isBreak, workMin, breakMin, playSound]);

    const toggleTimer = () => setIsRunning(prev => !prev);

    const resetTimer = () => {
        setIsRunning(false);
        setIsBreak(false);
        setSeconds(workMin * 60);
    };

    const skipPhase = () => {
        if (!isBreak) setSessions(s => s + 1);
        setIsBreak(!isBreak);
        setSeconds(isBreak ? workMin * 60 : breakMin * 60);
    };

    const formatTime = (s) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    };

    const handleWorkChange = (val) => {
        setWorkMin(val);
        if (!isBreak && !isRunning) setSeconds(val * 60);
    };

    const handleBreakChange = (val) => {
        setBreakMin(val);
        if (isBreak && !isRunning) setSeconds(val * 60);
    };

    return (
        <div className="timer-page section">
            <div className="container">
                <Link to="/tools" className="tool-back-link">
                    <ArrowLeft size={16} /> กลับไปเครื่องมือ
                </Link>

                <div className="timer-wrapper">
                    <div className="timer-card card">
                        {/* Phase indicator */}
                        <div className={`timer-phase ${isBreak ? 'timer-phase--break' : ''}`}>
                            {isBreak ? <><Coffee size={18} /> พัก</> : <><Timer size={18} /> โฟกัส</>}
                        </div>

                        {/* Timer circle */}
                        <div className="timer-circle-wrapper">
                            <svg className="timer-circle" viewBox="0 0 200 200">
                                <circle cx="100" cy="100" r="90" fill="none" stroke="var(--color-border-light)" strokeWidth="6" />
                                <circle
                                    cx="100" cy="100" r="90" fill="none"
                                    stroke={isBreak ? '#10B981' : 'var(--color-primary)'}
                                    strokeWidth="6" strokeLinecap="round"
                                    strokeDasharray={`${2 * Math.PI * 90}`}
                                    strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
                                    style={{ transition: 'stroke-dashoffset 0.5s ease', transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                                />
                            </svg>
                            <div className="timer-display">
                                <span className="timer-time">{formatTime(seconds)}</span>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="timer-controls">
                            <button className="timer-btn timer-btn--secondary" onClick={resetTimer} title="รีเซ็ต">
                                <RotateCcw size={20} />
                            </button>
                            <button className={`timer-btn timer-btn--primary ${isRunning ? 'timer-btn--pause' : ''}`} onClick={toggleTimer}>
                                {isRunning ? <Pause size={24} /> : <Play size={24} />}
                            </button>
                            <button className="timer-btn timer-btn--secondary" onClick={skipPhase} title="ข้าม">
                                <SkipForward size={20} />
                            </button>
                        </div>

                        {/* Sessions */}
                        <div className="timer-sessions">
                            เซสชันที่เสร็จ: <strong>{sessions}</strong>
                        </div>

                        {/* Settings */}
                        <div className="timer-settings">
                            <div className="timer-setting">
                                <label>โฟกัส (นาที)</label>
                                <div className="timer-setting-controls">
                                    <button onClick={() => handleWorkChange(Math.max(1, workMin - 5))}>−</button>
                                    <span>{workMin}</span>
                                    <button onClick={() => handleWorkChange(Math.min(120, workMin + 5))}>+</button>
                                </div>
                            </div>
                            <div className="timer-setting">
                                <label>พัก (นาที)</label>
                                <div className="timer-setting-controls">
                                    <button onClick={() => handleBreakChange(Math.max(1, breakMin - 1))}>−</button>
                                    <span>{breakMin}</span>
                                    <button onClick={() => handleBreakChange(Math.min(30, breakMin + 1))}>+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
