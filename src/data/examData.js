const examData = [
    // ===== คณิตศาสตร์ =====
    {
        id: 'q1',
        subject: 'คณิตศาสตร์',
        question: 'ค่าของ √144 เท่ากับเท่าไร?',
        choices: ['10', '11', '12', '14'],
        answer: 2,
        explanation: '√144 = 12 เพราะ 12 × 12 = 144'
    },
    {
        id: 'q2',
        subject: 'คณิตศาสตร์',
        question: 'ถ้า 2x + 6 = 18 แล้ว x มีค่าเท่าไร?',
        choices: ['4', '5', '6', '7'],
        answer: 2,
        explanation: '2x + 6 = 18 → 2x = 12 → x = 6'
    },
    {
        id: 'q3',
        subject: 'คณิตศาสตร์',
        question: 'พื้นที่ของวงกลมรัศมี 7 ซม. ประมาณเท่าไร? (π ≈ 22/7)',
        choices: ['44 ตร.ซม.', '154 ตร.ซม.', '22 ตร.ซม.', '308 ตร.ซม.'],
        answer: 1,
        explanation: 'A = πr² = (22/7) × 7² = (22/7) × 49 = 154 ตร.ซม.'
    },
    {
        id: 'q4',
        subject: 'คณิตศาสตร์',
        question: '(a + b)² มีค่าเท่ากับอะไร?',
        choices: ['a² + b²', 'a² + 2ab + b²', 'a² - 2ab + b²', '2a² + 2b²'],
        answer: 1,
        explanation: 'สูตรกำลังสองสมบูรณ์: (a + b)² = a² + 2ab + b²'
    },

    // ===== วิทยาศาสตร์ =====
    {
        id: 'q5',
        subject: 'วิทยาศาสตร์',
        question: 'กฎการเคลื่อนที่ข้อที่ 2 ของนิวตัน คือข้อใด?',
        choices: ['วัตถุเคลื่อนที่ด้วยความเร็วคงที่', 'F = ma', 'แรงกิริยาเท่ากับแรงปฏิกิริยา', 'พลังงานไม่สูญหาย'],
        answer: 1,
        explanation: 'กฎข้อ 2: แรง = มวล × ความเร่ง (F = ma)'
    },
    {
        id: 'q6',
        subject: 'วิทยาศาสตร์',
        question: 'ออร์แกเนลล์ใดเป็นแหล่งผลิตพลังงาน (ATP) ของเซลล์?',
        choices: ['คลอโรพลาสต์', 'นิวเคลียส', 'ไมโทคอนเดรีย', 'ไรโบโซม'],
        answer: 2,
        explanation: 'ไมโทคอนเดรีย (Mitochondria) เป็นโรงงานผลิตพลังงานเป็น ATP'
    },
    {
        id: 'q7',
        subject: 'วิทยาศาสตร์',
        question: 'สูตรเคมีของน้ำคืออะไร?',
        choices: ['CO₂', 'NaCl', 'H₂O', 'O₂'],
        answer: 2,
        explanation: 'น้ำ = H₂O (ไฮโดรเจน 2 อะตอม + ออกซิเจน 1 อะตอม)'
    },
    {
        id: 'q8',
        subject: 'วิทยาศาสตร์',
        question: 'ความเร่งเนื่องจากแรงโน้มถ่วงของโลกมีค่าประมาณเท่าไร?',
        choices: ['5.0 m/s²', '9.8 m/s²', '15.0 m/s²', '3.14 m/s²'],
        answer: 1,
        explanation: 'ค่า g ≈ 9.8 m/s² (มักปัดเป็น 10 m/s²)'
    },

    // ===== ภาษาอังกฤษ =====
    {
        id: 'q9',
        subject: 'ภาษาอังกฤษ',
        question: 'เลือกคำที่ถูกต้อง: She ___ to school every day.',
        choices: ['go', 'goes', 'going', 'gone'],
        answer: 1,
        explanation: 'ประธานเอกพจน์บุรุษที่ 3 (She) ใช้ goes (Present Simple)'
    },
    {
        id: 'q10',
        subject: 'ภาษาอังกฤษ',
        question: '"If I were you, I would study harder." เป็น Conditional ประเภทใด?',
        choices: ['Zero Conditional', 'First Conditional', 'Second Conditional', 'Third Conditional'],
        answer: 2,
        explanation: 'Second Conditional ใช้ If + Past Simple, would + V1 (สมมติสิ่งที่ไม่จริงในปัจจุบัน)'
    },
    {
        id: 'q11',
        subject: 'ภาษาอังกฤษ',
        question: 'คำว่า "analyze" แปลว่าอะไร?',
        choices: ['สร้าง', 'วิเคราะห์', 'ประเมิน', 'ตีความ'],
        answer: 1,
        explanation: 'analyze = วิเคราะห์ (to examine something in detail)'
    },

    // ===== ประวัติศาสตร์ =====
    {
        id: 'q12',
        subject: 'ประวัติศาสตร์',
        question: 'กรุงศรีอยุธยาล่มสลายเป็นครั้งที่ 2 ในปี พ.ศ. ใด?',
        choices: ['พ.ศ. 2112', 'พ.ศ. 2310', 'พ.ศ. 2325', 'พ.ศ. 2475'],
        answer: 1,
        explanation: 'กรุงศรีอยุธยาเสียกรุงครั้งที่ 2 ในปี พ.ศ. 2310 แก่พม่า'
    },
    {
        id: 'q13',
        subject: 'ประวัติศาสตร์',
        question: 'ใครเป็นผู้ประดิษฐ์อักษรไทย?',
        choices: ['พ่อขุนศรีอินทราทิตย์', 'พ่อขุนรามคำแหงมหาราช', 'สมเด็จพระนเรศวรมหาราช', 'พระเจ้าอู่ทอง'],
        answer: 1,
        explanation: 'พ่อขุนรามคำแหงมหาราช ประดิษฐ์อักษรไทยเมื่อ พ.ศ. 1826'
    },
    {
        id: 'q14',
        subject: 'ประวัติศาสตร์',
        question: 'สงครามโลกครั้งที่ 1 เกิดขึ้นในปี ค.ศ. ใด?',
        choices: ['1905-1910', '1914-1918', '1939-1945', '1950-1953'],
        answer: 1,
        explanation: 'สงครามโลกครั้งที่ 1: ค.ศ. 1914-1918'
    },

    // ===== วิทยาการคอมพิวเตอร์ =====
    {
        id: 'q15',
        subject: 'วิทยาการคอมพิวเตอร์',
        question: 'Big O ของ Binary Search คืออะไร?',
        choices: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
        answer: 2,
        explanation: 'Binary Search แบ่งช่วงครึ่งหนึ่งในแต่ละรอบ → O(log n)'
    },
    {
        id: 'q16',
        subject: 'วิทยาการคอมพิวเตอร์',
        question: 'ผลลัพธ์ของ 10 % 3 ใน Python คืออะไร?',
        choices: ['0', '1', '3', '3.33'],
        answer: 1,
        explanation: '10 ÷ 3 = 3 เหลือเศษ 1 ดังนั้น 10 % 3 = 1'
    }
];

export default examData;

export const examSubjects = [...new Set(examData.map(q => q.subject))];
