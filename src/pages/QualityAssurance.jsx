import { useState, useRef } from 'react';
import { Upload, FileText, FileSpreadsheet, CheckCircle2, X, ShieldCheck } from 'lucide-react';
import './QualityAssurance.css';

export default function QualityAssurance() {
    const [wordFile, setWordFile] = useState(null);
    const [excelFile, setExcelFile] = useState(null);
    const [wordSubmitted, setWordSubmitted] = useState(false);
    const [excelSubmitted, setExcelSubmitted] = useState(false);
    const wordInputRef = useRef(null);
    const excelInputRef = useRef(null);

    const handleWordSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setWordFile(file);
            setWordSubmitted(false);
        }
    };

    const handleExcelSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setExcelFile(file);
            setExcelSubmitted(false);
        }
    };

    const handleWordSubmit = () => {
        if (wordFile) {
            setWordSubmitted(true);
        }
    };

    const handleExcelSubmit = () => {
        if (excelFile) {
            setExcelSubmitted(true);
        }
    };

    const handleWordRemove = () => {
        setWordFile(null);
        setWordSubmitted(false);
        if (wordInputRef.current) wordInputRef.current.value = '';
    };

    const handleExcelRemove = () => {
        setExcelFile(null);
        setExcelSubmitted(false);
        if (excelInputRef.current) excelInputRef.current.value = '';
    };

    const formatSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(1) + ' MB';
    };

    return (
        <div className="qa-page section">
            <div className="container">
                {/* Header */}
                <div className="qa-header">
                    <div className="qa-header-icon">
                        <ShieldCheck size={36} />
                    </div>
                    <h1 className="section-title">ส่งงานสอบประกันคุณภาพ</h1>
                    <p className="section-subtitle">อัปโหลดไฟล์เอกสาร Word และ Excel สำหรับการสอบประกันคุณภาพ</p>
                </div>

                <div className="qa-upload-grid">
                    {/* Word Upload Card */}
                    <div className={`qa-upload-card card ${wordSubmitted ? 'qa-upload-card--submitted' : ''}`}>
                        <div className="qa-upload-card-header">
                            <div className="qa-upload-icon qa-upload-icon--word">
                                <FileText size={28} />
                            </div>
                            <div>
                                <h2 className="qa-upload-title">ไฟล์ Word</h2>
                                <p className="qa-upload-desc">รองรับไฟล์ .doc, .docx</p>
                            </div>
                        </div>

                        {wordSubmitted ? (
                            <div className="qa-submitted">
                                <div className="qa-submitted-icon">
                                    <CheckCircle2 size={48} />
                                </div>
                                <p className="qa-submitted-text">ส่งไฟล์แล้ว!</p>
                                <p className="qa-submitted-filename">{wordFile?.name}</p>
                                <button className="btn btn-ghost qa-resubmit-btn" onClick={handleWordRemove}>
                                    ส่งใหม่
                                </button>
                            </div>
                        ) : (
                            <div className="qa-upload-body">
                                <input
                                    type="file"
                                    ref={wordInputRef}
                                    accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    onChange={handleWordSelect}
                                    className="qa-file-input"
                                    id="word-file-input"
                                />
                                {!wordFile ? (
                                    <label htmlFor="word-file-input" className="qa-dropzone">
                                        <Upload size={32} className="qa-dropzone-icon" />
                                        <span className="qa-dropzone-text">คลิกเพื่อเลือกไฟล์ Word</span>
                                        <span className="qa-dropzone-hint">.doc, .docx</span>
                                    </label>
                                ) : (
                                    <div className="qa-file-preview">
                                        <div className="qa-file-info">
                                            <FileText size={20} />
                                            <div>
                                                <p className="qa-file-name">{wordFile.name}</p>
                                                <p className="qa-file-size">{formatSize(wordFile.size)}</p>
                                            </div>
                                        </div>
                                        <button className="qa-file-remove" onClick={handleWordRemove} aria-label="ลบไฟล์">
                                            <X size={18} />
                                        </button>
                                    </div>
                                )}
                                <button
                                    className={`btn btn-primary qa-submit-btn ${!wordFile ? 'qa-submit-btn--disabled' : ''}`}
                                    onClick={handleWordSubmit}
                                    disabled={!wordFile}
                                >
                                    <Upload size={18} />
                                    ส่งไฟล์ Word
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Excel Upload Card */}
                    <div className={`qa-upload-card card ${excelSubmitted ? 'qa-upload-card--submitted' : ''}`}>
                        <div className="qa-upload-card-header">
                            <div className="qa-upload-icon qa-upload-icon--excel">
                                <FileSpreadsheet size={28} />
                            </div>
                            <div>
                                <h2 className="qa-upload-title">ไฟล์ Excel</h2>
                                <p className="qa-upload-desc">รองรับไฟล์ .xls, .xlsx</p>
                            </div>
                        </div>

                        {excelSubmitted ? (
                            <div className="qa-submitted">
                                <div className="qa-submitted-icon">
                                    <CheckCircle2 size={48} />
                                </div>
                                <p className="qa-submitted-text">ส่งไฟล์แล้ว!</p>
                                <p className="qa-submitted-filename">{excelFile?.name}</p>
                                <button className="btn btn-ghost qa-resubmit-btn" onClick={handleExcelRemove}>
                                    ส่งใหม่
                                </button>
                            </div>
                        ) : (
                            <div className="qa-upload-body">
                                <input
                                    type="file"
                                    ref={excelInputRef}
                                    accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    onChange={handleExcelSelect}
                                    className="qa-file-input"
                                    id="excel-file-input"
                                />
                                {!excelFile ? (
                                    <label htmlFor="excel-file-input" className="qa-dropzone">
                                        <Upload size={32} className="qa-dropzone-icon" />
                                        <span className="qa-dropzone-text">คลิกเพื่อเลือกไฟล์ Excel</span>
                                        <span className="qa-dropzone-hint">.xls, .xlsx</span>
                                    </label>
                                ) : (
                                    <div className="qa-file-preview">
                                        <div className="qa-file-info">
                                            <FileSpreadsheet size={20} />
                                            <div>
                                                <p className="qa-file-name">{excelFile.name}</p>
                                                <p className="qa-file-size">{formatSize(excelFile.size)}</p>
                                            </div>
                                        </div>
                                        <button className="qa-file-remove" onClick={handleExcelRemove} aria-label="ลบไฟล์">
                                            <X size={18} />
                                        </button>
                                    </div>
                                )}
                                <button
                                    className={`btn btn-primary qa-submit-btn ${!excelFile ? 'qa-submit-btn--disabled' : ''}`}
                                    onClick={handleExcelSubmit}
                                    disabled={!excelFile}
                                >
                                    <Upload size={18} />
                                    ส่งไฟล์ Excel
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Note */}
                <div className="qa-note">
                    <p>📌 หมายเหตุ: หน้านี้เป็นตัวทดลอง ไฟล์จะไม่ถูกอัปโหลดไปเก็บไว้ที่ใด</p>
                </div>
            </div>
        </div>
    );
}
