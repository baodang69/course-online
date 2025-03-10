import AuthPage from "./pages/auth/auth";
import Home from "./pages/auth/home";
import CoursePage from "./pages/auth/coursepage";
import Courses from "./pages/auth/courses";
import AdminLayout from "./pages/admin/adminlayout";
import CourseDetail from "./pages/auth/coursedetail";
import CourseAdmin from "./pages/admin/courseadmin";
import Lesson from "./pages/admin/lesson";
import UserAdmin from "./pages/admin/useradmin";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />}></Route>
      <Route path="/" element={<Home />}></Route>
      <Route path="/courses" element={<Courses />}></Route>
      <Route path="/courses/detail/:id" element={<CoursePage />}></Route>
      <Route path="/enrolled/:courseId" element={<CourseDetail />}></Route>
      <Route path="/admin" element={<AdminLayout />}></Route>

      {/* Admin Layout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="users" element={<UserAdmin />} />
        <Route path="courses" element={<CourseAdmin />} />
        <Route path="lessons" element={<Lesson />} />
      </Route>
    </Routes>
  );
}

export default App;
