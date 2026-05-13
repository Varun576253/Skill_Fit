import { ShieldCheck, UserRound, UserPlus } from "lucide-react";
import { useLocation } from "wouter";

export default function Landing() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-[#f7f3ec] px-4 py-8 text-foreground">
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-md bg-[#7b241c] text-xl font-bold text-white shadow-sm">
            KA
          </div>
          <p className="text-xs font-semibold uppercase tracking-normal text-[#7b241c]">Government of Karnataka</p>
          <h1 className="mt-2 text-3xl font-bold tracking-normal text-[#24150f]">AI SkillFit</h1>
          <p className="mt-2 text-sm text-muted-foreground">Choose how you want to continue.</p>
        </div>

        <div className="grid gap-3">
          <button
            data-testid="btn-admin-login"
            type="button"
            onClick={() => navigate("/admin/login")}
            className="flex items-center gap-3 rounded-lg border border-[#d9c7ac] bg-white p-4 text-left shadow-sm transition-colors hover:border-[#7b241c]"
          >
            <ShieldCheck className="h-6 w-6 text-[#7b241c]" />
            <span>
              <span className="block text-base font-bold text-[#24150f]">Login as Admin</span>
              <span className="block text-xs text-muted-foreground">Officer dashboard and candidate review</span>
            </span>
          </button>

          <button
            data-testid="btn-user-login"
            type="button"
            onClick={() => navigate("/login")}
            className="flex items-center gap-3 rounded-lg border border-[#d9c7ac] bg-white p-4 text-left shadow-sm transition-colors hover:border-[#7b241c]"
          >
            <UserRound className="h-6 w-6 text-[#7b241c]" />
            <span>
              <span className="block text-base font-bold text-[#24150f]">Login as User</span>
              <span className="block text-xs text-muted-foreground">Use Aadhaar number to open your profile</span>
            </span>
          </button>

          <button
            data-testid="btn-register-user"
            type="button"
            onClick={() => navigate("/register")}
            className="flex items-center gap-3 rounded-lg bg-[#7b241c] p-4 text-left text-white shadow-sm transition-colors hover:bg-[#641c16]"
          >
            <UserPlus className="h-6 w-6" />
            <span>
              <span className="block text-base font-bold">Register User</span>
              <span className="block text-xs text-white/75">Create a demo candidate profile</span>
            </span>
          </button>
        </div>
      </main>
    </div>
  );
}
