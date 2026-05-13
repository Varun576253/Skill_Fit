import { ChangeEvent, ReactElement, ReactNode, useState } from "react";
import { ArrowLeft, Camera, Edit3, Mic, Save, UserRound } from "lucide-react";
import { useLocation } from "wouter";
import { useRegisterCandidate, useStartInterview } from "@workspace/api-client-react";
import { GOVT_HIRING_TRACKS, KARNATAKA_DISTRICTS, TRADES } from "@/lib/constants";
import { getState, setState } from "@/lib/store";

type EditableProfile = {
  candidateName: string;
  phone: string;
  district: string;
  trade: string;
  profilePhoto: string;
  skills: string;
  workHistory: string;
  contacts: string;
};

export default function Profile() {
  const [, navigate] = useLocation();
  const state = getState();
  const registerMutation = useRegisterCandidate();
  const startInterviewMutation = useStartInterview();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<EditableProfile>({
    candidateName: state.candidateName,
    phone: state.phone,
    district: state.district,
    trade: state.trade,
    profilePhoto: state.profilePhoto,
    skills: state.skills,
    workHistory: state.workHistory,
    contacts: state.contacts,
  });

  if (!state.aadhaarNumber) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f3ec] p-4">
        <div className="max-w-sm rounded-lg border border-[#d9c7ac] bg-white p-6 text-center shadow-sm">
          <p className="mb-4 text-sm text-muted-foreground">Please login or register with Aadhaar first.</p>
          <button onClick={() => navigate("/")} className="rounded-md bg-[#7b241c] px-5 py-3 font-semibold text-white">
            Go to Start
          </button>
        </div>
      </div>
    );
  }

  function updateField<K extends keyof EditableProfile>(key: K, value: EditableProfile[K]) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  function handlePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateField("profilePhoto", String(reader.result ?? ""));
    reader.readAsDataURL(file);
  }

  function saveProfile() {
    setState(profile);
    setIsEditing(false);
  }

  async function startInterview() {
    setError(null);
    const snapshot = { ...profile };
    setState(snapshot);

    try {
      let candidateId = state.candidateId;
      if (!candidateId) {
        const candidate = await registerMutation.mutateAsync({
          data: {
            name: snapshot.candidateName || "Demo Candidate",
            phone: snapshot.phone || "9876543210",
            district: snapshot.district || "Bengaluru Urban",
            trade: snapshot.trade || "Electrician",
            language: state.language || "en",
            deviceFingerprint: navigator.userAgent.slice(0, 100),
          },
        });
        candidateId = candidate.id;
        setState({
          candidateId,
          candidateName: candidate.name,
          phone: candidate.phone,
          district: candidate.district,
          trade: candidate.trade,
        });
      }

      const interview = await startInterviewMutation.mutateAsync({ data: { candidateId } });
      setState({ interviewId: interview.id });
      navigate("/interview");
    } catch (err) {
      const apiError = err as { data?: { error?: string }; message?: string };
      setError(apiError.data?.error ?? apiError.message ?? "Unable to start interview.");
    }
  }

  const busy = registerMutation.isPending || startInterviewMutation.isPending;

  return (
    <div className="min-h-screen bg-[#f7f3ec] px-4 py-6 text-foreground">
      <main className="mx-auto max-w-3xl">
        <header className="mb-5 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="rounded-md p-2 text-[#7b241c] transition-colors hover:bg-white"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <p className="text-xs font-semibold uppercase tracking-normal text-[#7b241c]">Candidate Profile</p>
            <h1 className="text-xl font-bold text-[#24150f]">My Profile</h1>
          </div>
          <button
            type="button"
            onClick={isEditing ? saveProfile : () => setIsEditing(true)}
            className="ml-auto flex items-center gap-2 rounded-md border border-[#d9c7ac] bg-white px-3 py-2 text-sm font-semibold text-[#7b241c]"
          >
            {isEditing ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
            {isEditing ? "Save" : "Edit"}
          </button>
        </header>

        <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-lg border border-[#d9c7ac] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#fff4df] text-[#7b241c]">
                {profile.profilePhoto ? (
                  <img src={profile.profilePhoto} alt="" className="h-full w-full object-cover" />
                ) : (
                  <UserRound className="h-10 w-10" />
                )}
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-xl font-bold text-[#24150f]">{profile.candidateName || "Demo Candidate"}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{profile.trade}</p>
                <p className="mt-1 text-xs font-semibold text-[#7b241c]">Aadhaar: {state.aadhaarNumber}</p>
              </div>
            </div>

            {isEditing && (
              <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-md border border-[#d9c7ac] bg-[#fffaf2] px-3 py-3 text-sm font-semibold text-[#7b241c]">
                <Camera className="h-4 w-4" />
                Add / Change Image
                <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
              </label>
            )}

            <div className="mt-5 grid gap-3 text-sm">
              <Info label="Phone" value={profile.phone} />
              <Info label="District" value={profile.district} />
              <Info label="Recruitment Role" value={profile.trade} />
            </div>
          </div>

          <div className="rounded-lg border border-[#d9c7ac] bg-white p-5 shadow-sm">
            <div className="grid gap-4">
              <Field label="Full name" editing={isEditing}>
                <input value={profile.candidateName} onChange={(event) => updateField("candidateName", event.target.value)} className="form-input" />
              </Field>
              <Field label="Mobile number" editing={isEditing}>
                <input value={profile.phone} onChange={(event) => updateField("phone", event.target.value)} className="form-input" />
              </Field>
              <Field label="District" editing={isEditing}>
                <select value={profile.district} onChange={(event) => updateField("district", event.target.value)} className="form-input">
                  {KARNATAKA_DISTRICTS.map((district) => <option key={district} value={district}>{district}</option>)}
                </select>
              </Field>
              <Field label="Recruitment role" editing={isEditing}>
                <select value={profile.trade} onChange={(event) => updateField("trade", event.target.value)} className="form-input">
                  {TRADES.map((trade) => <option key={trade} value={trade}>{trade}</option>)}
                </select>
              </Field>
              <Field label="Skills" editing={isEditing}>
                <textarea value={profile.skills} onChange={(event) => updateField("skills", event.target.value)} className="form-input min-h-24" />
              </Field>
              <Field label="Work history / resume" editing={isEditing}>
                <textarea value={profile.workHistory} onChange={(event) => updateField("workHistory", event.target.value)} className="form-input min-h-24" />
              </Field>
              <Field label="Contacts worked with" editing={isEditing}>
                <textarea value={profile.contacts} onChange={(event) => updateField("contacts", event.target.value)} className="form-input min-h-24" />
              </Field>
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-lg border border-[#d9c7ac] bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-[#24150f]">Available interview tracks</p>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {GOVT_HIRING_TRACKS.map((track) => (
              <div key={track.id} className="rounded-md bg-[#fffaf2] p-3">
                <p className="text-sm font-semibold text-[#24150f]">{track.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{track.roles.join(", ")}</p>
              </div>
            ))}
          </div>
          {error && <p className="mt-4 rounded-md bg-red-50 p-3 text-sm font-medium text-red-700">{error}</p>}
          <button
            data-testid="btn-start-interview"
            type="button"
            onClick={startInterview}
            disabled={busy}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-[#7b241c] px-4 py-4 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#641c16] disabled:opacity-60"
          >
            <Mic className="h-5 w-5" />
            {busy ? "Preparing interview..." : "Take Interview"}
          </button>
        </section>
      </main>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-[#fffaf2] p-3">
      <p className="text-xs font-semibold uppercase tracking-normal text-[#7b241c]">{label}</p>
      <p className="mt-1 font-medium text-[#24150f]">{value || "-"}</p>
    </div>
  );
}

function Field({ label, editing, children }: { label: string; editing: boolean; children: ReactNode }) {
  const child = children as ReactElement<{ value?: string }>;
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#4a2a18]">{label}</span>
      {editing ? children : <p className="rounded-md bg-[#fffaf2] p-3 text-sm leading-relaxed text-[#24150f]">{child.props.value || "-"}</p>}
    </label>
  );
}
