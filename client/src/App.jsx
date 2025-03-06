import AuthPage from "./pages/auth/auth";
import Home from "./pages/auth/home";
import CoursePage from "./pages/auth/coursepage";
import Courses from "./pages/auth/courses";
import CourseDetail from "./pages/auth/coursedetail";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />}></Route>
      <Route path="/" element={<Home />}></Route>
      <Route path="/courses" element={<Courses />}></Route>
      <Route path="/courses/detail/:id" element={<CoursePage />}></Route>
      <Route path="/enrolled/:courseId" element={<CourseDetail />}></Route>
    </Routes>
  );
}

export default App;
