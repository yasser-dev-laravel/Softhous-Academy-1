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
import { Room, RoomCreateInput } from "@/types/Rooms";
import {
  createRoom,
  updateRoom,
  deleteRoom,
  getRoom,
  getRoomsPagination
} from "@/utils/roomsApi";
import { Search, Trash, Plus } from "lucide-react";

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<RoomCreateInput>({
    name: "",
    type: "معمل",
    capacity: 0,
    branchId: 0,
    branchName: ""
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      const data = await getRoomsPagination({ Page: 1, Limit: 100 });
      if (data && data.items) {
        setRooms(data.items);
      } else {
        setRooms([]);
      }
    } catch (error) {
      setRooms([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const filteredRooms = rooms.filter(
    (room) =>
      room.name && room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = [];
    if (!formData.name) validationErrors.push("اسم الغرفة مطلوب");
    if (!formData.type) validationErrors.push("نوع الغرفة مطلوب");
    if (!formData.capacity) validationErrors.push("السعة مطلوبة");
    if (!formData.branchId) validationErrors.push("معرّف الفرع مطلوب");
    if (!formData.branchName) validationErrors.push("اسم الفرع مطلوب");
    if (validationErrors.length) {
      toast({ title: "خطأ", description: validationErrors.join("\n"), variant: "destructive" });
      return;
    }
    try {
      await createRoom(formData);
      fetchRooms();
      setIsDialogOpen(false);
      setFormData({ name: "", type: "معمل", capacity: 0, branchId: 0, branchName: "" });
      toast({ title: "تم إضافة الغرفة بنجاح" });
    } catch (error) {
      toast({ title: "خطأ", description: "فشل في إضافة الغرفة", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteRoom(id);
      toast({ title: "تم حذف الغرفة بنجاح" });
      fetchRooms();
    } catch (error) {
      toast({ title: "خطأ", description: "فشل في حذف الغرفة", variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>قائمة الغرف</CardTitle>
        <CardDescription>إدارة الغرف في النظام</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <Input
            placeholder="بحث عن الغرفة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" /> إضافة غرفة
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إضافة غرفة جديدة</DialogTitle>
                <DialogDescription>يرجى تعبئة جميع الحقول المطلوبة</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">اسم الغرفة *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="مثال: معمل 1"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">نوع الغرفة *</Label>
                    <Input
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      placeholder="مثال: معمل"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">السعة *</Label>
                    <Input
                      id="capacity"
                      name="capacity"
                      type="number"
                      value={formData.capacity}
                      onChange={handleChange}
                      placeholder="مثال: 30"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="branchId">معرّف الفرع *</Label>
                    <Input
                      id="branchId"
                      name="branchId"
                      type="number"
                      value={formData.branchId}
                      onChange={handleChange}
                      placeholder="مثال: 1"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="branchName">اسم الفرع *</Label>
                    <Input
                      id="branchName"
                      name="branchName"
                      value={formData.branchName}
                      onChange={handleChange}
                      placeholder="مثال: فرع الرياض"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">إضافة</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>اسم الغرفة</TableHead>
              <TableHead>نوع الغرفة</TableHead>
              <TableHead>السعة</TableHead>
              <TableHead>اسم الفرع</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRooms.map((room) => (
              <TableRow key={room.id}>
                <TableCell>{room.name}</TableCell>
                <TableCell>{room.type}</TableCell>
                <TableCell>{room.capacity}</TableCell>
                <TableCell>{room.branchName}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(room.id)}
                  >
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Rooms;
