import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookmarkProvider } from './context/BookmarkContext';
import { SearchProvider } from './context/SearchContext';
import { TodoProvider } from './context/TodoContext';
import { NotesProvider } from './context/NotesContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import PromptLibrary from './pages/PromptLibrary';
import PromptDetail from './pages/PromptDetail';
import Bookmarks from './pages/Bookmarks';
import LearningDatabase from './pages/LearningDatabase';
import LearningDetail from './pages/LearningDetail';
import StudyTools from './pages/StudyTools';
import TodoList from './pages/tools/TodoList';
import GpaCalculator from './pages/tools/GpaCalculator';
import StudyTimer from './pages/tools/StudyTimer';
import QuickNotes from './pages/tools/QuickNotes';
import ExamZone from './pages/ExamZone';
import Community from './pages/Community';
import LinksPage from './pages/LinksPage';
import Profile from './pages/Profile';
import PlaceholderPage from './pages/PlaceholderPage';
import ComputerExamPage from './pages/ComputerExamPage';
import QualityAssurance from './pages/QualityAssurance';
import MemorialPopup from './components/MemorialPopup';
import { Info, Bell } from 'lucide-react';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <MemorialPopup />
      <AuthProvider>
        <BookmarkProvider>
          <SearchProvider>
            <TodoProvider>
              <NotesProvider>
                <Routes>
                  <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/prompts" element={<PromptLibrary />} />
                    <Route path="/prompts/:id" element={<PromptDetail />} />
                    <Route path="/bookmarks" element={<Bookmarks />} />
                    <Route path="/learning" element={<LearningDatabase />} />
                    <Route path="/learning/:id" element={<LearningDetail />} />
                    <Route path="/tools" element={<StudyTools />} />
                    <Route path="/tools/todo" element={<TodoList />} />
                    <Route path="/tools/gpa" element={<GpaCalculator />} />
                    <Route path="/tools/timer" element={<StudyTimer />} />
                    <Route path="/tools/notes" element={<QuickNotes />} />
                    <Route path="/exam" element={<ExamZone />} />
                    <Route path="/com-competency" element={<ComputerExamPage />} />
                    <Route path="/qa-submit" element={<QualityAssurance />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/links" element={<LinksPage />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/about" element={
                      <PlaceholderPage
                        title="เกี่ยวกับ StudyHub"
                        description="Student Learning Hub เป็นแพลตฟอร์มรวมศูนย์ที่รวมแหล่งเรียนรู้ เครื่องมือการเรียน และคลัง Prompt สำหรับนักเรียนนักศึกษา"
                        icon={Info}
                        links={[{ to: '/', label: 'กลับหน้าแรก' }]}
                      />
                    } />
                    <Route path="/updates" element={
                      <PlaceholderPage
                        title="มีอะไรใหม่"
                        description="ติดตามฟีเจอร์ล่าสุด Prompt ใหม่ และการปรับปรุงแพลตฟอร์ม"
                        icon={Bell}
                        links={[{ to: '/', label: 'กลับหน้าแรก' }]}
                      />
                    } />
                  </Route>
                </Routes>
              </NotesProvider>
            </TodoProvider>
          </SearchProvider>
        </BookmarkProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}


export default App;
