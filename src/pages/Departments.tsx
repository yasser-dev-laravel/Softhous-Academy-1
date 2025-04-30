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
import { Category, CategoryCreateInput } from "@/types/Categories";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getCategoriesPagination
} from "@/utils/categoriesApi";
import { Search, Trash, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<CategoryCreateInput>({
    name: "",
    description: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // دالة لجلب التصنيفات
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await getCategoriesPagination({ Page: 1, Limit: 100 });
      if (data && data.items) {
        setCategories(data.items);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Current token in Categories component:", token);

    if (!token) {
      navigate("/Login");
      return;
    }

    // جلب التصنيفات
    const fetchData = async () => {
      try {
        await fetchCategories();
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

  const filteredCategories = categories.filter(
    (category) =>
      category.name && category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // التحقق من الحقول المطلوبة
    const validationErrors = [];
    if (!formData.name) validationErrors.push("اسم التصنيف مطلوب");
    if (!formData.description) validationErrors.push("الوصف مطلوب");
    if (validationErrors.length) {
      toast({ title: "خطأ", description: validationErrors.join("\n"), variant: "destructive" });
      return;
    }
    try {
      await createCategory(formData);
      fetchCategories();
      setIsDialogOpen(false);
      setFormData({ name: "", description: "" });
      toast({ title: "تم إضافة التصنيف بنجاح" });
    } catch (error) {
      toast({ title: "خطأ", description: "فشل في إضافة التصنيف", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(Number(id));
      toast({
        title: "تم بنجاح",
        description: "تم حذف التصنيف بنجاح",
      });
      
      // تحديث قائمة التصنيفات
      await fetchCategories();
    } catch (error) {
      console.error("Error in handleDelete:", error);
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "فشل في حذف التصنيف",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight mb-4 md:mb-0">إدارة التصنيفات</h2>
        <div className="w-full md:w-auto flex flex-col md:flex-row gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث عن تصنيف..."
              className="pr-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto">
                <Plus className="h-4 w-4 ml-2" />
                إضافة تصنيف
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>إضافة تصنيف جديد</DialogTitle>
                <DialogDescription>
                  أدخل بيانات التصنيف الجديد.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">اسم التصنيف *</Label>
                    <Input 
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="مثال: تصنيف رئيسي"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">الوصف *</Label>
                    <Input 
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="مثال: وصف التصنيف"
                      required
                    />
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
          <CardTitle>قائمة التصنيفات</CardTitle>
          <CardDescription>
            إدارة التصنيفات
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-12 text-center text-muted-foreground">
              جاري التحميل...
            </div>
          ) : filteredCategories.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم التصنيف</TableHead>
                    <TableHead>الوصف</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>{category.name}</TableCell>
                      <TableCell>{category.description}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(category.id)}
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
              لم يتم العثور على تصنيفات. قم بإضافة تصنيفات جديدة.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Categories;
