import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { iconMap } from '../data/subjects';
import { useTiltEffect } from '../utils/animations';
import './SubjectCard.css';

export default function SubjectCard({ subject }) {
    const IconComponent = iconMap[subject.icon];
    const cardRef = useRef(null);

    // Apply the 3D hover physics
    useTiltEffect(cardRef, { max: 12, perspective: 1200, scale: 1.02 });

    return (
        <Link to={subject.link} className="subject-card card" id={`subject-${subject.id}`} ref={cardRef} style={{ position: 'relative', overflow: 'hidden' }}>
            <div className="tilt-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className="tilt-glare" style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none', transition: 'opacity 0.4s ease', opacity: 0 }} />

                <div className="subject-card-icon" style={{ background: subject.bgColor, color: subject.color }}>
                    {IconComponent && <IconComponent size={28} />}
                </div>
                <div className="subject-card-content">
                    <h3 className="subject-card-title">{subject.title}</h3>
                    <p className="subject-card-desc">{subject.description}</p>
                    <span className="subject-card-count">{subject.itemCount} แหล่งเรียนรู้</span>
                </div>
            </div>
        </Link>
    );
}
