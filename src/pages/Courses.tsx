import { useState, useEffect } from "react";
import { Course, CourseInput } from "@/types/Courses";
import { CourseLevel } from "@/types/CourseLevels";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

import { getCoursesPagination, createCourse, updateCourse, deleteCourse } from "@/utils/coursesApi";
import { getCategoriesPagination } from "@/utils/categoriesApi";
import { BookOpen, Layers, Plus, Search, Trash, Pencil, ChevronDown, ChevronRight, Clock } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ConfirmDialog from "@/components/ConfirmDialog";

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFormData, setCourseFormData] = useState<any>({
    id: 0,
    name: "",
    description: "",
    isActive: true,
    categoryId: 0,
    levels: [],
  });
  const [levelFormData, setLevelFormData] = useState<Partial<CourseLevel & { courseId: string }>>({
    id: 0,
    name: "",
    description: "",
    price: 0,
    sessionsCount: 0,
  });
  const [isCourseDialogOpen, setIsCourseDialogOpen] = useState(false);
  const [isLevelDialogOpen, setIsLevelDialogOpen] = useState(false);
  const [editCourseId, setEditCourseId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingDeleteCourse, setPendingDeleteCourse] = useState<Course | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getCoursesPagination({ Limit: 100 }),
      getCategoriesPagination({ Limit: 100 })
    ]).then(([coursesRes, categoriesRes]) => {
      setCourses((coursesRes?.items || []).map((course: any) => ({
  ...course,
  levels: (course.levels || course.Levels || []).map((level: any) => ({
    id: level.Id || level.id || '',
    code: level.Code || level.code || '',
    description: level.Description || level.description || '',
    price: level.Price || level.price || 0,
    sessionsCount: level.SessionsCount || level.sessionsCount || 0,
    name: level.Name || level.name || ''
  }))
})));
      // اطبع الكورسات بعد تحويلهم
      const formattedCourses = (coursesRes?.items || []).map((course: any) => ({
  ...course,
  levels: course.levels || course.Levels || [],
}));
      console.log('Courses from API:', formattedCourses);
      setCourses(formattedCourses);
      setDepartments(categoriesRes?.items || []);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // عند فتح النموذج لإضافة كورس جديد (وليس التعديل)، أضف مستوى افتراضي رقم 1 إذا لم يكن هناك مستويات
    if (isCourseDialogOpen && !editCourseId && (!courseFormData.levels || courseFormData.levels.length === 0)) {
      setCourseFormData((prev: any) => ({
        ...prev,
        levels: [
          {
            id: 0,
            code: '1',
            name: 'المستوى 1',
            description: '',
            price: 0,
            sessionsCount: 0,
          },
        ],
      }));
    }
    if (!isCourseDialogOpen && !editCourseId) {
      setCourseFormData((prev: any) => ({ ...prev, levels: [] }));
    }
    // eslint-disable-next-line
  }, [isCourseDialogOpen, editCourseId]);

  useEffect(() => {
    if (!isCourseDialogOpen) {
      setEditCourseId(null);
    }
  }, [isCourseDialogOpen]);

  const filteredCourses = courses.filter(
    (course) => 
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (course.id || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCourseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "number") {
      setCourseFormData({ ...courseFormData, [name]: parseFloat(value) });
    } else {
      setCourseFormData({ ...courseFormData, [name]: value });
    }
  };

  const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "number") {
      setLevelFormData({ ...levelFormData, [name]: parseFloat(value) });
    } else {
      setLevelFormData({ ...levelFormData, [name]: value });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setCourseFormData({ ...courseFormData, [name]: value });
  };

  const totalCoursePrice = (courseFormData.Levels || []).reduce((sum: number, lvl: CourseLevel) => sum + (parseFloat(String(lvl.Price)) || 0), 0);
  const totalCourseDuration = (courseFormData.Levels || []).reduce((sum: number, lvl: CourseLevel) => sum + ((parseInt(String(lvl.LectureCount)) || 0) * (parseInt(String(lvl.LectureDuration)) || 0)), 0);

  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseFormData.name || !courseFormData.categoryId) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      // تحقق من صلاحية جميع المستويات
      const invalidLevelIdx = (courseFormData.levels || []).findIndex((level: any) =>
        !level.name ||
        level.sessionsCount === undefined || level.sessionsCount === '' || isNaN(Number(level.sessionsCount)) ||
        level.price === undefined || level.price === '' || isNaN(Number(level.price))
      );
      if (invalidLevelIdx !== -1) {
        toast({
          title: "خطأ في بيانات المستوى",
          description: `يرجى التأكد من تعبئة جميع بيانات المستويات بشكل صحيح (الاسم، السعر، عدد الجلسات). هناك خطأ في المستوى رقم ${invalidLevelIdx + 1}.`,
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      console.log('levels before submit:', courseFormData.levels);
      const payload = {
        id: courseFormData.id || 0,
        name: courseFormData.name,
        description: courseFormData.description,
        isActive: courseFormData.isActive,
        categoryId: Number(courseFormData.categoryId),
        levels: (courseFormData.levels || []).map((level: any) => ({
          id: level.id || 0,
          name: level.name,
          description: level.description || '',
          price: Number(level.price),
          sessionsCount: Number(level.sessionsCount),
        })),
      };
      console.log('Course payload:', payload);
      if (editCourseId) {
        await updateCourse(Number(editCourseId), payload);
        toast({ title: "تم التعديل", description: "تم تعديل الكورس بنجاح" });
      } else {
        await createCourse(payload);
        console.log('Course payload added:', payload);
        toast({ title: "تم الإضافة", description: "تم إضافة الكورس بنجاح" });
      }
      // إعادة تحميل الكورسات
      const coursesRes = await getCoursesPagination({ Limit: 100 });
      setCourses((coursesRes?.items || []).map((course: any) => ({
  ...course,
  levels: (course.levels || course.Levels || []).map((level: any) => ({
    id: level.Id || level.id || '',
    description: level.Description || level.description || '',
    price: level.Price || level.price || 0,
    sessionsCount: level.SessionsCount || level.sessionsCount || 0,
    name: level.Name || level.name || ''
  }))
})));
      setIsCourseDialogOpen(false);
      setEditCourseId(null);
      setCourseFormData({ id: 0, name: "", description: "", isActive: true, categoryId: 0, levels: [] });
    } catch (err) {
      toast({ title: "خطأ", description: "حدث خطأ أثناء حفظ الكورس", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // handleLevelSubmit is no longer needed as levels are only managed in UI until course save
// If you want to add per-level editing, use the Levels array in courseFormData and update via handleCourseLevelChange.

  const handleAskDeleteCourse = (course: Course) => {
    setPendingDeleteCourse(course);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDeleteCourse = async () => {
    if (!pendingDeleteCourse) return;
    try {
      await deleteCourse(Number(pendingDeleteCourse.id));
      toast({ title: "تم حذف الكورس بنجاح" });
      // تحديث القائمة من الـ API
      const coursesRes = await getCoursesPagination({ Limit: 100 });
      setCourses((coursesRes?.items || []).map((course: any) => ({
  ...course,
  levels: (course.levels || course.Levels || []).map((level: any) => ({
    id: level.Id || level.id || '',
    description: level.Description || level.description || '',
    price: level.Price || level.price || 0,
    sessionsCount: level.SessionsCount || level.sessionsCount || 0,
    name: level.Name || level.name || ''
  }))
})));
    } catch {
      toast({ title: "خطأ", description: "حدث خطأ أثناء حذف الكورس", variant: "destructive" });
    }
    setDeleteDialogOpen(false);
    setPendingDeleteCourse(null);
  };

  const getDepartmentName = (categoryId: string) => {
    const department = departments.find((d) => d.Id === categoryId);
    return department?.Name || "غير معروف";
  };

  // إضافة مستوى جديد
  const handleAddLevelInCourse = () => {
    const currentLevels = courseFormData.levels || [];
    const newLevel = {
      id: 0,
      name: '',
      description: '',
      price: 0,
      sessionsCount: 0,
    };
    setCourseFormData({
      ...courseFormData,
      levels: [...currentLevels, newLevel],
    });
  };

  // تعديل بيانات مستوى
  const handleCourseLevelChange = (idx: number, field: string, value: any) => {
    const updatedLevels = [...(courseFormData.levels || [])];
    let newValue = value;
    if (field === 'price' || field === 'sessionsCount') {
      newValue = value === '' ? '' : parseFloat(value);
    }
    updatedLevels[idx] = {
      ...updatedLevels[idx],
      [field]: newValue
    };
    setCourseFormData({ ...courseFormData, levels: updatedLevels });
  };

  const handleEditCourse = (course: any) => {
    setEditCourseId(course.Id);
    setCourseFormData({
      id: course.Id,
      name: course.Name,
      description: course.description,
      isActive: course.isActive,
      categoryId: course.CategoryId,
      levels: course.Levels || [],
    });
    setIsCourseDialogOpen(true);
  };

  const checkLevelUsed = (levelId: string) => {
    // تحقق من وجود علاقة لهذا المستوى في جدول آخر (مثال)
    // مؤقتًا: لا يوجد تحقق حقيقي
    return false;
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight mb-4 md:mb-0">إدارة الكورسات</h2>
        <div className="w-full md:w-auto flex flex-col md:flex-row gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              name="searchTerm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث عن كورس"
              className="w-full pl-10 text-sm text-muted-foreground"
            />
          </div>
          <Button
            type="button"
            variant="default"
            onClick={() => setIsCourseDialogOpen(true)}
          >
            إضافة كورس جديد
          </Button>
        </div>
      </div>

      {courses.length > 0 ? (
        <div className="space-y-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <CardTitle>{course.name}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditCourse(course)}
                    >
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleAskDeleteCourse(course)}
                    >
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <CardDescription>
  <span className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
    <span className="text-xs flex items-center">
      <span className="font-medium ml-1">المعرف:</span> {course.id}
    </span>
    <span className="text-xs flex items-center">
      <span className="font-medium ml-1">القسم:</span> {getDepartmentName(course.categoryId)}
    </span>
    <span className="text-xs flex items-center">
      <span className="font-medium ml-1">المدة الإجمالية:</span> {course.total || 0} ساعة
    </span>
    <span className="text-xs flex items-center">
      <span className="font-medium ml-1">السعر الإجمالي:</span> {course.total || 0} جنيه
    </span>
  </span>
  {course.description && (
    <p className="mt-2 text-sm">{course.description}</p>
  )}
</CardDescription>
              </CardHeader>
              
              <CardContent className="pb-1">
                <Accordion type="single" collapsible>
                  <AccordionItem value="levels">
                    <AccordionTrigger className="text-sm font-medium py-2">
                      المستويات ({course.levels?.length || 0})
                    </AccordionTrigger>
                    <AccordionContent>
                      {course.levels?.length > 0 ? (
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>الكود</TableHead>
                                <TableHead>اسم المستوى</TableHead>
                                <TableHead>رقم المستوى</TableHead>
                                <TableHead>عدد الجلسات</TableHead>
                                <TableHead>مدة الجلسة</TableHead>
                                <TableHead>السعر</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {course.levels?.map((level: any, idx: number) => (
                                <TableRow key={level.id || idx}>
                                  <TableCell className="font-medium">{level.id}</TableCell>
                                  <TableCell>{level.name}</TableCell>
                                  <TableCell>{level.id}</TableCell>
                                  <TableCell>{level.sessionsCount}</TableCell>
                                  <TableCell>{level.price} </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <div className="text-center p-4 text-muted-foreground">
                          لا توجد مستويات لهذا الكورس
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            لم يتم العثور على كورسات. قم بإضافة كورسات جديدة.
          </CardContent>
        </Card>
      )}
      <Dialog open={isCourseDialogOpen} onOpenChange={setIsCourseDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editCourseId ? "تعديل كورس" : "إضافة كورس جديد"}</DialogTitle>
            <DialogDescription>
              {editCourseId ? "عدل بيانات الكورس ثم احفظ التغييرات" : "أدخل بيانات الكورس الجديد"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCourseSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">اسم الكورس *</Label>
              <Input id="name" name="name" value={courseFormData.name} onChange={handleCourseChange} required />
            </div>
            <div>
              <Label htmlFor="description">الوصف</Label>
              <Textarea id="description" name="description" value={courseFormData.description} onChange={handleCourseChange} />
            </div>
            <div>
              <Label htmlFor="categoryId">القسم / التصنيف *</Label>
              <Select value={String(courseFormData.categoryId)} onValueChange={v => handleSelectChange("categoryId", v)} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر القسم أو التصنيف" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((cat: any) => (
                    <SelectItem key={cat.Id || cat.id} value={String(cat.Id || cat.id)}>
                      {cat.Name || cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={!!courseFormData.isActive}
                onChange={e => setCourseFormData({ ...courseFormData, isActive: e.target.checked })}
              />
              <Label htmlFor="isActive">نشط</Label>
            </div>
            <div className="space-y-1">
              <div className="flex flex-row gap-2 mb-1 px-2">
                <div className="w-14 text-xs font-semibold text-muted-foreground text-center">الكود</div>
                <div className="w-24 text-xs font-semibold text-muted-foreground text-center">الاسم</div>
                <div className="w-20 text-xs font-semibold text-muted-foreground text-center">الوصف</div>
                <div className="w-8" />
              </div>
              {(courseFormData.levels || []).map((level: any, idx: number, arr: any[]) => (
  <div key={idx} className="flex flex-row gap-2 items-end flex-nowrap relative mb-2">
    
    <Input
      name="Code"
      value={level.id || (idx + 1)}
      onChange={e => handleCourseLevelChange(idx, 'id', e.target.value)}
      className="w-14 text-center"
      placeholder=""
    />
    <Input
      name="LevelName"
      value={level.name || 'المستوي ' + (idx + 1)}
      onChange={e => handleCourseLevelChange(idx, 'name', e.target.value)}
      className="w-24 text-center"
      placeholder=""
    />
    <Input
      name="description"
      type="text"
      value={level.description || ''}
      onChange={e => handleCourseLevelChange(idx, 'description', e.target.value)}
      className="w-44 text-center"
      placeholder=""
    />
     <div className="flex flex-col items-center justify-start">
      <div className="w-20 text-xs font-semibold text-muted-foreground text-center mb-1">السعر</div>
      <Input
        name="price"
        type="number"
        value={level.price || ''}
        onChange={e => handleCourseLevelChange(idx, 'price', e.target.value)}
        className="w-20 text-center"
        placeholder=""
      />
    </div>
    <div className="flex flex-col items-center justify-start">
      <div className="w-20 text-xs font-semibold text-muted-foreground text-center mb-1">عدد الجلسات</div>
      <Input
        name="sessionsCount"
        type="number"
        value={level.sessionsCount || ''}
        onChange={e => handleCourseLevelChange(idx, 'sessionsCount', e.target.value)}
        className="w-20 text-center"
        placeholder=""
      />
    </div>
    {/* <Input
      name="LectureDuration"
      type="number"
      value={level.LectureDuration || ''}
      onChange={e => handleCourseLevelChange(idx, 'LectureDuration', e.target.value)}
      className="w-16"
      placeholder="مدة الجلسة"
    /> */}
   
    {/* زر حذف يظهر فقط في آخر مستوى إذا كان هناك أكثر من مستوى */}
    {arr.length > 1 && idx === arr.length - 1 && (
      <Button
        type="button"
        variant="destructive"
        size="icon"
        className="ml-1 w-8 h-8 flex items-center justify-center"
        title="حذف المستوى الأخير"
        onClick={() => {
          const updatedLevels = arr.slice(0, -1);
          setCourseFormData({ ...courseFormData, levels: updatedLevels });
        }}
      >
        ×
      </Button>
    )}
  </div>
))}
              <Button type="button" variant="outline" onClick={handleAddLevelInCourse}>
                إضافة مستوى جديد
              </Button>
            </div>
            <DialogFooter>
              <Button type="submit">{editCourseId ? "حفظ التعديلات" : "حفظ"}</Button>
              <Button type="button" variant="outline" onClick={() => setIsCourseDialogOpen(false)}>
                إلغاء
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={deleteDialogOpen}
        title="تأكيد حذف الكورس"
        description={pendingDeleteCourse ? `هل أنت متأكد أنك تريد حذف الكورس (${pendingDeleteCourse.name})؟` : ""}  
        onConfirm={handleConfirmDeleteCourse}
        onCancel={() => { setDeleteDialogOpen(false); setPendingDeleteCourse(null); }}
        confirmText="حذف"
        cancelText="إلغاء"
      />
    </div>
  );
};

export default Courses;
