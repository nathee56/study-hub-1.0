import { useState } from 'react';
import { X } from 'lucide-react';
import './MemorialPopup.css';

export default function MemorialPopup() {
    const [visible, setVisible] = useState(true);
    const [closing, setClosing] = useState(false);

    const handleClose = () => {
        setClosing(true);
        setTimeout(() => setVisible(false), 500);
    };

    if (!visible) return null;

    return (
        <div
            className={`memorial-overlay ${closing ? 'memorial-overlay--closing' : ''}`}
            onClick={handleClose}
        >
            <div className="memorial-content" onClick={e => e.stopPropagation()}>
                <img
                    src={`${import.meta.env.BASE_URL}memorial.png`}
                    alt="น้อมรำลึกในพระมหากรุณาธิคุณ"
                    className="memorial-image"
                />
                <button className="memorial-close" onClick={handleClose}>
                    <X size={16} />
                    ปิด
                </button>
            </div>
        </div>
    );
}
