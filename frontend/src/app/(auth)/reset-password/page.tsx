"use client";

import * as React from "react";
import Link from "next/link";
import { GraduationCap, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  const passwordError = confirmPassword && password !== confirmPassword
    ? "Les mots de passe ne correspondent pas"
    : undefined;

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-foreground">
            ISCE <span className="text-primary-600">Alternance</span>
          </span>
        </div>

        {submitted ? (
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-success-100">
              <CheckCircle2 className="h-8 w-8 text-success-500" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Mot de passe mis a jour</h2>
            <p className="text-sm text-muted-foreground">
              Votre mot de passe a ete reinitialise avec succes. Vous pouvez maintenant
              vous connecter avec votre nouveau mot de passe.
            </p>
            <Link href="/login">
              <Button className="mt-4">Se connecter</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">
                Reinitialiser le mot de passe
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Choisissez un nouveau mot de passe securise pour votre compte.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Nouveau mot de passe"
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 8 caracteres"
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
                hint="Minimum 8 caracteres avec majuscule, minuscule et chiffre"
                required
              />

              <Input
                label="Confirmer le mot de passe"
                type={showConfirm ? "text" : "password"}
                placeholder="Confirmez votre mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                leftIcon={<Lock className="h-4 w-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
                error={passwordError}
                required
              />

              {/* Password strength */}
              <div className="space-y-2">
                <div className="flex gap-1">
                  <div className={`h-1.5 flex-1 rounded-full ${password.length >= 2 ? "bg-error-400" : "bg-muted"}`} />
                  <div className={`h-1.5 flex-1 rounded-full ${password.length >= 5 ? "bg-warning-400" : "bg-muted"}`} />
                  <div className={`h-1.5 flex-1 rounded-full ${password.length >= 8 ? "bg-success-400" : "bg-muted"}`} />
                  <div className={`h-1.5 flex-1 rounded-full ${password.length >= 12 ? "bg-success-500" : "bg-muted"}`} />
                </div>
                <p className="text-xs text-muted-foreground">
                  {password.length === 0
                    ? "Entrez un mot de passe"
                    : password.length < 5
                    ? "Faible"
                    : password.length < 8
                    ? "Moyen"
                    : password.length < 12
                    ? "Fort"
                    : "Tres fort"}
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={isLoading}
                disabled={!password || !confirmPassword || password !== confirmPassword}
              >
                Reinitialiser le mot de passe
              </Button>
            </form>
          </>
        )}

        <p className="mt-10 text-center text-xs text-muted-foreground">
          ISCE Alternance &copy; 2026. Tous droits reserves.
        </p>
      </div>
    </div>
  );
}
