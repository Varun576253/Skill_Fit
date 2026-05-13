import { useState } from "react";
import { ArrowLeft, CreditCard, LogIn } from "lucide-react";
import { useLocation } from "wouter";
import { setState } from "@/lib/store";

type AadhaarProfile = {
  aadhaarNumber: string;
  name: string;
  phone: string;
  district: string;
  trade: string;
  skills: string;
  workHistory: string;
  contacts: string;
};

export const AADHAAR_SAMPLES: AadhaarProfile[] = [
  {
    aadhaarNumber: "2345 6789 0123",
    name: "Ramesh Gowda",
    phone: "9876543210",
    district: "Tumakuru",
    trade: "Electrician",
    skills: "Electrical helper, safety checks, wiring support, Kannada communication",
    workHistory: "2 years as field helper with a local electrical contractor",
    contacts: "Manjunath, Site Supervisor, 9876501111",
  },
  {
    aadhaarNumber: "3456 7890 1234",
    name: "Lakshmi N",
    phone: "9876501234",
    district: "Belagavi",
    trade: "General Semi-Skilled Helper",
    skills: "Public support, document handling, crowd assistance, basic computer entry",
    workHistory: "Worked at district event registration desks and local help counters",
    contacts: "Shweta Patil, Ward Office Coordinator, 9876502222",
  },
  {
    aadhaarNumber: "4567 8901 2345",
    name: "Naveen Kumar",
    phone: "9876512345",
    district: "Mysuru",
    trade: "Warehouse / Logistics Helper",
    skills: "Route planning, stock movement, log book maintenance, passenger support",
    workHistory: "3 years assisting private transport and delivery vehicles",
    contacts: "Prakash, Fleet Owner, 9876503333",
  },
];

function digits(value: string) {
  return value.replace(/\D/g, "");
}

export default function Register({ mode = "register" }: { mode?: "register" | "login" }) {
  const [, navigate] = useLocation();
  const [aadhaar, setAadhaar] = useState("");
  const [error, setError] = useState<string | null>(null);
  const isLogin = mode === "login";

  function continueToProfile() {
    const normalized = digits(aadhaar);
    const sample = AADHAAR_SAMPLES.find((item) => digits(item.aadhaarNumber) === normalized);

    if (!/^\d{12}$/.test(normalized)) {
      setError("Enter a 12 digit Aadhaar number or choose one of the samples.");
      return;
    }

    const profile = sample ?? {
      aadhaarNumber: aadhaar,
      name: "Demo Candidate",
      phone: `98${normalized.slice(-8)}`,
      district: "Bengaluru Urban",
      trade: "Electrician",
      skills: "Add skills from your work experience",
      workHistory: "Add previous work like a resume",
      contacts: "Add people you worked with and their contact details",
    };

    setState({
      aadhaarNumber: profile.aadhaarNumber,
      candidateName: profile.name,
      phone: profile.phone,
      district: profile.district,
      trade: profile.trade,
      skills: profile.skills,
      workHistory: profile.workHistory,
      contacts: profile.contacts,
      interviewId: null,
      classification: null,
      avgScore: null,
    });
    navigate("/profile");
  }

  return (
    <div className="min-h-screen bg-[#f7f3ec] px-4 py-6 text-foreground">
      <main className="mx-auto max-w-md">
        <header className="mb-6 flex items-center gap-3">
          <button
            data-testid="btn-back"
            type="button"
            onClick={() => navigate("/")}
            className="rounded-md p-2 text-[#7b241c] transition-colors hover:bg-white"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <p className="text-xs font-semibold uppercase tracking-normal text-[#7b241c]">AI SkillFit</p>
            <h1 className="text-xl font-bold text-[#24150f]">{isLogin ? "User Login" : "Register User"}</h1>
          </div>
        </header>

        <section className="rounded-lg border border-[#d9c7ac] bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-start gap-3">
            <div className="rounded-md bg-[#fff4df] p-2 text-[#7b241c]">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#24150f]">Enter Aadhaar Number</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Only Aadhaar number is needed here. Profile details open on the next screen.
              </p>
            </div>
          </div>

          <label className="mb-2 block text-sm font-semibold text-[#4a2a18]" htmlFor="aadhaar">
            Aadhaar number
          </label>
          <input
            id="aadhaar"
            data-testid="input-aadhaar"
            value={aadhaar}
            onChange={(event) => {
              setAadhaar(event.target.value);
              setError(null);
            }}
            inputMode="numeric"
            maxLength={14}
            placeholder="1234 5678 9012"
            className="h-12 w-full rounded-md border border-[#d9c7ac] bg-[#fffaf2] px-3 text-base font-semibold outline-none transition-colors focus:border-[#7b241c]"
          />

          {error && <p className="mt-3 rounded-md bg-red-50 p-3 text-sm font-medium text-red-700">{error}</p>}

          <button
            data-testid="btn-aadhaar-continue"
            type="button"
            onClick={continueToProfile}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-[#7b241c] px-4 py-4 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#641c16]"
          >
            <LogIn className="h-5 w-5" />
            {isLogin ? "Login and View Profile" : "Continue to Profile"}
          </button>
        </section>

        <section className="mt-5">
          <p className="mb-3 text-sm font-bold text-[#24150f]">Sample Aadhaar numbers</p>
          <div className="grid gap-3">
            {AADHAAR_SAMPLES.map((sample) => (
              <button
                key={sample.aadhaarNumber}
                data-testid={`sample-aadhaar-${digits(sample.aadhaarNumber)}`}
                type="button"
                onClick={() => {
                  setAadhaar(sample.aadhaarNumber);
                  setError(null);
                }}
                className="rounded-lg border border-[#d9c7ac] bg-white p-4 text-left shadow-sm transition-colors hover:border-[#7b241c]"
              >
                <span className="block text-base font-bold text-[#24150f]">{sample.aadhaarNumber}</span>
                <span className="mt-1 block text-xs text-muted-foreground">{sample.name} · {sample.trade}</span>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
