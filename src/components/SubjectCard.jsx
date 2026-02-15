import { Link } from 'react-router-dom';
import { iconMap } from '../data/subjects';
import './SubjectCard.css';

export default function SubjectCard({ subject }) {
    const IconComponent = iconMap[subject.icon];

    return (
        <Link to={subject.link} className="subject-card card" id={`subject-${subject.id}`}>
            <div className="subject-card-icon" style={{ background: subject.bgColor, color: subject.color }}>
                {IconComponent && <IconComponent size={28} />}
            </div>
            <div className="subject-card-content">
                <h3 className="subject-card-title">{subject.title}</h3>
                <p className="subject-card-desc">{subject.description}</p>
                <span className="subject-card-count">{subject.itemCount} แหล่งเรียนรู้</span>
            </div>
        </Link>
    );
}
