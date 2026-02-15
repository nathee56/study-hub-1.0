// ===== User Data (bookmarks, notes, todos) =====
// Fallback to localStorage since Firestore creation is pending

export async function getUserData(userId, key) {
    try {
        const stored = localStorage.getItem(`slh-${key}-${userId}`);
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        console.error(`Error getting ${key}:`, error);
        return null;
    }
}

export async function setUserData(userId, key, value) {
    try {
        localStorage.setItem(`slh-${key}-${userId}`, JSON.stringify(value));
    } catch (error) {
        console.error(`Error setting ${key}:`, error);
    }
}

// ===== Exam History =====

export async function saveExamResult(userId, result) {
    try {
        const history = await getExamHistory(userId);
        const newEntry = {
            ...result,
            id: Date.now().toString(),
            date: new Date().toISOString()
        };
        const updatedHistory = [...history, newEntry];
        localStorage.setItem(`slh-examHistory-${userId}`, JSON.stringify(updatedHistory));
    } catch (error) {
        console.error('Error saving exam result:', error);
    }
}

export async function getExamHistory(userId) {
    try {
        const stored = localStorage.getItem(`slh-examHistory-${userId}`);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error getting exam history:', error);
        return [];
    }
}

// ===== Course Registration (Computer Competency Exam) =====

export async function registerForCourse(userId, courseId) {
    try {
        const courses = await getRegisteredCourses(userId);
        if (!courses.includes(courseId)) {
            const updated = [...courses, courseId];
            localStorage.setItem(`slh-courses-${userId}`, JSON.stringify(updated));
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error registering for course:', error);
        return false;
    }
}

export async function getRegisteredCourses(userId) {
    try {
        const stored = localStorage.getItem(`slh-courses-${userId}`);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error getting registered courses:', error);
        return [];
    }
}
