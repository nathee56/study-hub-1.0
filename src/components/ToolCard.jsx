import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, Calendar, Calculator, Timer, StickyNote } from 'lucide-react';
import { useTiltEffect } from '../utils/animations';
import './ToolCard.css';

const toolIcons = { CheckSquare, Calendar, Calculator, Timer, StickyNote };

export default function ToolCard({ tool }) {
    const Icon = toolIcons[tool.icon];
    const cardRef = useRef(null);

    // Apply 3D hover physics
    useTiltEffect(cardRef, { max: 10, perspective: 1000, scale: 1.03 });

    return (
        <Link to={tool.link} className="tool-card card" id={`tool-${tool.id}`} ref={cardRef} style={{ position: 'relative', overflow: 'hidden' }}>
            <div className="tilt-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className="tilt-glare" style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none', transition: 'opacity 0.4s ease', opacity: 0 }} />

                <div className="tool-card-icon" style={{ background: `${tool.color}15`, color: tool.color }}>
                    {Icon && <Icon size={24} />}
                </div>
                <h3 className="tool-card-title">{tool.title}</h3>
                <p className="tool-card-desc">{tool.description}</p>
            </div>
        </Link>
    );
}
