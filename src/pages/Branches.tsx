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
import { Branch, BranchCreateInput } from "@/types/Branches";
import {
  createBranch,
  updateBranch,
  deleteBranch,
  restoreBranch,
  getBranch,
  getBranchesPagination
} from "@/utils/branchesApi";
import { getAreas } from "@/utils/helpTablesApi";
import { Search, Trash, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Branches = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [areas, setAreas] = useState<{ id: string; name: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<BranchCreateInput>({
    Name: "",
    AreaId: "",
    Address: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // دالة لجلب الفروع
  const fetchBranches = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching branches...");
      const data = await getBranchesPagination({
        Page: 1,
        Limit: 100,
        SortField: "Name",
        IsDesc: false
      });
      console.log("Branches data received in component:", data);
      
      if (data && data.items) {
        console.log("Setting branches state with items:", data.items);
        setBranches(data.items);
      } else if (data && data.data && Array.isArray(data.data)) {
        console.log("Setting branches state with data array:", data.data);
        setBranches(data.data);
      } else if (Array.isArray(data)) {
        console.log("Setting branches state with array:", data);
        setBranches(data);
      } else {
        console.error("Invalid branches data format in component:", data);
        setBranches([]);
      }
    } catch (error) {
      console.error("Error fetching branches in component:", error);
      toast({
        title: "خطأ",
        description: "فشل في جلب بيانات الفروع",
        variant: "destructive"
      });
      setBranches([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Current token in Branches component:", token);

    if (!token) {
      navigate("/Login");
      return;
    }

    // جلب المناطق والفروع
    const fetchData = async () => {
      try {
        // جلب المناطق
        console.log("Fetching areas...");
        const areasData = await getAreas();
        console.log("Raw areas data:", areasData);

        // تحويل البيانات إلى الشكل المطلوب
        let formattedAreas: { id: string; name: string }[] = [];
        
        if (Array.isArray(areasData)) {
          formattedAreas = areasData.map(area => ({
            id: area.Id?.toString() || area.id?.toString() || '',
            name: area.Name || area.name || ''
          }));
        } else if (areasData && typeof areasData === 'object' && 'items' in areasData && Array.isArray(areasData.items)) {
          formattedAreas = areasData.items.map(area => ({
            id: area.Id?.toString() || area.id?.toString() || '',
            name: area.Name || area.name || ''
          }));
        }
        
        console.log("Formatted areas:", formattedAreas);
        setAreas(formattedAreas);
        
        // جلب الفروع
        await fetchBranches();
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

  // دالة للحصول على اسم المنطقة من معرفها
  const getAreaName = (areaId: string) => {
    const area = areas.find(a => a.id === areaId);
    return area ? area.name : areaId;
  };

  const filteredBranches = branches.filter(
    (branch) =>
      branch.Name && branch.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log("Current branches state:", branches);
  console.log("Filtered branches:", filteredBranches);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
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
                    <Label htmlFor="AreaId">المنطقة *</Label>
                    <Select
                      value={formData.AreaId}
                      onValueChange={v => setFormData({ ...formData, AreaId: v })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="اختر المنطقة" />
                      </SelectTrigger>
                      <SelectContent>
                        {areas.length === 0 ? (
                          <SelectItem value="loading" disabled>
                            جاري التحميل...
                          </SelectItem>
                        ) : (
                          areas.map(area => (
                            <SelectItem 
                              key={area.id} 
                              value={area.id}
                            >
                              {area.name}
                            </SelectItem>
                          ))
                        )}
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
          {isLoading ? (
            <div className="py-12 text-center text-muted-foreground">
              جاري التحميل...
            </div>
          ) : filteredBranches.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم الفرع</TableHead>
                    <TableHead>العنوان</TableHead>
                    <TableHead>المنطقة</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBranches.map((branch) => (
                    <TableRow key={branch.Id}>
                      <TableCell>{branch.Name}</TableCell>
                      <TableCell>{branch.Address}</TableCell>
                      <TableCell>{getAreaName(branch.AreaId)}</TableCell>
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
