"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Eye, EyeOff, Mail, Lock, Shield, Users, BookOpen, UserCheck, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { mockLogin, getRoleDashboardPath, getRoleLabel } from "@/lib/mock-auth";
import { useAuthStore } from "@/stores/auth-store";
import type { User } from "@/types";

const demoAccounts: { email: string; password: string; role: User["role"]; name: string; icon: React.ElementType; color: string }[] = [
  { email: "admin@scholarpro.cm", password: "admin2026", role: "admin", name: "Jean-Pierre M.", icon: Shield, color: "bg-primary-100 text-primary-600 border-primary-200" },
  { email: "prof.kamga@scholarpro.cm", password: "prof2026", role: "teacher", name: "Dr. Kamga", icon: Users, color: "bg-secondary-100 text-secondary-600 border-secondary-200" },
  { email: "marie.nguema@scholarpro.cm", password: "etudiant2026", role: "student", name: "Marie N.", icon: BookOpen, color: "bg-emerald-100 text-emerald-600 border-emerald-200" },
  { email: "parent.atangana@scholarpro.cm", password: "parent2026", role: "parent", name: "Paul A.", icon: UserCheck, color: "bg-amber-100 text-amber-600 border-amber-200" },
  { email: "secretariat@scholarpro.cm", password: "staff2026", role: "staff", name: "Carine E.", icon: Briefcase, color: "bg-purple-100 text-purple-600 border-purple-200" },
];

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      const user = mockLogin(email, password);
      if (user) {
        setUser(user);
        router.push(getRoleDashboardPath(user.role));
      } else {
        setError("Email ou mot de passe incorrect.");
      }
      setIsLoading(false);
    }, 800);
  };

  const handleDemoLogin = (account: typeof demoAccounts[0]) => {
    setEmail(account.email);
    setPassword(account.password);
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      const user = mockLogin(account.email, account.password);
      if (user) {
        setUser(user);
        router.push(getRoleDashboardPath(user.role));
      }
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-[55%] relative gradient-primary flex-col justify-between p-12 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-32 right-10 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-white/15 blur-2xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight">ScholarPro</span>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-bold leading-tight tracking-tight">
            La plateforme de gestion scolaire
            <br />
            <span className="text-white/80">nouvelle generation</span>
          </h1>
          <p className="text-lg text-white/70 max-w-md leading-relaxed">
            Simplifiez la gestion de votre etablissement avec des outils puissants et intuitifs pour
            les etudiants, enseignants et administrateurs.
          </p>
          <div className="flex gap-8 pt-4">
            <div>
              <p className="text-3xl font-bold">5</p>
              <p className="text-sm text-white/60">Types de comptes</p>
            </div>
            <div>
              <p className="text-3xl font-bold">1,200+</p>
              <p className="text-sm text-white/60">Etudiants geres</p>
            </div>
            <div>
              <p className="text-3xl font-bold">98%</p>
              <p className="text-sm text-white/60">Satisfaction</p>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-sm text-white/50">
            Utilise par les meilleurs etablissements d&apos;Afrique Centrale
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex w-full lg:w-[45%] flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Scholar<span className="text-primary-600">Pro</span>
            </span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              Bienvenue
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Connectez-vous a votre compte pour continuer
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 rounded-lg bg-error-50 border border-error-200 p-3 text-sm text-error-600">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Adresse email"
              type="email"
              placeholder="nom@etablissement.cm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="h-4 w-4" />}
              required
            />

            <div className="relative">
              <Input
                label="Mot de passe"
                type={showPassword ? "text" : "password"}
                placeholder="Entrez votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            <div className="flex items-center justify-between">
              <Checkbox id="remember" label="Se souvenir de moi" />
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                Mot de passe oublie?
              </Link>
            </div>

            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
              Se connecter
            </Button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6">
            <p className="text-xs font-medium text-muted-foreground mb-3">Connexion rapide (comptes demo):</p>
            <div className="grid grid-cols-1 gap-2">
              {demoAccounts.map((account) => {
                const Icon = account.icon;
                return (
                  <button
                    key={account.email}
                    onClick={() => handleDemoLogin(account)}
                    disabled={isLoading}
                    className={`flex items-center gap-3 rounded-lg border p-2.5 text-left transition-all hover:shadow-sm disabled:opacity-50 ${account.color}`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium">{getRoleLabel(account.role)}</p>
                      <p className="text-[10px] opacity-70 truncate">{account.email}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Register link */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Pas encore de compte?{" "}
            <Link href="/register" className="font-medium text-primary-600 hover:text-primary-700 transition-colors">
              Creer un compte
            </Link>
          </p>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            ScholarPro &copy; 2026. Tous droits reserves.
          </p>
        </div>
      </div>
    </div>
  );
}
