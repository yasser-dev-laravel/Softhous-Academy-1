import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { toast } from "sonner";

// List of all help tables and their API endpoints
const HELP_TABLES = [
  { key: "Area", name: "المناطق", endpoint: "/api/HelpTables/Area" },
  // { key: "Branch", name: "الفروع", endpoint: "/api/HelpTables/Branch" }, // تم تعطيله لأن السيرفر لا يدعم POST
  { key: "Category", name: "التصنيفات", endpoint: "/api/HelpTables/Category" },
  // { key: "City", name: "المدن", endpoint: "/api/HelpTables/City" }, // تم تعطيله لأن السيرفر لا يدعم POST
  { key: "EducationalQualificationDescription", name: "وصف المؤهل العلمي", endpoint: "/api/HelpTables/EducationalQualificationDescription" },
  { key: "EducationalQualificationIssuer", name: "جهة إصدار المؤهل العلمي", endpoint: "/api/HelpTables/EducationalQualificationIssuer" },
  { key: "EducationalQualificationType", name: "نوع المؤهل العلمي", endpoint: "/api/HelpTables/EducationalQualificationType" },
  { key: "GroupDays", name: "أيام المجموعات", endpoint: "/api/HelpTables/GroupDays" },
  { key: "GroupStatus", name: "حالة المجموعة", endpoint: "/api/HelpTables/GroupStatus" },
  { key: "Permission", name: "الصلاحيات", endpoint: "/api/HelpTables/Permission" },
  { key: "Room", name: "الغرف", endpoint: "/api/HelpTables/Room" },
  { key: "StudentFlowStep", name: "خطوات الطالب", endpoint: "/api/HelpTables/StudentFlowStep" },
  { key: "RoomType", name: "أنواع الغرف", endpoint: "/api/HelpTables/RoomType" },
  { key: "SalaryType", name: "أنواع الرواتب", endpoint: "/api/HelpTables/SalaryType" },
];

