"use client";

import { useAuthStore } from "@/stores/auth-store";
import type { User } from "@/types";

type Role = User["role"];

const WRITE_ROLES: Role[] = ["admin", "staff"];
const TEACHER_WRITE_ROLES: Role[] = ["admin", "staff", "teacher"];
const READ_ONLY_ROLES: Role[] = ["student", "parent"];

export function useRole() {
  const { user } = useAuthStore();
  const role = user?.role || "student";

  return {
    role,
    user,
    // Can create/edit/delete anything (admin, staff)
    canManage: WRITE_ROLES.includes(role),
    // Can create/edit schedule events, grades (admin, staff, teacher)
    canTeach: TEACHER_WRITE_ROLES.includes(role),
    // Read only (student, parent)
    isReadOnly: READ_ONLY_ROLES.includes(role),
    isAdmin: role === "admin",
    isTeacher: role === "teacher",
    isStudent: role === "student",
    isParent: role === "parent",
    isStaff: role === "staff",
  };
}

// Student class mapping (for filtering their schedule/grades)
export function getStudentClass(userId?: string): string {
  // In a real app this would come from the backend
  // For demo, Marie Nguema (student account) is in L2 Informatique A
  return "L2 Informatique A";
}

export function getStudentShortClass(userId?: string): string {
  return "L2 Info A";
}

// Parent's child mapping
export function getParentChildName(): string {
  return "Marc Atangana";
}

export function getParentChildClass(): string {
  return "L2 Informatique A";
}
