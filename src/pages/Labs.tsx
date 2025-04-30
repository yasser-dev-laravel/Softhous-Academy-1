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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Lab, LabInput } from "@/types/Labs";
import { Branch } from "@/types/Branches";
import { Laptop, Monitor, Users, MapPin, Plus, Search, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createLab, deleteLab, getLabsPagination } from "@/utils/labsApi";
import { getBranchesPagination } from "@/utils/branchesApi";

const Labs = () => {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: '',
    type: 'معمل',
    capacity: 0,
    branchId: 0
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // دالة لجلب المعامل
  const fetchLabs = async () => {
    try {
      setIsLoading(true);
      console.log("1. بدء عملية جلب المعامل...");
      
      // التحقق من التوكن
      const token = localStorage.getItem("token");
      console.log("2. التوكن الحالي:", token ? "موجود" : "غير موجود");
      
      // تجهيز معلمات الطلب
      const requestParams = {
        Page: 1,
        Limit: 100,
        SortField: "name",
        IsDesc: false,
        FreeText: "",
        OnlyDeleted: false
      };
      console.log("3. معلمات الطلب:", requestParams);
      
      // إرسال الطلب
      console.log("4. إرسال طلب جلب المعامل...");
      const data = await getLabsPagination(requestParams);
      console.log("5. استجابة الطلب:", data);
      
      // معالجة البيانات
      if (data && Array.isArray(data.items)) {
        console.log(`6. عدد المعامل المستلمة: ${data.items.length}`);
        console.log("7. بيانات المعامل:", data.items);
        setLabs(data.items);
      } else {
        console.error("8. تنسيق البيانات غير صحيح:", data);
        setLabs([]);
        toast({
          title: "خطأ",
          description: "تنسيق البيانات غير صحيح",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("9. حدث خطأ أثناء جلب المعامل:", error);
      setLabs([]);
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "فشل في جلب بيانات المعامل",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      console.log("10. اكتملت عملية جلب المعامل");
    }
  };

  // دالة لجلب الفروع
  const fetchBranches = async () => {
    try {
      console.log("Fetching branches...");
      const data = await getBranchesPagination({
        Page: 1,
        Limit: 100,
        SortBy: "name",
        SortDirection: "asc"
      });
      console.log("Branches data received in component:", data);
      
      if (data && data.items) {
        console.log("Setting branches state with items:", data.items);
        setBranches(data.items);
      } else {
        console.error("Invalid branches data format in component:", data);
        setBranches([]);
      }
    } catch (error) {
      console.error("Error fetching branches in component:", error);
      toast({
        title: "خطأ",
        description: "فشل في جلب بيانات الفروع",
        variant: "destructive",
      });
      setBranches([]);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Current token in Labs component:", token);

    if (!token) {
      navigate("/Login");
      return;
    }

    // جلب الفروع والمعامل
    const fetchData = async () => {
      try {
        await fetchBranches();
        await fetchLabs();
      } catch (error) {
        console.error("Error fetching data in component:", error);
        toast({
          title: "خطأ",
          description: "فشل في جلب البيانات",
          variant: "destructive"
        });
      }
    };

    fetchData();
  }, []);

  // Handle search
  const filteredLabs = labs.filter(
    (lab) =>
      lab.Name && lab.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    // Convert number inputs
    if (type === "number") {
      setFormData({ ...formData, [name]: parseInt(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.name || !formData.Type || !formData.Capacity || !formData.branchId) {
        toast({
          title: "خطأ",
          description: "يرجى ملء جميع الحقول المطلوبة",
          variant: "destructive",
        });
        return;
      }

      await createLab(formData);
      toast({
        title: "تم بنجاح",
        description: "تم إضافة المعمل بنجاح",
      });
      setIsDialogOpen(false);
      fetchLabs();
      setFormData({
        name: '',
        type: 'معمل',
        capacity: 0,
        branchId: 0
      });
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة المعمل",
        variant: "destructive",
      });
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      await deleteLab(Number(id));
      toast({
        title: "تم بنجاح",
        description: "تم حذف القاعة/المعمل بنجاح",
      });
      
      // تحديث قائمة المعامل
      await fetchLabs();
    } catch (error) {
      console.error("Error deleting lab:", error);
      toast({
        title: "خطأ",
        description: "فشل في حذف القاعة/المعمل",
        variant: "destructive",
      });
    }
  };

  // Get branch name by ID
  const getBranchName = (branchId: string) => {
    const branch = branches.find((b) => Number(branchId) === Number(b.Id));
    return branch?.Name || "غير معروف";
  };

  // Get lab type icon and text
  const getLabTypeInfo = (type: string) => {
    switch (type) {
      case "computer":
        return {
          icon: <Monitor className="h-4 w-4 text-blue-500" />,
          text: "معمل كمبيوتر",
        };
      case "language":
        return {
          icon: <Laptop className="h-4 w-4 text-green-500" />,
          text: "معمل لغات",
        };
      case "general":
        return {
          icon: <Users className="h-4 w-4 text-orange-500" />,
          text: "قاعة عامة",
        };
      default:
        return {
          icon: <Laptop className="h-4 w-4" />,
          text: "معمل",
        };
    }
  };

  console.log("Current labs state:", labs);
  console.log("Filtered labs:", filteredLabs);

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight mb-4 md:mb-0">إدارة القاعات والمعامل</h2>
        <div className="w-full md:w-auto flex flex-col md:flex-row gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث عن قاعة أو معمل..."
              className="pr-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto">
                <Plus className="h-4 w-4 ml-2" />
                إضافة قاعة/معمل
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>إضافة قاعة/معمل جديد</DialogTitle>
                <DialogDescription>
                  أدخل بيانات القاعة أو المعمل الجديد.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">اسم المعمل *</Label>
                    <Input 
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="مثال: معمل الكمبيوتر 1"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="capacity">السعة</Label>
                      <Input 
                        id="capacity"
                        name="capacity"
                        type="number"
                        value={formData.Capacity}
                        onChange={handleChange}
                        min="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">النوع *</Label>
                      <Select 
                        name="type"
                        value={formData.Type}
                        onValueChange={(value) => handleSelectChange("type", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر النوع" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="معمل">معمل</SelectItem>
                          <SelectItem value="قاعة">قاعة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="branchId">الفرع *</Label>
                    <Select 
                      name="branchId"
                      value={formData.branchId.toString()}
                      onValueChange={(value) => {
                        setFormData({
                          ...formData,
                          branchId: parseInt(value)
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الفرع" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map((branch) => (
                          <SelectItem key={branch.Id} value={branch.Id.toString()}>
                            {branch.Name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    إلغاء
                  </Button>
                  <Button type="submit">حفظ</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة القاعات والمعامل</CardTitle>
          <CardDescription>
            إدارة القاعات والمعامل في الفروع المختلفة
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-12 text-center text-muted-foreground">
              جاري التحميل...
            </div>
          ) : (searchTerm ? filteredLabs : labs).length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الرقم</TableHead>
                    <TableHead>اسم الغرفة</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead>السعة</TableHead>
                    <TableHead>الفرع</TableHead>
                    <TableHead>إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(searchTerm ? filteredLabs : labs).map((lab, idx) => (
                    <TableRow key={lab.id ?? idx}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{lab.Name}</TableCell>
                      <TableCell>{lab.Type}</TableCell>
                      <TableCell>{lab.Capacity}</TableCell>
                      <TableCell>{lab.branchId !== undefined && lab.branchId !== null ? getBranchName(lab.branchId.toString()) : 'غير محدد'}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(lab.id)}
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
              لم يتم العثور على قاعات أو معامل. قم بإضافة قاعات ومعامل جديدة.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Labs;
