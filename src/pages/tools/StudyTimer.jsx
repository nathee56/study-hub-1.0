import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCcw, SkipForward, Timer, Coffee, Maximize2, Minimize2, Volume2, VolumeX, CloudRain, Coffee as CafeIcon, PlayCircle } from 'lucide-react';
import './StudyTimer.css';

const AMBIENT_SOUNDS = [
    { id: 'rain', name: 'ฝนตก', icon: <CloudRain size={18} />, url: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_f5cd8867a5.mp3?filename=rain-and-thunder-16705.mp3' },
    { id: 'cafe', name: 'ร้านกาแฟ', icon: <CafeIcon size={18} />, url: 'https://cdn.pixabay.com/download/audio/2022/02/07/audio_03d93bfb5d.mp3?filename=cafe-background-noise-101150.mp3' },
    { id: 'lofi', name: 'Lo-Fi', icon: <PlayCircle size={18} />, url: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_12b0c7443c.mp3?filename=lofi-study-112191.mp3' }
];

export default function StudyTimer() {
    const [workMin, setWorkMin] = useState(25);
    const [breakMin, setBreakMin] = useState(5);
    const [seconds, setSeconds] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [isBreak, setIsBreak] = useState(false);
    const [sessions, setSessions] = useState(0);
    const [isFullScreen, setIsFullScreen] = useState(false);

    // Ambient Sound State
    const [activeSound, setActiveSound] = useState(null);
    const [volume, setVolume] = useState(0.5);
    const [isMuted, setIsMuted] = useState(false);

    const intervalRef = useRef(null);
    const audioElementRef = useRef(null);
    const timerContainerRef = useRef(null);

    const totalSeconds = isBreak ? breakMin * 60 : workMin * 60;
    const progress = ((totalSeconds - seconds) / totalSeconds) * 100;

    const playNotificationSound = useCallback(() => {
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
        } catch (error) {
            console.error('Audio playback error:', error);
        }
    }, []);

    // Timer Logic
    useEffect(() => {
        if (!isRunning) return;
        intervalRef.current = setInterval(() => {
            setSeconds(prev => {
                if (prev <= 0) {
                    playNotificationSound();
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
    }, [isRunning, isBreak, workMin, breakMin, playNotificationSound]);

    // Handle Ambient Sound changes
    useEffect(() => {
        if (!audioElementRef.current) {
            audioElementRef.current = new Audio();
            audioElementRef.current.loop = true;
        }

        const audio = audioElementRef.current;

        if (activeSound && !isMuted) {
            const sound = AMBIENT_SOUNDS.find(s => s.id === activeSound);
            if (sound && audio.src !== sound.url) {
                audio.src = sound.url;
            }
            audio.volume = volume;
            audio.play().catch(e => console.log('Audio play failed:', e));
        } else {
            audio.pause();
        }

        return () => {
            audio.pause();
        };
    }, [activeSound, volume, isMuted]);

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

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            timerContainerRef.current?.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
            setIsFullScreen(true);
        } else {
            document.exitFullscreen();
            setIsFullScreen(false);
        }
    };

    // Fullscreen event listener to sync state if exited via ESC
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

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

    const toggleSound = (id) => {
        if (activeSound === id) {
            setActiveSound(null);
        } else {
            setActiveSound(id);
            if (isMuted) setIsMuted(false);
        }
    };

    return (
        <div className={`timer-page section ${isFullScreen ? 'is-fullscreen' : ''}`} ref={timerContainerRef}>
            <div className="container">
                {!isFullScreen && (
                    <Link to="/tools" className="tool-back-link">
                        <ArrowLeft size={16} /> กลับไปเครื่องมือ
                    </Link>
                )}

                <div className="timer-wrapper">
                    <div className="timer-card card liquid-card">
                        {/* Header Actions */}
                        <div className="timer-header-actions">
                            <button className="timer-icon-btn" onClick={toggleFullScreen} title="เต็มจอ">
                                {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                            </button>
                        </div>

                        {/* Phase indicator */}
                        <div className={`timer-phase ${isBreak ? 'timer-phase--break' : 'timer-phase--work'}`}>
                            {isBreak ? <><Coffee size={18} /> พักผ่อน</> : <><Timer size={18} /> โฟกัสเต็มที่</>}
                        </div>

                        {/* Timer circle */}
                        <div className="timer-circle-wrapper">
                            <svg className="timer-circle" viewBox="0 0 200 200">
                                <defs>
                                    <linearGradient id="gradient-work" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#3B82F6" />
                                        <stop offset="100%" stopColor="#8B5CF6" />
                                    </linearGradient>
                                    <linearGradient id="gradient-break" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#10B981" />
                                        <stop offset="100%" stopColor="#34D399" />
                                    </linearGradient>
                                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                        <feGaussianBlur stdDeviation="8" result="blur" />
                                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                    </filter>
                                </defs>
                                <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="8" />
                                <circle
                                    cx="100" cy="100" r="90" fill="none"
                                    stroke={isBreak ? 'url(#gradient-break)' : 'url(#gradient-work)'}
                                    strokeWidth="8" strokeLinecap="round"
                                    strokeDasharray={`${2 * Math.PI * 90}`}
                                    strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
                                    filter="url(#glow)"
                                    style={{ transition: 'stroke-dashoffset 0.5s ease', transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                                />
                            </svg>
                            <div className="timer-display">
                                <span className="timer-time">{formatTime(seconds)}</span>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="timer-controls main-controls">
                            <button className="timer-btn timer-btn--secondary hover-scale" onClick={resetTimer} title="เริ่มใหม่">
                                <RotateCcw size={20} />
                            </button>
                            <button className={`timer-btn timer-btn--primary pulse-shadow ${isRunning ? 'timer-btn--pause' : ''}`} onClick={toggleTimer}>
                                {isRunning ? <Pause size={28} /> : <Play size={28} style={{ marginLeft: '4px' }} />}
                            </button>
                            <button className="timer-btn timer-btn--secondary hover-scale" onClick={skipPhase} title="ข้าม">
                                <SkipForward size={20} />
                            </button>
                        </div>

                        <div className="timer-sessions">
                            ทำภารกิจสำเร็จ: <strong>{sessions}</strong> รอบ
                        </div>

                        {/* Ambient Sounds Section */}
                        <div className="timer-ambient-section">
                            <div className="ambient-header">
                                <span className="ambient-title">บรรยากาศเสียง (Ambient)</span>
                                <button className="timer-icon-btn btn-sm" onClick={() => setIsMuted(!isMuted)}>
                                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                                </button>
                            </div>
                            <div className="ambient-sounds-list">
                                {AMBIENT_SOUNDS.map(sound => (
                                    <button
                                        key={sound.id}
                                        className={`ambient-sound-btn ${activeSound === sound.id ? 'active' : ''}`}
                                        onClick={() => toggleSound(sound.id)}
                                    >
                                        {sound.icon}
                                        <span>{sound.name}</span>
                                    </button>
                                ))}
                            </div>
                            {activeSound && !isMuted && (
                                <div className="ambient-volume-slider">
                                    <VolumeX size={14} className="text-muted" />
                                    <input
                                        type="range"
                                        min="0" max="1" step="0.05"
                                        value={volume}
                                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                                        className="volume-range"
                                    />
                                    <Volume2 size={14} className="text-muted" />
                                </div>
                            )}
                        </div>

                        {/* Settings */}
                        {!isFullScreen && (
                            <div className="timer-settings fade-in">
                                <div className="timer-setting">
                                    <label>โฟกัส (นาที)</label>
                                    <div className="timer-setting-controls">
                                        <button className="hover-scale" onClick={() => handleWorkChange(Math.max(1, workMin - 5))}>−</button>
                                        <span>{workMin}</span>
                                        <button className="hover-scale" onClick={() => handleWorkChange(Math.min(120, workMin + 5))}>+</button>
                                    </div>
                                </div>
                                <div className="timer-setting">
                                    <label>พัก (นาที)</label>
                                    <div className="timer-setting-controls">
                                        <button className="hover-scale" onClick={() => handleBreakChange(Math.max(1, breakMin - 1))}>−</button>
                                        <span>{breakMin}</span>
                                        <button className="hover-scale" onClick={() => handleBreakChange(Math.min(30, breakMin + 1))}>+</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
