import React from 'react';
import { BookOpen, Monitor, FileText, Video, Award, Table, Info } from 'lucide-react';

function InfoIconComponent() { return <BookOpen size={20} />; }
function PaletteIconComponent() { return <Monitor size={20} />; }
function FileTextIconComponent() { return <FileText size={20} />; }
function TableIconComponent() { return <Table size={20} />; }

export const computerExamData = {
    title: "ติวสอบประกันคุณภาพคอมพิวเตอร์",
    description: "คอร์สติวเข้มสำหรับนักศึกษา เพื่อเตรียมความพร้อมสอบวัดมาตรฐานสมรรถนะเทคโนโลยีสารสนเทศ (Computer Competency Exam)",
    coverImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=2940",
    modules: [
        {
            id: 1,
            title: "แนะนำการสอบ & เกณฑ์การวัดผล",
            description: "ทำความเข้าใจโครงสร้างข้อสอบ เกณฑ์การสอบผ่าน และเทคนิคการทำข้อสอบ",
            icon: <InfoIconComponent />,
            duration: "15 นาที",
            content: [
                { type: 'pdf', title: 'คู่มือการสอบ.pdf', url: '#' },
                { type: 'video', title: 'แนะนำการสอบ (Video)', url: '#' }
            ]
        },
        {
            id: 2,
            title: "การใช้งาน Canva เพื่อการออกแบบ",
            description: "เรียนรู้การใช้งาน Canva เบื้องต้นจนถึงระดับสูงสำหรับการสร้างสื่อนำเสนอและกราฟิก",
            icon: <PaletteIconComponent />,
            duration: "2 ชั่วโมง",
            content: [
                { type: 'link', title: 'สไลด์ประกอบการสอน (Canva Slides)', url: 'https://www.canva.com/design/DAHBTWqE1rQ/RcT_KzAJtffqN1xsEkfk9g/view?utm_content=DAHBTWqE1rQ&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hdf6c972188', isExternal: true },
                { type: 'link', title: 'โจทย์แบบฝึกหัด (Canva Assignment)', url: 'https://www.canva.com/design/DAHBTVUKT2g/J5VgEOMuG0NSaVJR93WPIA/view?utm_content=DAHBTVUKT2g&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hc024cd23bc', isExternal: true }
            ]
        },
        {
            id: 3,
            title: "Microsoft Word เพื่อการทำงานเอกสาร",
            description: "เทคนิคการจัดหน้าเอกสาร การทำสารบัญอัตโนมัติ และการใช้งานเครื่องมือขั้นสูง",
            icon: <FileTextIconComponent />,
            duration: "1.5 ชั่วโมง",
            content: [
                { type: 'pdf', title: 'เอกสารประกอบการเรียน Word.pdf', url: '#' },
                { type: 'quiz', title: 'แบบฝึกหัดท้ายบท', url: '/exam' }
            ]
        },
        {
            id: 4,
            title: "Microsoft Excel & PowerPoint",
            description: "การใช้สูตรคำนวณพื้นฐานและการสร้างงานนำเสนออย่างมืออาชีพ",
            icon: <TableIconComponent />,
            duration: "2 ชั่วโมง",
            content: [
                { type: 'pdf', title: 'สูตร Excel ที่ควรรู้.pdf', url: '#' },
                { type: 'pdf', title: 'เทคนิค PowerPoint 365.pdf', url: '#' }
            ]
        }
    ]
};
