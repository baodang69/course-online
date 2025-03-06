const Enrollment = require("../models/Enrollment");

//Hàm check các khóa học của người dùng
exports.checkUsersCourses = async (req, res) => {
  try {
    const { userId } = req.params;
    // Tìm tất cả bản ghi đăng ký của userId
    const enrollments = await Enrollment.find({ user: userId });

    // Lấy danh sách các courseId từ kết quả
    const enrolledCourseIds = enrollments.map(
      (enrollment) => enrollment.course
    );

    res.json(enrolledCourseIds);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách khóa học đã đăng ký:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

//Hàm check user đã enroll vào khóa học chưa
exports.checkEnrolled = async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    const enrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
    });

    res.json({ isEnrolled: !!enrollment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Hàm tìm enrollment
exports.getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find().populate("course user");
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error });
  }
};

//Hàm enrollment by id
exports.getEnrollmentById = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id).populate(
      "course user"
    );
    if (!enrollment)
      return res.status(404).json({ message: "Không tìm thấy enrollment!" });
    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error });
  }
};

//Hàm tạo enrollment
exports.createEnrollment = async (req, res) => {
  const { course, user, status } = req.body;

  try {
    const newEnrollment = new Enrollment({ course, user, status });
    await newEnrollment.save();
    res.status(201).json(newEnrollment);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi tạo enrollment!", error });
  }
};

//Hàm update enrollment
exports.updateEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!enrollment)
      return res.status(404).json({ message: "Không tìm thấy enrollment!" });
    res.json(enrollment);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi cập nhật enrollment!", error });
  }
};

//Hàm xóa enrollment
exports.deleteEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndDelete(req.params.id);
    if (!enrollment)
      return res.status(404).json({ message: "Không tìm thấy enrollment!" });
    res.json({ message: "Xóa enrollment thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error });
  }
};
