// components/CourseCard.js
const CourseCardBlank = ({ course, onSelect }) => {
  return (
    <div
      className="border rounded-lg p-4 cursor-pointer flex" // Sử dụng flex
      onClick={() => onSelect(course._id)}
    >
      {/* Ảnh bên trái */}
      {course.image && (
        <div className="w-1/2 pr-4">
          {" "}
          {/* Chia cột ảnh */}
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-40 object-cover rounded-md"
          />
        </div>
      )}

      {/* Thông tin bên phải */}
      <div className="flex-1">
        {" "}
        {/* Chia cột thông tin */}
        <h3 className="font-semibold">{course.title}</h3>
        <p>{course.description}</p>
        {/* Thêm thông tin khác nếu cần */}
      </div>
    </div>
  );
};

export default CourseCardBlank;
