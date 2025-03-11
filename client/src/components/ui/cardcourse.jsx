import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash, Edit } from "lucide-react";

const CourseCard = ({ course, onEdit, onDelete, onRead }) => {
  return (
    <Card key={course._id} className="p-4 hover:scale-105 cursor-pointer">
      <img
        src={course.image}
        alt={course.title}
        className="w-full h-72 object-cover rounded-lg"
        onClick={() => onRead(course)}
      />
      <CardContent className="mt-2">
        <h2 className="text-lg font-semibold">{course.title}</h2>
        <div className="flex justify-between mt-2">
          <Button onClick={() => onEdit(course)}>
            <Edit size={16} />
          </Button>
          <Button onClick={() => onDelete(course._id)}>
            <Trash size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
