"use client";

import * as React from "react";
import Link from "next/link";
import { GraduationCap, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export default function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-[55%] relative gradient-primary flex-col justify-between p-12 text-white overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-32 right-10 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-white/15 blur-2xl" />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight">ScholarPro</span>
          </div>
        </div>

        {/* Center content */}
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
              <p className="text-3xl font-bold">1,200+</p>
              <p className="text-sm text-white/60">Etudiants geres</p>
            </div>
            <div>
              <p className="text-3xl font-bold">86</p>
              <p className="text-sm text-white/60">Enseignants</p>
            </div>
            <div>
              <p className="text-3xl font-bold">98%</p>
              <p className="text-sm text-white/60">Satisfaction</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10">
          <p className="text-sm text-white/50">
            Utilise par les meilleurs etablissements d&apos;Afrique Centrale
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex w-full lg:w-[45%] flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-[400px]">
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

          {/* Demo credentials hint */}
          <div className="mt-6 rounded-xl bg-muted/50 border border-border p-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">Compte de demonstration:</p>
            <p className="text-xs text-muted-foreground">Email: admin@scholarpro.cm</p>
            <p className="text-xs text-muted-foreground">Mot de passe: demo2026</p>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-muted-foreground">
            ScholarPro &copy; 2026. Tous droits reserves.
          </p>
        </div>
      </div>
    </div>
  );
}
