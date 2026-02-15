import { Link } from 'react-router-dom';
import { CheckSquare, Calendar, Calculator, Timer, StickyNote } from 'lucide-react';
import './ToolCard.css';

const toolIcons = { CheckSquare, Calendar, Calculator, Timer, StickyNote };

export default function ToolCard({ tool }) {
    const Icon = toolIcons[tool.icon];

    return (
        <Link to={tool.link} className="tool-card card" id={`tool-${tool.id}`}>
            <div className="tool-card-icon" style={{ background: `${tool.color}15`, color: tool.color }}>
                {Icon && <Icon size={24} />}
            </div>
            <h3 className="tool-card-title">{tool.title}</h3>
            <p className="tool-card-desc">{tool.description}</p>
        </Link>
    );
}
