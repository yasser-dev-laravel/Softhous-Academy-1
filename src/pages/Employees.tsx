import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { BadgeCheck, Plus, Search, Trash } from "lucide-react";
import { getUsersPagination, createUser, deleteUser } from "@/utils/usersApi";

// تعريف واجهة المستخدم
interface User {
  id: number;
  name: string;
  email: string;
  emailVerified: string;
  image: string;
  salaryTypeId: number;
  salaryTypeName: string;
  salary: number;
  phone: string;
  address: string;
  nationalId: string;
  cityId: number;
  education: string;
  roleIds: number[];
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<Partial<User>>({
    id: 0,
    name: "",
    email: "",
    emailVerified: "",
    image: "",
    salaryTypeId: 0,
    salaryTypeName: "",
    salary: 0,
    phone: "",
    address: "",
    nationalId: "",
    cityId: 0,
    education: "",
    roleIds: [],
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // تحميل البيانات من API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // جلب المستخدمين
        const usersResponse = await getUsersPagination({
          Page: 1,
          Limit: 100,
          SortField: "name",
          IsDesc: false,
          FreeText: searchTerm || undefined,
        });
        setUsers(usersResponse.items || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء جلب بيانات المستخدمين",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [searchTerm, toast]);

  // معالجة تغييرات النموذج
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    // تحويل المدخلات الرقمية
    if (type === "number") {
      setFormData({ ...formData, [name]: parseFloat(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // معالجة تقديم النموذج
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }
    try {
      setIsLoading(true);
      // إنشاء مستخدم جديد
      const newUser = await createUser({
        name: formData.name!,
        email: formData.email!,
        emailVerified: formData.emailVerified!,
        image: formData.image!,
        salaryTypeId: formData.salaryTypeId!,
        salaryTypeName: formData.salaryTypeName!,
        salary: formData.salary!,
        phone: formData.phone!,
        address: formData.address!,
        nationalId: formData.nationalId!,
        cityId: formData.cityId!,
        education: formData.education!,
        roleIds: formData.roleIds!,
      });
      // تحديث القائمة
      const updatedUsersResponse = await getUsersPagination({
        Page: 1,
        Limit: 100,
        SortField: "name",
        IsDesc: false,
      });
      setUsers(updatedUsersResponse.items || []);
      // إعادة تعيين النموذج وإغلاق الحوار
      setFormData({
        id: 0,
        name: "",
        email: "",
        emailVerified: "",
        image: "",
        salaryTypeId: 0,
        salaryTypeName: "",
        salary: 0,
        phone: "",
        address: "",
        nationalId: "",
        cityId: 0,
        education: "",
        roleIds: [],
      });
      setIsDialogOpen(false);
      toast({
        title: "تم بنجاح",
        description: "تم إضافة المستخدم بنجاح",
      });
    } catch (error) {
      console.error("Error creating user:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة المستخدم",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // معالجة الحذف
  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      // حذف المستخدم
      await deleteUser(parseInt(id));
      // تحديث القائمة
      const updatedUsersResponse = await getUsersPagination({
        Page: 1,
        Limit: 100,
        SortField: "name",
        IsDesc: false,
      });
      setUsers(updatedUsersResponse.items || []);
      toast({
        title: "تم بنجاح",
        description: "تم حذف المستخدم بنجاح",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف المستخدم",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight mb-4 md:mb-0">إدارة المستخدمين</h2>
        <div className="w-full md:w-auto flex flex-col md:flex-row gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث عن مستخدم..."
              className="pr-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto">
                <Plus className="h-4 w-4 ml-2" />
                إضافة مستخدم
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>إضافة مستخدم جديد</DialogTitle>
                <DialogDescription>
                  أدخل بيانات المستخدم الجديد. اضغط حفظ عند الانتهاء.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">اسم المستخدم *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">البريد الإلكتروني *</Label>
                      <Input
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">رقم الجوال</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nationalId">الرقم القومي</Label>
                      <Input
                        id="nationalId"
                        name="nationalId"
                        value={formData.nationalId}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">العنوان</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cityId">المدينة</Label>
                      <Input
                        id="cityId"
                        name="cityId"
                        type="number"
                        value={formData.cityId?.toString()}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="education">التعليم</Label>
                      <Input
                        id="education"
                        name="education"
                        value={formData.education}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salary">الراتب</Label>
                      <Input
                        id="salary"
                        name="salary"
                        type="number"
                        value={formData.salary?.toString()}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salaryTypeId">نوع الراتب</Label>
                    <Input
                      id="salaryTypeId"
                      name="salaryTypeId"
                      type="number"
                      value={formData.salaryTypeId?.toString()}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salaryTypeName">اسم نوع الراتب</Label>
                    <Input
                      id="salaryTypeName"
                      name="salaryTypeName"
                      value={formData.salaryTypeName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={isLoading}
                  >
                    إلغاء
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "جاري الحفظ..." : "حفظ"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة المستخدمين</CardTitle>
          <CardDescription>
            إدارة بيانات المستخدمين في النظام
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-12 text-center text-muted-foreground">
              جاري تحميل البيانات...
            </div>
          ) : users.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الاسم</TableHead>
                    <TableHead>البريد الإلكتروني</TableHead>
                    <TableHead>رقم الجوال</TableHead>
                    <TableHead>الرقم القومي</TableHead>
                    <TableHead>العنوان</TableHead>
                    <TableHead>المدينة</TableHead>
                    <TableHead>التعليم</TableHead>
                    <TableHead>الراتب</TableHead>
                    <TableHead>نوع الراتب</TableHead>
                    <TableHead>اسم نوع الراتب</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{user.nationalId}</TableCell>
                      <TableCell>{user.address}</TableCell>
                      <TableCell>{user.cityId}</TableCell>
                      <TableCell>{user.education}</TableCell>
                      <TableCell>{user.salary}</TableCell>
                      <TableCell>{user.salaryTypeId}</TableCell>
                      <TableCell>{user.salaryTypeName}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(user.id.toString())}
                          disabled={isLoading}
                        >
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              لم يتم العثور على مستخدمين. قم بإضافة مستخدمين جدد.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;
