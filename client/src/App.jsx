import AuthPage from "./pages/user/auth";
import Home from "./pages/user/home";
import CoursePage from "./pages/user/coursepage";
import Courses from "./pages/user/courses";
import AdminLayout from "./pages/admin/adminlayout";
import CourseDetail from "./pages/user/coursedetail";
import CourseAdmin from "./pages/admin/courseadmin";
import Lesson from "./pages/admin/lessonadmin";
import LessonDetail from "./pages/admin/lessonsdetailadmin";
import UserAdmin from "./pages/admin/useradmin";
import UserProfile from "./pages/user/userprofile";
import Dashboard from "./pages/admin/dashboard";
import Contact from "./pages/user/contact";
import ContactsPage from "./pages/admin/contacts";
import Terms from "./pages/terms";
import Privacy from "./pages/privacy";
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
      <Route path="/contact" element={<Contact />}></Route>
      <Route path="/userprofile/:id" element={<UserProfile />}></Route>
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />

      {/* Admin Layout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="" element={<Dashboard />} />
        <Route path="users" element={<UserAdmin />} />
        <Route path="courses" element={<CourseAdmin />} />
        <Route path="lessons" element={<Lesson />} />
        <Route path="contacts" element={<ContactsPage />} />
        <Route path="lessons/:courseid" element={<LessonDetail />} />
      </Route>
    </Routes>
  );
}

export default App;
