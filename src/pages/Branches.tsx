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
import { Branch } from "@/types/Branches";
import {
  createBranch,
  updateBranch,
  deleteBranch,
  restoreBranch,
  getBranch,
  getBranchesPagination
} from "@/utils/branchesApi";
import { Search, Trash, Plus } from "lucide-react";

const Branches = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [governorates, setGovernorates] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<Partial<Branch>>({
    Name: "",
    AreaId: "",
    Address: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // تحقق من وجود توكن، إذا لم يوجد وجّه المستخدم لصفحة تسجيل الدخول
    if (!localStorage.getItem("token")) {
      window.location.href = "/Login";
      return;
    }
    getBranchesPagination({ Page: 1, Limit: 100 }).then((data) => {
      setBranches(data.items || []);
    }).catch((err) => {
      // إذا انتهت صلاحية التوكن أو لم يكن مصرحًا
      if (err.message?.includes("Unauthorized")) {
        toast({ title: "انتهت الجلسة", description: "يرجى تسجيل الدخول مجددًا", variant: "destructive" });
        localStorage.removeItem("token");
        window.location.href = "/Login";
      }
    });
    setGovernorates([
      "القاهرة", "الجيزة", "الإسكندرية", "البحر الأحمر", "البحيرة", "بني سويف", "بورسعيد", "جنوب سيناء", "الدقهلية", "دمياط", "سوهاج", "السويس", "الشرقية", "شمال سيناء", "الغربية", "الفيوم", "القليوبية", "قنا", "كفر الشيخ", "مطروح", "المنوفية", "المنيا"
    ]);
  }, []);

  const filteredBranches = branches.filter(
    (branch) =>
      branch.Name && branch.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.Name || !formData.AreaId || !formData.Address) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }
    try {
      await createBranch(formData);
      toast({ title: "تم بنجاح", description: "تم إضافة الفرع بنجاح" });
      const data = await getBranchesPagination({ Page: 1, Limit: 100 });
      setBranches(data.items || []);
      setFormData({ Name: "", AreaId: "", Address: "" });
      setIsDialogOpen(false);
    } catch {
      toast({ title: "خطأ", description: "حدث خطأ أثناء إضافة الفرع", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBranch(Number(id));
      toast({ title: "تم بنجاح", description: "تم حذف الفرع بنجاح" });
      const data = await getBranchesPagination({ Page: 1, Limit: 100 });
      setBranches(data.items || []);
    } catch (err: any) {
      toast({ title: "خطأ", description: err?.message || "حدث خطأ أثناء حذف الفرع", variant: "destructive" });
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight mb-4 md:mb-0">إدارة الفروع</h2>
        <div className="w-full md:w-auto flex flex-col md:flex-row gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث عن فرع..."
              className="pr-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto">
                <Plus className="h-4 w-4 ml-2" />
                إضافة فرع
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>إضافة فرع جديد</DialogTitle>
                <DialogDescription>
                  أدخل بيانات الفرع الجديد.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="Name">اسم الفرع *</Label>
                    <Input
                      id="Name"
                      name="Name"
                      value={formData.Name}
                      onChange={handleChange}
                      placeholder="مثال: الفرع الرئيسي - المعادي"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="Address">العنوان *</Label>
                    <Input
                      id="Address"
                      name="Address"
                      value={formData.Address}
                      onChange={handleChange}
                      placeholder="العنوان بالتفصيل"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="AreaId">المحافظة *</Label>
                    <Select
                      name="AreaId"
                      value={formData.AreaId}
                      onValueChange={(value) => handleSelectChange("AreaId", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المحافظة" />
                      </SelectTrigger>
                      <SelectContent>
                        {governorates.map((gov) => (
                          <SelectItem key={gov} value={gov}>{gov}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
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
          <CardTitle>قائمة الفروع</CardTitle>
          <CardDescription>إدارة فروع الأكاديمية في المحافظات المختلفة</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredBranches.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم الفرع</TableHead>
                    <TableHead>العنوان</TableHead>
                    <TableHead>المحافظة</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBranches.map((branch) => (
                    <TableRow key={branch.Id}>
                      <TableCell>{branch.Name}</TableCell>
                      <TableCell>{branch.Address}</TableCell>
                      <TableCell>{branch.AreaId}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(branch.Id)}
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
              لم يتم العثور على فروع. قم بإضافة فروع جديدة.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Branches;
