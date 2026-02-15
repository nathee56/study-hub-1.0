import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer" id="site-footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-about">
                        <div className="footer-brand">
                            <div className="footer-logo">
                                <img src="/logo.png" alt="StudyHub" style={{ width: 24, height: 24, objectFit: 'contain' }} />
                            </div>
                            <span className="footer-brand-name">StudyHub</span>
                        </div>
                        <p className="footer-desc">
                            แพลตฟอร์มการเรียนรู้แบบรวมศูนย์สำหรับนักเรียนนักศึกษา ค้นหาแหล่งเรียนรู้ ใช้ Prompt และจัดการการเรียน — ทุกอย่างในที่เดียว
                        </p>
                    </div>

                    <div className="footer-col">
                        <h4 className="footer-col-title">ลิงก์ด่วน</h4>
                        <Link to="/prompts" className="footer-link">คลัง Prompt</Link>
                        <Link to="/learning" className="footer-link">คลังความรู้</Link>
                        <Link to="/tools" className="footer-link">เครื่องมือการเรียน</Link>
                        <Link to="/exam" className="footer-link">โซนสอบ</Link>
                    </div>

                    <div className="footer-col">
                        <h4 className="footer-col-title">เพิ่มเติม</h4>
                        <Link to="/links" className="footer-link">ลิงก์การศึกษา</Link>
                        <Link to="/community" className="footer-link">ชุมชน</Link>
                        <Link to="/bookmarks" className="footer-link">บุ๊คมาร์คของฉัน</Link>
                        <Link to="/about" className="footer-link">เกี่ยวกับ</Link>
                        <Link to="/updates" className="footer-link">มีอะไรใหม่</Link>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© 2026 Student Learning Hub สร้างด้วย <Heart size={14} className="footer-heart" /> เพื่อนักเรียนทุกคน</p>
                </div>
            </div>
        </footer>
    );
}
