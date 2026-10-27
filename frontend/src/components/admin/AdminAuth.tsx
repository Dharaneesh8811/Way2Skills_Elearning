"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { courseRequest } from "@/lib/coursesApi";

type AdminProfile = {
  id: string;
  email: string;
  is_active: boolean;
};

type AdminAuthValue = {
  admin: AdminProfile | null;
  token: string | null;
  pagePath: string;
  pageTitle: string;
  setPage: (path: string, title: string) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

export function useAdminAuth(): AdminAuthValue {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider.");
  }
  return context;
}

export function useAdminPage(path: string, title: string): void {
  const { setPage } = useAdminAuth();
  useEffect(() => setPage(path, title), [path, setPage, title]);
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [pagePath, setPagePath] = useState("/admin");
  const [pageTitle, setPageTitle] = useState("Dashboard");

  const logout = useCallback(() => {
    setToken(null);
    setAdmin(null);
    setExpiresAt(null);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await courseRequest<{
      access_token: string;
      expires_in: number;
    }>("/api/auth/login", undefined, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const profile = await courseRequest<AdminProfile>("/api/auth/me", result.access_token);
    setToken(result.access_token);
    setAdmin(profile);
    setExpiresAt(Date.now() + result.expires_in * 1000);
  }, []);
  const setPage = useCallback((path: string, title: string) => {
    setPagePath(path);
    setPageTitle(title);
  }, []);

  useEffect(() => {
    if (!token || expiresAt === null) return;
    const timer = window.setTimeout(logout, Math.max(0, expiresAt - Date.now()));
    return () => window.clearTimeout(timer);
  }, [expiresAt, logout, token]);

  const value = useMemo(
    () => ({ admin, token, pagePath, pageTitle, setPage, login, logout }),
    [admin, login, logout, pagePath, pageTitle, setPage, token]
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function AdminLogin() {
  const { login } = useAdminAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login(email, password);
      setPassword("");
      router.replace("/admin");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Sign-in could not be completed."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold text-sky-700">Way2Skills Admin</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
          Administrator sign in
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Sign in with the administrator account created for the backend.
        </p>
        {error && (
          <p className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800" role="alert">
            {error}
          </p>
        )}
        <form className="mt-6 space-y-4" onSubmit={submit}>
          <label className="block text-sm font-medium text-slate-700" htmlFor="admin-email">
            Email
            <input
              autoComplete="username"
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
              id="admin-email"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </label>
          <label className="block text-sm font-medium text-slate-700" htmlFor="admin-password">
            Password
            <input
              autoComplete="current-password"
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
              id="admin-password"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>
          <button
            className="min-h-11 w-full rounded-full bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={busy}
            type="submit"
          >
            {busy ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="mt-5 text-xs leading-5 text-slate-500">
          The API URL is configured with <code>NEXT_PUBLIC_WAY2SKILLS_API_URL</code>.
          The bearer token stays in memory and is cleared on reload or expiry.
        </p>
      </section>
    </main>
  );
}
