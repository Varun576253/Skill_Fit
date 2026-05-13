import { useRoute, useLocation } from "wouter";
import {
  useGetCandidate,
  useCreateOfficerAction,
  useGetCandidateActions,
  getGetCandidateQueryKey,
  getGetCandidateActionsQueryKey,
} from "@workspace/api-client-react";
import type { OfficerActionBodyAction } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { CLASSIFICATION_LABELS, KARNATAKA_DISTRICTS, LANG_LABELS, TRADES } from "@/lib/constants";

const ACTIONS = [
  { key: "shortlist", label: "Shortlist", color: "bg-green-600 hover:bg-green-700" },
  { key: "send_to_training", label: "Send to Training", color: "bg-amber-600 hover:bg-amber-700" },
  { key: "request_reinterview", label: "Request Re-interview", color: "bg-blue-600 hover:bg-blue-700" },
  { key: "escalate", label: "Escalate", color: "bg-red-600 hover:bg-red-700" },
] as const;

export default function CandidateDetail() {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/admin/candidates/:id");
  const id = parseInt(params?.id ?? "0", 10);
  const queryClient = useQueryClient();
  const [notes, setNotes] = useState("");
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profile, setProfile] = useState({ name: "", phone: "", district: "", trade: "", language: "kn" });

  const { data: candidate, isLoading } = useGetCandidate(id, {
    query: { queryKey: getGetCandidateQueryKey(id) },
  });
  const { data: actions } = useGetCandidateActions(id, {
    query: { queryKey: getGetCandidateActionsQueryKey(id) },
  });
  const actionMutation = useCreateOfficerAction();

  async function saveProfile() {
    const apiBase = import.meta.env.VITE_API_BASE_URL ?? "";
    const res = await fetch(`${apiBase}/api/candidates/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    if (!res.ok) return;
    setIsEditingProfile(false);
    await queryClient.invalidateQueries({ queryKey: getGetCandidateQueryKey(id) });
  }

  async function doAction(action: OfficerActionBodyAction) {
    try {
      await actionMutation.mutateAsync({
        data: {
          candidateId: id,
          interviewId: candidate?.interview?.id ?? null,
          action,
          notes: notes || null,
        },
      });
      setActionSuccess(action);
      setNotes("");
      await queryClient.invalidateQueries({ queryKey: getGetCandidateActionsQueryKey(id) });
      setTimeout(() => setActionSuccess(null), 3000);
    } catch {}
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="p-6 text-center text-muted-foreground">Candidate not found.</div>
    );
  }

  const cls = candidate.classification ? CLASSIFICATION_LABELS[candidate.classification.category] : null;
  const profileValue = isEditingProfile ? profile : {
    name: candidate.name,
    phone: candidate.phone,
    district: candidate.district,
    trade: candidate.trade,
    language: candidate.language,
  };

  return (
    <div className="p-6 max-w-4xl">
      {/* Back button */}
      <button
        onClick={() => navigate("/admin/candidates")}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Candidates
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{candidate.name}</h1>
          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
            <span>{candidate.phone}</span>
            <span>•</span>
            <span>{candidate.trade}</span>
            <span>•</span>
            <span>{candidate.district}</span>
            <span>•</span>
            <span>{LANG_LABELS[candidate.language] || candidate.language}</span>
          </div>
        </div>
        {cls && (
          <span className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${cls.bg} ${cls.color}`}>
            {cls.label}
          </span>
        )}
      </div>

      <div className="mb-6 rounded-xl border border-card-border bg-card p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Candidate Profile</h2>
            <p className="text-xs text-muted-foreground">Officer can correct Aadhaar/demo profile fields like a resume header.</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate(`/admin/candidates/${id}/chat`)}
              className="rounded-lg border border-primary px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/5"
            >
              Open candidate chat
            </button>
            <button
              type="button"
              onClick={() => {
                if (!isEditingProfile) setProfile(profileValue);
                setIsEditingProfile((value) => !value);
              }}
              className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary/90"
            >
              {isEditingProfile ? "Cancel" : "Edit profile"}
            </button>
          </div>
        </div>
        {isEditingProfile ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <input className="rounded-lg border border-input bg-background px-3 py-2 text-sm" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
            <input className="rounded-lg border border-input bg-background px-3 py-2 text-sm" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
            <select className="rounded-lg border border-input bg-background px-3 py-2 text-sm" value={profile.district} onChange={(e) => setProfile({ ...profile, district: e.target.value })}>
              {KARNATAKA_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <select className="rounded-lg border border-input bg-background px-3 py-2 text-sm" value={profile.trade} onChange={(e) => setProfile({ ...profile, trade: e.target.value })}>
              {TRADES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select className="rounded-lg border border-input bg-background px-3 py-2 text-sm" value={profile.language} onChange={(e) => setProfile({ ...profile, language: e.target.value })}>
              <option value="kn">Kannada</option>
              <option value="en">English</option>
            </select>
            <button type="button" onClick={saveProfile} className="rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700">
              Save profile
            </button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-5">
            {[
              ["Name", candidate.name],
              ["Phone", candidate.phone],
              ["District", candidate.district],
              ["Role", candidate.trade],
              ["Language", LANG_LABELS[candidate.language] || candidate.language],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-muted p-3">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Classification */}
          {candidate.classification && (
            <div className="bg-card border border-card-border rounded-xl p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-foreground mb-3">Assessment Result</h2>
              <div className="flex items-center gap-3 mb-3">
                {cls && (
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${cls.bg} ${cls.color}`}>
                    {cls.label}
                  </span>
                )}
                <span className="text-sm text-foreground font-medium">
                  Avg Score: <strong>{candidate.classification.avgScore.toFixed(1)}/10</strong>
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{candidate.classification.reasoning}</p>
            </div>
          )}

          {/* Interview responses */}
          {candidate.interview?.responses && candidate.interview.responses.length > 0 && (
            <div className="bg-card border border-card-border rounded-xl p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-foreground mb-4">Interview Responses</h2>
              <div className="space-y-4">
                {candidate.interview.responses.map((r, i) => (
                  <div key={r.id} className="border border-border rounded-lg p-4">
                    <p className="text-xs font-medium text-primary mb-1">Question {i + 1}</p>
                    <p className="text-sm font-medium text-foreground mb-2">{r.questionText}</p>
                    <div className="bg-muted rounded-lg p-3 mb-3">
                      <p className="text-xs text-muted-foreground mb-1">Transcript</p>
                      <p className="text-sm text-foreground">{r.transcript || "No transcript"}</p>
                    </div>
                    {(r.relevanceScore !== null || r.clarityScore !== null || r.confidenceScore !== null) && (
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        {[
                          { label: "Relevance", value: r.relevanceScore },
                          { label: "Clarity", value: r.clarityScore },
                          { label: "Confidence", value: r.confidenceScore },
                        ].map((score) => (
                          <div key={score.label} className="text-center p-2 bg-accent rounded-lg">
                            <p className="text-lg font-bold text-primary">{score.value?.toFixed(1) ?? "—"}</p>
                            <p className="text-xs text-muted-foreground">{score.label}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {r.geminiReasoning && (
                      <p className="text-xs text-muted-foreground italic">{r.geminiReasoning}</p>
                    )}
                    {r.videoUrl && (
                      <button
                        onClick={() => setActiveVideo(r.videoUrl === activeVideo ? null : (r.videoUrl ?? null))}
                        className="mt-2 text-xs text-primary hover:underline"
                      >
                        {activeVideo === r.videoUrl ? "Hide video" : "Play video"}
                      </button>
                    )}
                    {activeVideo === r.videoUrl && r.videoUrl && (
                      <video src={r.videoUrl} controls className="mt-2 w-full rounded-lg max-h-48" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Integrity */}
          {candidate.integrityCheck && (
            <div className="bg-card border border-card-border rounded-xl p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-foreground mb-3">Integrity Check</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-xl font-bold text-foreground">
                    {candidate.integrityCheck.facePresentPct !== null
                      ? `${Math.round((candidate.integrityCheck.facePresentPct ?? 0) * 100)}%`
                      : "—"}
                  </p>
                  <p className="text-xs text-muted-foreground">Face Present</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-xl font-bold text-foreground">
                    {candidate.integrityCheck.livenessPass === null ? "—" :
                     candidate.integrityCheck.livenessPass ? "Pass" : "Fail"}
                  </p>
                  <p className="text-xs text-muted-foreground">Liveness</p>
                </div>
              </div>
              {candidate.integrityCheck.flags?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {candidate.integrityCheck.flags.map((f) => (
                    <span key={f} className="px-2 py-0.5 bg-destructive/10 text-destructive text-xs rounded-full border border-destructive/20">
                      {f}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar: Actions + Audit log */}
        <div className="space-y-5">
          {/* Officer actions */}
          <div className="bg-card border border-card-border rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-foreground mb-3">Officer Actions</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes (optional)"
              className="w-full text-sm border border-input rounded-lg p-2 bg-background resize-none h-20 mb-3"
            />
            {actionSuccess && (
              <div className="mb-3 p-2 rounded-lg bg-green-50 border border-green-200 text-xs text-green-700 font-medium">
                Action recorded successfully
              </div>
            )}
            <div className="space-y-2">
              {ACTIONS.map((a) => (
                <button
                  key={a.key}
                  data-testid={`action-${a.key}`}
                  onClick={() => doAction(a.key)}
                  disabled={actionMutation.isPending}
                  className={`w-full text-white text-sm font-medium py-2.5 rounded-lg transition-colors disabled:opacity-60 ${a.color}`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Audit log */}
          <div className="bg-card border border-card-border rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-foreground mb-3">Audit Log</h2>
            {actions && actions.length > 0 ? (
              <div className="space-y-3">
                {actions.map((a) => (
                  <div key={a.id} className="text-xs">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-medium text-foreground capitalize">
                        {a.action.replace(/_/g, " ")}
                      </span>
                      <span className="text-muted-foreground">
                        {new Date(a.createdAt).toLocaleDateString("en-IN")}
                      </span>
                    </div>
                    <p className="text-muted-foreground">By {a.officerUsername}</p>
                    {a.notes && <p className="text-foreground italic mt-0.5">{a.notes}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No actions taken yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
