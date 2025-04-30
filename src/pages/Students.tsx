import React, { useState, useEffect } from "react";
import {
  Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { getFromLocalStorage } from "@/utils/localStorage";
import { getStudentsPagination, createStudent } from "@/utils/studentsApi";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { generateId, saveToLocalStorage } from "@/utils/localStorage";
import StudentReceipts from "@/components/StudentReceipts";
import { Student } from "../types/Students";
import { Branch } from "@/types/Branches";
import { Course } from "@/types/Courses";
import { StudentGroupEnrollment } from "../types/StudentGroupEnrollment";

function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState<string>("__all__");
  const [selectedCourse, setSelectedCourse] = useState<string>("__all__");
  const [selectedStudent, setSelectedStudent] = useState<Student|null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    name: "",
    phone: "",
    email: "",
    address: "",
    areaId: 0,
    birthdate: "",
    applicationId: 0,
    educationalQualificationDescriptionId: 0,
    educationalQualificationTypeId: 0,
    educationalQualificationIssuerId: 0,
    sourceId: 0,
    sourceName: "",
  });
  const [showStudentDialog, setShowStudentDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Branches: ignore any branch without id or name (or with empty string)
    const rawBranches = getFromLocalStorage<Branch[]>("latin_academy_branches", []);
    const validBranches = Array.isArray(rawBranches)
      ? rawBranches.filter(b => b?.Id?.trim() && b?.Name?.trim())
      : [];
    setBranches(validBranches);
    // Courses: ignore any course without id or name
    const rawCourses = getFromLocalStorage<Course[]>("latin_academy_courses", []);
    const validCourses = Array.isArray(rawCourses)
      ? rawCourses.filter(c => c?.Id?.trim() && c?.Name?.trim())
      : [];
    setCourses(validCourses);
    // Students: fetch from API
    const fetchStudents = async () => {
      try {
        const data = await getStudentsPagination({ Page: 1, Limit: 100 });
        const apiStudents = data.items.map(item => ({
          id: item.Id,
          name: item.Name,
          phone: item.Phone,
          email: item.Email,
          address: item.Address,
          areaId: item.AreaId || 0,
          birthdate: item.Birthdate || '',
          applicationId: item.ApplicationId || 0,
          educationalQualificationDescriptionId: item.EducationalQualificationDescriptionId || 0,
          educationalQualificationTypeId: item.EducationalQualificationTypeId || 0,
          educationalQualificationIssuerId: item.EducationalQualificationIssuerId || 0,
          sourceId: item.SourceId || 0,
          sourceName: item.SourceName || '',
          groups: [] // مؤقتا فارغ حتى تربطه لاحقا
        }));
        setStudents(apiStudents);
      } catch (error) {
        console.error("Error fetching students from API:", error);
        toast({ title: "خطأ", description: "فشل في جلب بيانات الطلاب من الخادم", variant: "destructive" });
      }
    };
    fetchStudents();
  }, []);

  // فلترة الطلاب
  const filteredStudents = Array.isArray(students) ? students.filter(s => {
    if (!s) return false;
    const matchesBranch = selectedBranch && selectedBranch !== "__all__" ? s.groups && s.groups.some(g => g && g.branchName === branches.find(b => b.Id === selectedBranch)?.Name) : true;
    const matchesCourse = selectedCourse && selectedCourse !== "__all__" ? s.groups && s.groups.some(g => g && g.courseName === courses.find(c => c.Id === selectedCourse)?.Name) : true;
    const matchesSearch =
      (s.name && s.name.includes(searchTerm)) ||
      (s.phone && s.phone.includes(searchTerm)) ||
      (s.id && s.id.toString().includes(searchTerm));
    return matchesBranch && matchesCourse && matchesSearch;
  }) : [];

  // توليد باسورد عشوائي
  function randomPassword(length = 6) {
    return Math.random().toString(36).slice(-length);
  }

  function generateStudentId(studentsArr: any[]): string {
    // رقم السنة الحالي (آخر رقمين)
    const now = new Date();
    const year = now.getFullYear() % 100;
    // استخراج كل الطلاب بنفس السنة
    const prefix = `std-${year}`;
    const yearStudents = studentsArr.filter(s => typeof s.id === 'string' && s.id.startsWith(prefix));
    // إيجاد أعلى رقم تسلسلي
    let maxNum = 1000;
    yearStudents.forEach(s => {
      const m = s.id.match(/^std-(\d{2})(\d{4,})$/);
      if (m && m[2]) {
        const num = parseInt(m[2], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    return `std-${year}${maxNum + 1}`;
  }

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.phone) {
      toast({ title: "يرجى إدخال اسم الطالب والموبايل", variant: "destructive" });
      return;
    }
    try {
      const studentData = {
        ...newStudent,
        // لا ترسل id، الخادم سيولده
        name: newStudent.name || "",
        phone: newStudent.phone || "",
        email: newStudent.email || "",
        address: newStudent.address || "",
        areaId: newStudent.areaId || 0,
        birthdate: newStudent.birthdate || "",
        applicationId: newStudent.applicationId || 0,
        educationalQualificationDescriptionId: newStudent.educationalQualificationDescriptionId || 0,
        educationalQualificationTypeId: newStudent.educationalQualificationTypeId || 0,
        educationalQualificationIssuerId: newStudent.educationalQualificationIssuerId || 0,
        sourceId: newStudent.sourceId || 0,
        sourceName: newStudent.sourceName || "",
      };
      const created = await createStudent(studentData);
      toast({ title: "تم إضافة الطالب بنجاح" });
      // إعادة تحميل الطلاب من API
      const fetchStudents = async () => {
        try {
          const data = await getStudentsPagination({ Page: 1, Limit: 100 });
          const apiStudents = data.items.map(item => ({
            id: item.Id,
            name: item.Name,
            phone: item.Phone,
            email: item.Email,
            address: item.Address,
            areaId: item.AreaId || 0,
            birthdate: item.Birthdate || '',
            applicationId: item.ApplicationId || 0,
            educationalQualificationDescriptionId: item.EducationalQualificationDescriptionId || 0,
            educationalQualificationTypeId: item.EducationalQualificationTypeId || 0,
            educationalQualificationIssuerId: item.EducationalQualificationIssuerId || 0,
            sourceId: item.SourceId || 0,
            sourceName: item.SourceName || '',
            groups: [] // مؤقتا فارغ حتى تربطه لاحقا
          }));
          setStudents(apiStudents);
        } catch (error) {
          console.error("Error fetching students from API:", error);
          toast({ title: "خطأ", description: "فشل في جلب بيانات الطلاب من الخادم", variant: "destructive" });
        }
      };
      fetchStudents();
      setIsDialogOpen(false);
      setNewStudent({
        name: "",
        phone: "",
        email: "",
        address: "",
        areaId: 0,
        birthdate: "",
        applicationId: 0,
        educationalQualificationDescriptionId: 0,
        educationalQualificationTypeId: 0,
        educationalQualificationIssuerId: 0,
        sourceId: 0,
        sourceName: "",
      });
    } catch (error) {
      toast({ title: "خطأ", description: "فشل في إضافة الطالب إلى الخادم", variant: "destructive" });
    }
  };

  // زر لإضافة بيانات افتراضية بالعربي
  const handleSeedArabicData = () => {
    import("../utils/seedArabicData").then(mod => {
      mod.seedArabicData();
      toast({ title: "تمت إضافة البيانات الافتراضية بالعربي!" });
      window.location.reload();
    });
  };

  // أداة تصحيح أرقام الأبليكيشن لجميع الطلاب في localStorage
  function fixAllStudentIds() {
    const studentsArrRaw = getFromLocalStorage("latin_academy_students", []);
    const studentsArr = Array.isArray(studentsArrRaw) ? studentsArrRaw.filter(s => s && typeof s === 'object') : [];
    // تجميع الطلاب حسب السنة
    const studentsByYear: { [year: string]: any[] } = {};
    studentsArr.forEach(s => {
      // محاولة استخراج السنة من تاريخ الإضافة أو أقرب تاريخ متاح (أو تاريخ اليوم إذا غير متوفر)
      let year = new Date().getFullYear() % 100;
      if (s.createdAt) {
        year = new Date(s.createdAt).getFullYear() % 100;
      } else if (s.birthdate) {
        year = new Date(s.birthdate).getFullYear() % 100;
      }
      if (!studentsByYear[year]) studentsByYear[year] = [];
      studentsByYear[year].push(s);
    });
    // إعادة ترقيم الطلاب لكل سنة
    Object.keys(studentsByYear).forEach(year => {
      studentsByYear[year].sort((a, b) => (a.createdAt || a.birthdate || "") > (b.createdAt || b.birthdate || "") ? 1 : -1);
      studentsByYear[year].forEach((s, idx) => {
        s.id = `std-${year}${1001 + idx}`;
      });
    });
    // saveToLocalStorage("latin_academy_students", studentsArr);
    window.location.reload();
  }

  const handleStudentRowClick = (student: Student) => {
    setSelectedStudent(student);
    setShowStudentDialog(true);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight mb-4 md:mb-0">الطلاب / الدارسين</h2>
        <div className="w-full md:w-auto flex flex-col md:flex-row gap-3">
          <Button variant="outline" className="mb-3" onClick={handleSeedArabicData}>
            إضافة بيانات افتراضية بالعربي للفروع والكورسات
          </Button>
          <div className="relative w-full md:w-64">
            <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث بالاسم أو الموبايل أو رقم الأبليكيشن"
              className="pr-8"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-64">
            <Select onValueChange={setSelectedBranch} value={selectedBranch}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="اختر الفرع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">كل الفروع</SelectItem>
                {branches.filter(b => !!b && typeof b.Id === 'string' && !!b.Id && typeof b.Name === 'string' && !!b.Name).map(b => (
                  <SelectItem key={b.Id} value={b.Id}>{b.Name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-64">
            <Select onValueChange={setSelectedCourse} value={selectedCourse}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="اختر الكورس" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">كل الكورسات</SelectItem>
                {courses.filter(c => !!c && typeof c.Id === 'string' && !!c.Id && typeof c.Name === 'string' && !!c.Name).map(c => (
                  <SelectItem key={c.Id} value={c.Id}>{c.Name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto">إضافة طالب جديد</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إضافة طالب جديد</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddStudent} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>اسم الطالب *</Label>
                    <Input value={newStudent.name} onChange={e => setNewStudent({ ...newStudent, name: e.target.value })} required />
                  </div>
                  <div>
                    <Label>رقم الموبايل *</Label>
                    <Input value={newStudent.phone} onChange={e => setNewStudent({ ...newStudent, phone: e.target.value })} required />
                  </div>
                  <div>
                    <Label>البريد الالكتروني</Label>
                    <Input value={newStudent.email} onChange={e => setNewStudent({ ...newStudent, email: e.target.value })} />
                  </div>
                  <div>
                    <Label>العنوان</Label>
                    <Input value={newStudent.address} onChange={e => setNewStudent({ ...newStudent, address: e.target.value })} />
                  </div>
                  <div>
                    <Label>تاريخ الميلاد</Label>
                    <Input type="date" value={newStudent.birthdate} onChange={e => setNewStudent({ ...newStudent, birthdate: e.target.value })} />
                  </div>
                  <div>
                    <Label>المؤهل</Label>
                    <Input value={newStudent.educationalQualificationDescriptionId} onChange={e => setNewStudent({ ...newStudent, educationalQualificationDescriptionId: parseInt(e.target.value, 10) })} />
                  </div>
                  <div>
                    <Label>نوع المؤهل</Label>
                    <Input value={newStudent.educationalQualificationTypeId} onChange={e => setNewStudent({ ...newStudent, educationalQualificationTypeId: parseInt(e.target.value, 10) })} />
                  </div>
                  <div>
                    <Label>جهة إصدار المؤهل</Label>
                    <Input value={newStudent.educationalQualificationIssuerId} onChange={e => setNewStudent({ ...newStudent, educationalQualificationIssuerId: parseInt(e.target.value, 10) })} />
                  </div>
                  <div>
                    <Label>مصدر الطالب</Label>
                    <Input value={newStudent.sourceId} onChange={e => setNewStudent({ ...newStudent, sourceId: parseInt(e.target.value, 10) })} />
                  </div>
                  <div>
                    <Label>اسم مصدر الطالب</Label>
                    <Input value={newStudent.sourceName} onChange={e => setNewStudent({ ...newStudent, sourceName: e.target.value })} />
                  </div>
                </div>
                <DialogFooter className="mt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>إلغاء</Button>
                  <Button type="submit">حفظ الطالب</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>جدول الطلاب</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>رقم الأبليكيشن</TableHead>
                <TableHead>اسم الطالب</TableHead>
                <TableHead>الموبايل</TableHead>
                <TableHead>الفرع</TableHead>
                <TableHead>الكورسات</TableHead>
                <TableHead>المجموعات المسجل بها</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(filteredStudents) && filteredStudents.map(student => (
                <TableRow key={student.id} onClick={() => handleStudentRowClick(student)} className="cursor-pointer">
                  <TableCell>{student.id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.phone}</TableCell>
                  <TableCell>{Array.isArray(student.groups) ? student.groups.map(g => g && g.branchName).join(", ") : ""}</TableCell>
                  <TableCell>{Array.isArray(student.groups) ? student.groups.map(g => g && g.courseName).join(", ") : ""}</TableCell>
                  <TableCell>
                    {Array.isArray(student.groups) && student.groups.length
                      ? student.groups.map(g => g && (g.groupName || g.groupId)).join(", ")
                      : <span className="text-gray-400">لا يوجد</span>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* نافذة بيانات الطالب */}
      <Dialog open={showStudentDialog} onOpenChange={setShowStudentDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>بيانات الطالب</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>رقم الأبليكيشن:</Label> {selectedStudent.id}<br />
                  <Label>اسم الطالب:</Label> {selectedStudent.name}<br />
                  <Label>الموبايل:</Label> {selectedStudent.phone}<br />
                  <Label>البريد الالكتروني:</Label> {selectedStudent.email}<br />
                  <Label>العنوان:</Label> {selectedStudent.address}<br />
                  <Label>تاريخ الميلاد:</Label> {selectedStudent.birthdate}<br />
                  <Label>المؤهل:</Label> {selectedStudent.educationalQualificationDescriptionId}<br />
                  <Label>نوع المؤهل:</Label> {selectedStudent.educationalQualificationTypeId}<br />
                  <Label>جهة إصدار المؤهل:</Label> {selectedStudent.educationalQualificationIssuerId}<br />
                  <Label>مصدر الطالب:</Label> {selectedStudent.sourceId}<br />
                  <Label>اسم مصدر الطالب:</Label> {selectedStudent.sourceName}<br />
                </div>
                <div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>المجموعة</TableHead>
                        <TableHead>الدورة</TableHead>
                        <TableHead>الفرع</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>المدفوع</TableHead>
                        <TableHead>المتبقي</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.isArray(selectedStudent.groups) && selectedStudent.groups.map(g => (
                        <TableRow key={g.groupId}>
                          <TableCell>{g.groupName || g.groupId}</TableCell>
                          <TableCell>{g.courseName}</TableCell>
                          <TableCell>{g.branchName}</TableCell>
                          <TableCell>{g.status}</TableCell>
                          <TableCell>{g.paid}</TableCell>
                          <TableCell>{g.remaining}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              {/* إيصالات الطالب */}
              <div>
                <h3 className="font-bold mb-2">إيصالات الطالب</h3>
                <StudentReceipts studentId={selectedStudent.id} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Students;
