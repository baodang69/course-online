import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash, Plus } from "lucide-react";

const CourseDialog = ({
  open,
  onOpenChange,
  isReadOnly,
  editedCourse,
  categories,
  levels,
  onInputChange,
  onAddObjective,
  onRemoveObjective,
  onObjectiveChange,
  onUpdateCourse,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl"
        style={{ overflow: "auto", maxHeight: "80vh" }}
      >
        <DialogHeader>
          <DialogTitle>
            {isReadOnly ? "Xem khóa học" : "Chỉnh sửa khóa học"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Label>Tiêu đề</Label>
          <Input
            name="title"
            value={editedCourse.title}
            onChange={onInputChange}
            disabled={isReadOnly}
          />
          <Label>Hình ảnh</Label>
          <Input
            name="image"
            value={editedCourse.image}
            onChange={onInputChange}
            disabled={isReadOnly}
          />
          <Label>Mô tả</Label>
          <Input
            name="description"
            value={editedCourse.description}
            onChange={onInputChange}
            disabled={isReadOnly}
          />
          <Label>Giá</Label>
          <Input
            type="number"
            name="price"
            value={editedCourse.price}
            onChange={onInputChange}
            disabled={isReadOnly}
          />

          {/* Chọn Category */}
          <Label>Danh mục</Label>
          <Select
            onValueChange={(value) =>
              onInputChange({ target: { name: "categoryId", value } })
            }
            value={editedCourse.categoryId}
            disabled={isReadOnly}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat._id} value={cat._id}>
                  {cat.categoryName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Chọn Level */}
          <Label>Cấp độ</Label>
          <Select
            onValueChange={(value) =>
              onInputChange({ target: { name: "levelId", value } })
            }
            value={editedCourse.levelId}
            disabled={isReadOnly}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn cấp độ" />
            </SelectTrigger>
            <SelectContent>
              {levels.map((lvl) => (
                <SelectItem key={lvl._id} value={lvl._id}>
                  {lvl.levelName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Chọn Status */}
          <Label>Trạng thái</Label>
          <Select
            onValueChange={(value) =>
              onInputChange({ target: { name: "status", value } })
            }
            value={editedCourse.status}
            disabled={isReadOnly}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
          {/* Mục tiêu khóa học */}
          <Label>Mục tiêu khóa học</Label>
          {editedCourse.objectives.map((obj, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="flex items-center flex-grow border rounded-md overflow-hidden">
                <Input
                  value={obj}
                  onChange={(e) => onObjectiveChange(index, e.target.value)}
                  disabled={isReadOnly}
                  className="flex-grow border-0 focus-visible:ring-0"
                />
                {!isReadOnly && (
                  <Button
                    type="button"
                    onClick={() => onRemoveObjective(index)}
                    variant="ghost"
                    size="icon"
                    className="text-black bg-white"
                  >
                    <Trash size={16} />
                  </Button>
                )}
              </div>
            </div>
          ))}
          {!isReadOnly && (
            <Button
              type="button"
              onClick={onAddObjective}
              className="bg-black text-white hover:bg-black-600 "
            >
              <Plus size={16} className="mr-2" />
              Thêm mục tiêu
            </Button>
          )}
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Đóng</Button>
          {!isReadOnly && <Button onClick={onUpdateCourse}>Cập nhật</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CourseDialog;
