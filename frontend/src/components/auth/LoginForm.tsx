"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { validateEmail } from "@/lib/formValidation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });
  const [notice, setNotice] = useState<string | null>(null);

  const emailError = validateEmail(email);
  const passwordError =
    !password ? "Password is required." : password.length < 6 ? "Password must be at least 6 characters." : null;

  const isFormValid = !emailError && !passwordError;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (!isFormValid) return;

    setNotice(
      "The student and mentor authentication backend is currently being connected. User login will be enabled in the upcoming release. For course credentials or support, please reach out via our admissions or contact page."
    );
  }

  const baseInputStyle =
    "w-full rounded-xl border bg-white/[0.05] px-4 py-3 text-base sm:text-sm text-white outline-none transition placeholder:text-white/30 focus:ring-2";

  const labelStyle = "mb-2 block text-xs font-medium text-white/75 sm:text-sm";

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-[#24344f] p-5 text-white shadow-[0_12px_30px_rgba(15,50,80,0.12)] sm:p-7">
      {/* Portal status badge */}
      <div className="mb-5 rounded-xl border border-amber-400/25 bg-amber-400/10 p-3 text-xs leading-5 text-amber-200">
        <span className="font-semibold text-amber-300">Notice:</span> Backend
        authentication system is currently pending integration. Portal logins
        will be active once database accounts are provisioned.
      </div>

      <form noValidate onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label htmlFor="login-email" className={labelStyle}>
            Email Address <span className="text-red-400">*</span>
          </label>
          <input
            id="login-email"
            type="email"
            name="email"
            autoComplete="username"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
            placeholder="you@example.com"
            required
            aria-invalid={touched.email && !!emailError}
            aria-describedby={
              touched.email && emailError ? "login-email-error" : undefined
            }
            className={`${baseInputStyle} ${
              touched.email && emailError
                ? "border-red-400/80 focus:border-red-400 focus:ring-red-400/20"
                : "border-white/10 focus:border-sky-400 focus:ring-sky-400/10"
            }`}
          />
          {touched.email && emailError && (
            <p
              id="login-email-error"
              className="mt-1.5 text-xs font-medium text-red-300"
              role="alert"
            >
              {emailError}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="login-password" className={labelStyle}>
              Password <span className="text-red-400">*</span>
            </label>
            <span className="text-[11px] text-white/50">
              Min 6 characters
            </span>
          </div>
          <input
            id="login-password"
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
            placeholder="••••••••"
            required
            aria-invalid={touched.password && !!passwordError}
            aria-describedby={
              touched.password && passwordError ? "login-password-error" : undefined
            }
            className={`${baseInputStyle} ${
              touched.password && passwordError
                ? "border-red-400/80 focus:border-red-400 focus:ring-red-400/20"
                : "border-white/10 focus:border-sky-400 focus:ring-sky-400/10"
            }`}
          />
          {touched.password && passwordError && (
            <p
              id="login-password-error"
              className="mt-1.5 text-xs font-medium text-red-300"
              role="alert"
            >
              {passwordError}
            </p>
          )}
        </div>

        {/* Remember me & Forgot */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <label className="flex cursor-pointer items-center gap-2 text-white/70">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-white/20 bg-white/10 text-sky-500 focus:ring-sky-400/30"
            />
            Remember me
          </label>
          <button
            type="button"
            onClick={() =>
              setNotice(
                "Password recovery service will be activated alongside the authentication backend."
              )
            }
            className="text-sky-300 underline underline-offset-2 hover:text-sky-200"
          >
            Forgot password?
          </button>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={!isFormValid}
          className="mt-4 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/15 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-red-600"
        >
          Sign In to Portal
          <span aria-hidden="true">→</span>
        </button>

        {notice && (
          <div
            role="status"
            className="mt-4 rounded-xl border border-sky-300/20 bg-sky-300/10 p-3 text-xs leading-5 text-sky-100"
          >
            {notice}
          </div>
        )}

        {/* Not registered */}
        <div className="border-t border-white/10 pt-4 text-center text-xs text-white/60">
          Don&apos;t have an account?{" "}
          <Link
            href="/admissions"
            className="font-medium text-sky-300 underline underline-offset-2 hover:text-sky-200"
          >
            Apply for Admission
          </Link>
        </div>
      </form>
    </div>
  );
}
