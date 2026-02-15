import { BookOpen, Atom, Languages, Landmark, Monitor, Palette } from 'lucide-react';

const subjectsList = [
    {
        id: 'math',
        title: 'คณิตศาสตร์',
        icon: 'BookOpen',
        color: 'var(--color-math)',
        bgColor: '#EDE9FE',
        description: 'พีชคณิต, แคลคูลัส, สถิติ, เรขาคณิต และอื่นๆ',
        itemCount: 24,
        link: '/learning?subject=คณิตศาสตร์'
    },
    {
        id: 'science',
        title: 'วิทยาศาสตร์',
        icon: 'Atom',
        color: 'var(--color-science)',
        bgColor: '#D1FAE5',
        description: 'ฟิสิกส์, เคมี, ชีววิทยา, วิทยาศาสตร์โลก',
        itemCount: 31,
        link: '/learning?subject=วิทยาศาสตร์'
    },
    {
        id: 'english',
        title: 'ภาษาอังกฤษ',
        icon: 'Languages',
        color: 'var(--color-english)',
        bgColor: '#FEF3C7',
        description: 'แกรมม่าร์, การเขียน, วรรณกรรม, คำศัพท์',
        itemCount: 18,
        link: '/learning?subject=ภาษาอังกฤษ'
    },
    {
        id: 'history',
        title: 'ประวัติศาสตร์',
        icon: 'Landmark',
        color: 'var(--color-history)',
        bgColor: '#FEE2E2',
        description: 'ประวัติศาสตร์โลก, อารยธรรม, ยุคสมัยใหม่',
        itemCount: 15,
        link: '/learning?subject=ประวัติศาสตร์'
    },
    {
        id: 'cs',
        title: 'วิทยาการคอมพิวเตอร์',
        icon: 'Monitor',
        color: 'var(--color-cs)',
        bgColor: '#CFFAFE',
        description: 'การเขียนโปรแกรม, อัลกอริทึม, พัฒนาเว็บ',
        itemCount: 22,
        link: '/learning?subject=วิทยาการคอมพิวเตอร์'
    },
    {
        id: 'art',
        title: 'ศิลปะ & การออกแบบ',
        icon: 'Palette',
        color: 'var(--color-art)',
        bgColor: '#FCE7F3',
        description: 'ทัศนศิลป์, หลักการออกแบบ, ประวัติศิลปะ',
        itemCount: 10,
        link: '/learning?subject=ศิลปะ'
    }
];

export const iconMap = { BookOpen, Atom, Languages, Landmark, Monitor, Palette };

export default subjectsList;
