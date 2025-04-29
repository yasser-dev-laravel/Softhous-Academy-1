import { saveToLocalStorage, getFromLocalStorage, generateId } from "./localStorage";
import { Employee } from "../types/Employees";
import { Branch } from "../types/Branches";
import { Lab } from "../types/Labs";
import { Department } from "../types/Departments";
import { Role } from "../types/Roles";
import { Permission } from "../types/Permissions";
import { CourseLevel } from "../types/CourseLevels";
import { Course } from "../types/Courses";
import { Payment } from "../types/Payments";
import { Group } from "../types/Groups";
import { Lecture } from "../types/Lectures";
import { LectureAttendance } from "../types/LectureAttendances";
import { Student } from "../types/Students";

// Initialize data
export const initializeData = () => {
  // Egyptian governorates
  const governorates = [
    "القاهرة",
    "الجيزة",
    "الإسكندرية",
    "البحر الأحمر",
    "البحيرة",
    "بني سويف",
    "بورسعيد",
    "جنوب سيناء",
    "الدقهلية",
    "دمياط",
    "سوهاج",
    "السويس",
    "الشرقية",
    "شمال سيناء",
    "الغربية",
    "الفيوم",
    "القليوبية",
    "قنا",
    "كفر الشيخ",
    "مطروح",
    "المنوفية",
    "المنيا",
    "الوادي الجديد"
  ];

  // Set governorates
  if (!localStorage.getItem("latin_academy_governorates")) {
    saveToLocalStorage("latin_academy_governorates", governorates);
  }
  
  // Set default roles if they don't exist
  if (!localStorage.getItem("latin_academy_roles")) {
    const defaultRoles: Role[] = [
      {
        id: generateId('role-'),
        code: "ROL001",
        name: "مدير النظام",
        permissions: [
          { screen: "employees", view: true, add: true, edit: true, delete: true },
          { screen: "branches", view: true, add: true, edit: true, delete: true },
          { screen: "labs", view: true, add: true, edit: true, delete: true },
          { screen: "departments", view: true, add: true, edit: true, delete: true },
          { screen: "courses", view: true, add: true, edit: true, delete: true },
          { screen: "roles", view: true, add: true, edit: true, delete: true },
          { screen: "teachers", view: true, add: true, edit: true, delete: true },
          { screen: "students", view: true, add: true, edit: true, delete: true },
          { screen: "groups", view: true, add: true, edit: true, delete: true },
          { screen: "attendance", view: true, add: true, edit: true, delete: true },
          { screen: "finance", view: true, add: true, edit: true, delete: true },
          { screen: "messaging", view: true, add: true, edit: true, delete: true },
        ]
      },
      {
        id: generateId('role-'),
        code: "ROL002",
        name: "موظف استقبال",
        permissions: [
          { screen: "students", view: true, add: true, edit: true, delete: false },
          { screen: "groups", view: true, add: false, edit: false, delete: false },
          { screen: "finance", view: true, add: true, edit: false, delete: false },
        ]
      },
      {
        id: generateId('role-'),
        code: "ROL003",
        name: "مدرس",
        permissions: [
          { screen: "students", view: true, add: false, edit: false, delete: false },
          { screen: "groups", view: true, add: false, edit: false, delete: false },
          { screen: "attendance", view: true, add: true, edit: true, delete: false },
        ]
      }
    ];
    saveToLocalStorage("latin_academy_roles", defaultRoles);
  }
  
  // Set default departments if they don't exist
  if (!localStorage.getItem("latin_academy_departments")) {
    const defaultDepartments: Department[] = [
      {
        id: generateId('dept-'),
        code: "DEP001",
        name: "اللغة الإنجليزية",
      },
      {
        id: generateId('dept-'),
        code: "DEP002",
        name: "الكمبيوتر",
      },
      {
        id: generateId('dept-'),
        code: "DEP003",
        name: "تعليم الأطفال",
      }
    ];
    saveToLocalStorage("latin_academy_departments", defaultDepartments);
  }

  // Set default branches if they don't exist  
  if (!localStorage.getItem("latin_academy_branches")) {
    const defaultBranches: Branch[] = [
      {
        id: generateId('branch-'),
        code: "BR001",
        name: "الفرع الرئيسي - المعادي",
        governorate: "القاهرة",
      },
      {
        id: generateId('branch-'),
        code: "BR002",
        name: "فرع الإسكندرية",
        governorate: "الإسكندرية",
      },
    ];
    saveToLocalStorage("latin_academy_branches", defaultBranches);
  }

  // Set default labs if they don't exist
  if (!localStorage.getItem("latin_academy_labs")) {
    const branches = getFromLocalStorage<Branch[]>("latin_academy_branches", []);
    if (branches.length > 0) {
      const defaultLabs: Lab[] = [
        {
          id: generateId('lab-'),
          code: "LAB001",
          name: "معمل الكمبيوتر 1",
          location: "الطابق الأول",
          capacity: 20,
          type: "computer",
          branchId: branches[0].id,
        },
        {
          id: generateId('lab-'),
          code: "LAB002",
          name: "قاعة اللغات 1",
          location: "الطابق الثاني",
          capacity: 15,
          type: "language",
          branchId: branches[0].id,
        }
      ];
      saveToLocalStorage("latin_academy_labs", defaultLabs);
    }
  }

  // Set default employees if they don't exist
  if (!localStorage.getItem("latin_academy_employees")) {
    const roles = getFromLocalStorage<Role[]>("latin_academy_roles", []);
    if (roles.length > 0) {
      const defaultEmployees: Employee[] = [
        {
          id: generateId('emp-'),
          name: "محمد أحمد",
          birthDate: "1985-05-15",
          nationalId: "28505151234567",
          qualification: "بكالوريوس إدارة أعمال",
          status: "active",
          salary: 5000,
          paymentMethod: "monthly",
          paymentAmount: 5000,
          roleId: roles[0].id,
        },
        {
          id: generateId('emp-'),
          name: "سارة محمود",
          birthDate: "1990-08-20",
          nationalId: "29008201234567",
          qualification: "ليسانس آداب",
          status: "active",
          salary: 3500,
          paymentMethod: "monthly",
          paymentAmount: 3500,
          roleId: roles[1].id,
        }
      ];
      saveToLocalStorage("latin_academy_employees", defaultEmployees);
    }
  }

  // Set default courses if they don't exist
  if (!localStorage.getItem("latin_academy_courses")) {
    const departments = getFromLocalStorage<Department[]>("latin_academy_departments", []);
    if (departments.length > 0) {
      const defaultCourses: Course[] = [
        {
          id: generateId('course-'),
          code: "CRS001",
          name: "اللغة الإنجليزية للمبتدئين",
          description: "دورة شاملة في أساسيات اللغة الإنجليزية",
          departmentId: departments[0].id,
          totalDuration: 48,
          totalPrice: 1500,
          levels: [
            {
              id: generateId('level-'),
              code: "CRS001-1",
              courseName: "اللغة الإنجليزية للمبتدئين",
              levelNumber: 1,
              lectureCount: 12,
              lectureDuration: 2,
              price: 500,
            },
            {
              id: generateId('level-'),
              code: "CRS001-2",
              courseName: "اللغة الإنجليزية للمبتدئين",
              levelNumber: 2,
              lectureCount: 12,
              lectureDuration: 2,
              price: 500,
            },
            {
              id: generateId('level-'),
              code: "CRS001-3",
              courseName: "اللغة الإنجليزية للمبتدئين",
              levelNumber: 3,
              lectureCount: 12,
              lectureDuration: 2,
              price: 500,
            },
          ],
        },
        {
          id: generateId('course-'),
          code: "CRS002",
          name: "أساسيات الكمبيوتر والإنترنت",
          description: "تعلم المهارات الأساسية للتعامل مع الكمبيوتر والإنترنت",
          departmentId: departments[1].id,
          totalDuration: 30,
          totalPrice: 1200,
          levels: [
            {
              id: generateId('level-'),
              code: "CRS002-1",
              courseName: "أساسيات الكمبيوتر والإنترنت",
              levelNumber: 1,
              lectureCount: 10,
              lectureDuration: 3,
              price: 1200,
            },
          ],
        },
      ];
      saveToLocalStorage("latin_academy_courses", defaultCourses);
    }
  }

  // Initialize other empty collections
  if (!localStorage.getItem("latin_academy_students")) {
    saveToLocalStorage("latin_academy_students", []);
  }
  
  if (!localStorage.getItem("latin_academy_teachers")) {
    saveToLocalStorage("latin_academy_teachers", []);
  }
  
  if (!localStorage.getItem("latin_academy_groups")) {
    saveToLocalStorage("latin_academy_groups", []);
  }
  
  if (!localStorage.getItem("latin_academy_leads")) {
    saveToLocalStorage("latin_academy_leads", []);
  }
  
  if (!localStorage.getItem("latin_academy_payments")) {
    saveToLocalStorage("latin_academy_payments", []);
  }
};
