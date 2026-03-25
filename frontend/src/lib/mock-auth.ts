import type { User } from "@/types";

const USERS_STORAGE_KEY = "scholarpro_users";
const CURRENT_USER_KEY = "scholarpro_current_user";

export interface DemoAccount {
  email: string;
  password: string;
  user: User;
}

const defaultAccounts: DemoAccount[] = [
  {
    email: "admin@scholarpro.cm",
    password: "admin2026",
    user: {
      id: "usr_001",
      email: "admin@scholarpro.cm",
      first_name: "Jean-Pierre",
      last_name: "Mbarga",
      role: "admin",
      phone: "+237 699 000 001",
      is_active: true,
      created_at: "2025-09-01T00:00:00Z",
      updated_at: "2026-03-01T00:00:00Z",
    },
  },
  {
    email: "prof.kamga@scholarpro.cm",
    password: "prof2026",
    user: {
      id: "usr_002",
      email: "prof.kamga@scholarpro.cm",
      first_name: "Albert",
      last_name: "Kamga",
      role: "teacher",
      phone: "+237 699 000 002",
      is_active: true,
      created_at: "2025-09-01T00:00:00Z",
      updated_at: "2026-03-01T00:00:00Z",
    },
  },
  {
    email: "marie.nguema@scholarpro.cm",
    password: "etudiant2026",
    user: {
      id: "usr_003",
      email: "marie.nguema@scholarpro.cm",
      first_name: "Marie",
      last_name: "Nguema",
      role: "student",
      phone: "+237 699 000 003",
      is_active: true,
      created_at: "2025-09-15T00:00:00Z",
      updated_at: "2026-03-01T00:00:00Z",
    },
  },
  {
    email: "parent.atangana@scholarpro.cm",
    password: "parent2026",
    user: {
      id: "usr_004",
      email: "parent.atangana@scholarpro.cm",
      first_name: "Paul",
      last_name: "Atangana",
      role: "parent",
      phone: "+237 699 000 004",
      is_active: true,
      created_at: "2025-10-01T00:00:00Z",
      updated_at: "2026-03-01T00:00:00Z",
    },
  },
  {
    email: "secretariat@scholarpro.cm",
    password: "staff2026",
    user: {
      id: "usr_005",
      email: "secretariat@scholarpro.cm",
      first_name: "Carine",
      last_name: "Ekotto",
      role: "staff",
      phone: "+237 699 000 005",
      is_active: true,
      created_at: "2025-09-01T00:00:00Z",
      updated_at: "2026-03-01T00:00:00Z",
    },
  },
];

function getStoredAccounts(): DemoAccount[] {
  if (typeof window === "undefined") return defaultAccounts;
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultAccounts));
    return defaultAccounts;
  }
  return JSON.parse(stored);
}

function saveAccounts(accounts: DemoAccount[]): void {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(accounts));
}

export function mockLogin(email: string, password: string): User | null {
  const accounts = getStoredAccounts();
  const account = accounts.find(
    (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
  );
  if (!account) return null;
  if (!account.user.is_active) return null;

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(account.user));
  localStorage.setItem("access_token", `mock_token_${account.user.id}`);
  localStorage.setItem("refresh_token", `mock_refresh_${account.user.id}`);
  return account.user;
}

export function mockLogout(): void {
  localStorage.removeItem(CURRENT_USER_KEY);
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

export function getMockCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(CURRENT_USER_KEY);
  if (!stored) return null;
  return JSON.parse(stored);
}

export function mockRegister(data: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: User["role"];
  phone?: string;
}): { success: boolean; message: string; user?: User } {
  const accounts = getStoredAccounts();

  if (accounts.find((a) => a.email.toLowerCase() === data.email.toLowerCase())) {
    return { success: false, message: "Un compte avec cet email existe deja." };
  }

  const newUser: User = {
    id: `usr_${Date.now()}`,
    email: data.email,
    first_name: data.first_name,
    last_name: data.last_name,
    role: data.role,
    phone: data.phone,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  accounts.push({ email: data.email, password: data.password, user: newUser });
  saveAccounts(accounts);

  return { success: true, message: "Compte cree avec succes!", user: newUser };
}

export function getAllAccounts(): DemoAccount[] {
  return getStoredAccounts();
}

export function getRoleDashboardPath(role: User["role"]): string {
  switch (role) {
    case "admin":
      return "/";
    case "teacher":
      return "/teacher-space";
    case "student":
      return "/student-space";
    case "parent":
      return "/parent-space";
    case "staff":
      return "/staff-space";
    default:
      return "/";
  }
}

export function getRoleLabel(role: User["role"]): string {
  switch (role) {
    case "admin":
      return "Administrateur";
    case "teacher":
      return "Enseignant";
    case "student":
      return "Etudiant";
    case "parent":
      return "Parent";
    case "staff":
      return "Personnel";
    default:
      return role;
  }
}

export function getRoleColor(role: User["role"]): string {
  switch (role) {
    case "admin":
      return "bg-primary-100 text-primary-700";
    case "teacher":
      return "bg-secondary-100 text-secondary-700";
    case "student":
      return "bg-emerald-100 text-emerald-700";
    case "parent":
      return "bg-amber-100 text-amber-700";
    case "staff":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}
