"use client";

import * as React from "react";
import Link from "next/link";
import { GraduationCap, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [email, setEmail] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-foreground">
            Scholar<span className="text-primary-600">Pro</span>
          </span>
        </div>

        {submitted ? (
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-success-100">
              <CheckCircle2 className="h-8 w-8 text-success-500" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Email envoye</h2>
            <p className="text-sm text-muted-foreground">
              Si un compte existe avec l&apos;adresse <strong>{email}</strong>, vous recevrez un lien
              de reinitialisation dans quelques minutes.
            </p>
            <Link href="/login">
              <Button variant="outline" className="mt-4 gap-2">
                <ArrowLeft className="h-4 w-4" />
                Retour a la connexion
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">
                Mot de passe oublie?
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Entrez votre adresse email et nous vous enverrons un lien pour reinitialiser
                votre mot de passe.
              </p>
            </div>

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

              <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                Envoyer le lien
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour a la connexion
              </Link>
            </div>
          </>
        )}

        <p className="mt-10 text-center text-xs text-muted-foreground">
          ScholarPro &copy; 2026. Tous droits reserves.
        </p>
      </div>
    </div>
  );
}