// Helper for API requests
async function fetchTableData(endpoint: string) {
  const res = await fetch(endpoint, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } });
  if (!res.ok) throw new Error("خطأ في جلب البيانات");
  return res.json();
}
async function addTableRow(endpoint: string, row: any) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify(row)
  });
  if (!res.ok) throw new Error("خطأ في الإضافة");
  return res.json();
}
async function deleteTableRow(endpoint: string, id: number | string) {
  const res = await fetch(`${endpoint}/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
  });
  if (!res.ok) throw new Error("خطأ في الحذف");
  return true;
}

const HelpTables = () => {
  const [tableStates, setTableStates] = useState<Record<string, { data: any[]; loading: boolean; isDialogOpen: boolean; newRow: { Name: string }; editRowId: string | null; editRowValue: string }>>(
    Object.fromEntries(HELP_TABLES.map(t => [t.key, { data: [], loading: false, isDialogOpen: false, newRow: { Name: "" }, editRowId: null, editRowValue: "" }]))
  );

  // تحميل بيانات كل جدول عند فتح الاكورديون لأول مرة
  const fetchTable = async (tableKey: string, endpoint: string) => {
    setTableStates(prev => ({ ...prev, [tableKey]: { ...prev[tableKey], loading: true } }));
    try {
      const data = await fetchTableData(endpoint);
      setTableStates(prev => ({ ...prev, [tableKey]: { ...prev[tableKey], data, loading: false } }));
    } catch {
      setTableStates(prev => ({ ...prev, [tableKey]: { ...prev[tableKey], loading: false } }));
      toast("تعذر تحميل البيانات");
    }
  };

  // إضافة صف جديد
  const handleAdd = async (e: React.FormEvent, tableKey: string, endpoint: string) => {
    e.preventDefault();
    try {
      await addTableRow(endpoint, tableStates[tableKey].newRow);
      toast("تمت الإضافة بنجاح");
      setTableStates(prev => ({
        ...prev,
        [tableKey]: {
          ...prev[tableKey],
          isDialogOpen: false,
          newRow: { Name: "" }
        }
      }));
      fetchTable(tableKey, endpoint);
    } catch {
      toast("فشل في الإضافة");
    }
  };

  // حذف صف
  const handleDelete = async (tableKey: string, endpoint: string, id: string | number) => {
    try {
      await deleteTableRow(endpoint, id);
      toast("تم الحذف");
      fetchTable(tableKey, endpoint);
    } catch {
      toast("فشل في الحذف");
    }
  };

  // بدء التعديل
  const handleStartEdit = (tableKey: string, row: any) => {
    setTableStates(prev => ({
      ...prev,
      [tableKey]: {
        ...prev[tableKey],
        editRowId: row.Id,
        editRowValue: row.Name
      }
    }));
  };

  // حفظ التعديل
  const handleSaveEdit = async (tableKey: string, endpoint: string) => {
    const rowId = tableStates[tableKey].editRowId;
    const value = tableStates[tableKey].editRowValue;
    if (!rowId) return;
    try {
      await fetch(`${endpoint}/${rowId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ Name: value })
      });
      toast("تم التعديل");
      setTableStates(prev => ({
        ...prev,
        [tableKey]: { ...prev[tableKey], editRowId: null, editRowValue: "" }
      }));
      fetchTable(tableKey, endpoint);
    } catch {
      toast("فشل في التعديل");
    }
  };

  // إلغاء التعديل
  const handleCancelEdit = (tableKey: string) => {
    setTableStates(prev => ({
      ...prev,
      [tableKey]: { ...prev[tableKey], editRowId: null, editRowValue: "" }
    }));
  };

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">جداول المساعدة</h2>
      <Accordion type="multiple" className="w-full">
        {HELP_TABLES.map(table => (
          <AccordionItem key={table.key} value={table.key} onClick={() => tableStates[table.key].data.length === 0 && fetchTable(table.key, table.endpoint)}>
            <AccordionTrigger>{table.name}</AccordionTrigger>
            <AccordionContent>
              <div className="mb-4 flex justify-end">
                <Button onClick={() => setTableStates(prev => ({ ...prev, [table.key]: { ...prev[table.key], isDialogOpen: true } }))}>إضافة {table.name}</Button>
              </div>
              <Dialog open={tableStates[table.key].isDialogOpen} onOpenChange={open => setTableStates(prev => ({ ...prev, [table.key]: { ...prev[table.key], isDialogOpen: open } }))}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>إضافة {table.name}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={e => handleAdd(e, table.key, table.endpoint)}>
                    <Input
                      placeholder={`اسم ${table.name}`}
                      value={tableStates[table.key].newRow.Name}
                      onChange={e => setTableStates(prev => ({ ...prev, [table.key]: { ...prev[table.key], newRow: { Name: e.target.value } } }))}
                      required
                    />
                    <DialogFooter>
                      <Button type="submit">إضافة</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الرقم</TableHead>
                    <TableHead>الاسم</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableStates[table.key].loading ? (
                    <TableRow><TableCell colSpan={3}>جاري التحميل...</TableCell></TableRow>
                  ) : tableStates[table.key].data.length === 0 ? (
                    <TableRow><TableCell colSpan={3}>لا توجد بيانات</TableCell></TableRow>
                  ) : (
                    tableStates[table.key].data.map((row: any) => (
                      <TableRow key={row.Id}>
                        <TableCell>{row.Id}</TableCell>
                        <TableCell>
                          {tableStates[table.key].editRowId === row.Id ? (
                            <div className="flex gap-2">
                              <Input
                                value={tableStates[table.key].editRowValue}
                                onChange={e => setTableStates(prev => ({ ...prev, [table.key]: { ...prev[table.key], editRowValue: e.target.value } }))}
                                className="w-32"
                              />
                              <Button size="sm" variant="outline" onClick={() => handleSaveEdit(table.key, table.endpoint)}>حفظ</Button>
                              <Button size="sm" variant="ghost" onClick={() => handleCancelEdit(table.key)}>إلغاء</Button>
                            </div>
                          ) : (
                            row.Name
                          )}
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline" onClick={() => handleStartEdit(table.key, row)}>تعديل</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(table.key, table.endpoint, row.Id)}>حذف</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default HelpTables;
