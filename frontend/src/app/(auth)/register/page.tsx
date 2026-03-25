"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Shield,
  Users,
  BookOpen,
  UserCheck,
  Briefcase,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockRegister, getRoleDashboardPath } from "@/lib/mock-auth";
import type { User as UserType } from "@/types";

const roles: { value: UserType["role"]; label: string; icon: React.ElementType; description: string; color: string }[] = [
  {
    value: "admin",
    label: "Administrateur",
    icon: Shield,
    description: "Gestion complete de l'etablissement",
    color: "border-primary-300 bg-primary-50 text-primary-700",
  },
  {
    value: "teacher",
    label: "Enseignant",
    icon: Users,
    description: "Cours, notes et suivi des etudiants",
    color: "border-secondary-300 bg-secondary-50 text-secondary-700",
  },
  {
    value: "student",
    label: "Etudiant",
    icon: BookOpen,
    description: "Acces aux cours, notes et emploi du temps",
    color: "border-emerald-300 bg-emerald-50 text-emerald-700",
  },
  {
    value: "parent",
    label: "Parent",
    icon: UserCheck,
    description: "Suivi de la scolarite de votre enfant",
    color: "border-amber-300 bg-amber-50 text-amber-700",
  },
  {
    value: "staff",
    label: "Personnel",
    icon: Briefcase,
    description: "Administration et gestion quotidienne",
    color: "border-purple-300 bg-purple-50 text-purple-700",
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = React.useState<1 | 2 | 3>(1);
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(false);

  const [formData, setFormData] = React.useState({
    role: "" as UserType["role"] | "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleRoleSelect = (role: UserType["role"]) => {
    setFormData({ ...formData, role });
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caracteres.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const result = mockRegister({
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        role: formData.role as UserType["role"],
        phone: formData.phone,
      });

      if (result.success) {
        setSuccess(true);
        setStep(3);
      } else {
        setError(result.message);
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-[45%] relative gradient-primary flex-col justify-between p-12 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-32 right-10 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight">ISCE Alternance</span>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-3xl font-bold leading-tight tracking-tight">
            Rejoignez la communaute
            <br />
            <span className="text-white/80">ISCE Alternance</span>
          </h1>
          <p className="text-lg text-white/70 max-w-md leading-relaxed">
            Creez votre compte en quelques etapes simples et accedez a votre espace personnalise.
          </p>

          {/* Steps indicator */}
          <div className="flex items-center gap-4 pt-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                    step >= s ? "bg-white text-primary-600" : "bg-white/20 text-white/60"
                  }`}
                >
                  {step > s ? <CheckCircle2 className="h-5 w-5" /> : s}
                </div>
                <span className={`text-sm ${step >= s ? "text-white" : "text-white/40"}`}>
                  {s === 1 ? "Role" : s === 2 ? "Informations" : "Termine"}
                </span>
                {s < 3 && <div className={`w-8 h-0.5 ${step > s ? "bg-white" : "bg-white/20"}`} />}
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-sm text-white/50">
            Deja un compte?{" "}
            <Link href="/login" className="text-white underline underline-offset-2 hover:text-white/90">
              Se connecter
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex w-full lg:w-[55%] flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-[520px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-foreground">
              ISCE <span className="text-primary-600">Alternance</span>
            </span>
          </div>

          {/* Step 1: Role Selection */}
          {step === 1 && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground tracking-tight">
                  Creer un compte
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Choisissez votre role pour commencer
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {roles.map((role) => {
                  const Icon = role.icon;
                  return (
                    <button
                      key={role.value}
                      onClick={() => handleRoleSelect(role.value)}
                      className={`flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all hover:shadow-md ${
                        formData.role === role.value
                          ? role.color
                          : "border-border hover:border-primary-200 hover:bg-muted/30"
                      }`}
                    >
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                        formData.role === role.value ? "bg-white/60" : "bg-muted"
                      }`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{role.label}</p>
                        <p className="text-sm text-muted-foreground">{role.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Deja un compte?{" "}
                <Link href="/login" className="font-medium text-primary-600 hover:text-primary-700">
                  Se connecter
                </Link>
              </p>
            </div>
          )}

          {/* Step 2: User Information */}
          {step === 2 && (
            <div>
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour au choix du role
              </button>

              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-foreground tracking-tight">
                    Vos informations
                  </h2>
                  <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                    roles.find((r) => r.value === formData.role)?.color || ""
                  }`}>
                    {roles.find((r) => r.value === formData.role)?.label}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Remplissez les informations ci-dessous pour creer votre compte
                </p>
              </div>

              {error && (
                <div className="mb-4 rounded-lg bg-error-50 border border-error-200 p-3 text-sm text-error-600">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Prenom"
                    type="text"
                    placeholder="Ex: Marie"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    leftIcon={<User className="h-4 w-4" />}
                    required
                  />
                  <Input
                    label="Nom"
                    type="text"
                    placeholder="Ex: Nguema"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    leftIcon={<User className="h-4 w-4" />}
                    required
                  />
                </div>

                <Input
                  label="Adresse email"
                  type="email"
                  placeholder="nom@isce-alternance.fr"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  leftIcon={<Mail className="h-4 w-4" />}
                  required
                />

                <Input
                  label="Telephone"
                  type="tel"
                  placeholder="+33 1 XX XX XX XX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  leftIcon={<Phone className="h-4 w-4" />}
                />

                <div className="relative">
                  <Input
                    label="Mot de passe"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimum 6 caracteres"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    leftIcon={<Lock className="h-4 w-4" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="hover:text-foreground transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    }
                    required
                  />
                </div>

                <Input
                  label="Confirmer le mot de passe"
                  type={showPassword ? "text" : "password"}
                  placeholder="Retapez votre mot de passe"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  leftIcon={<Lock className="h-4 w-4" />}
                  required
                />

                <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                  Creer mon compte
                </Button>
              </form>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && success && (
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success-100 mb-6">
                <CheckCircle2 className="h-10 w-10 text-success-600" />
              </div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight mb-2">
                Compte cree avec succes!
              </h2>
              <p className="text-muted-foreground mb-2">
                Bienvenue <span className="font-semibold">{formData.first_name} {formData.last_name}</span>
              </p>
              <p className="text-sm text-muted-foreground mb-8">
                Votre compte <span className="font-medium">{roles.find((r) => r.value === formData.role)?.label}</span> a ete cree.
                Vous pouvez maintenant vous connecter.
              </p>

              <div className="rounded-xl bg-muted/50 border border-border p-4 mb-6 text-left">
                <p className="text-xs font-medium text-muted-foreground mb-2">Vos identifiants:</p>
                <p className="text-sm text-foreground">Email: <span className="font-mono">{formData.email}</span></p>
                <p className="text-sm text-foreground">Role: {roles.find((r) => r.value === formData.role)?.label}</p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setStep(1);
                    setSuccess(false);
                    setFormData({
                      role: "",
                      first_name: "",
                      last_name: "",
                      email: "",
                      phone: "",
                      password: "",
                      confirmPassword: "",
                    });
                  }}
                >
                  Creer un autre compte
                </Button>
                <Button className="flex-1" onClick={() => router.push("/login")}>
                  Se connecter
                </Button>
              </div>
            </div>
          )}

          <p className="mt-8 text-center text-xs text-muted-foreground">
            ISCE Alternance &copy; 2026. Tous droits reserves.
          </p>
        </div>
      </div>
    </div>
  );
}
