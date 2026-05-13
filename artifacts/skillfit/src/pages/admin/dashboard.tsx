import { useGetDashboardStats, useGetStatsByTrade, useGetStatsByDistrict, useGetRecentActivity } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { AI_FEATURES, CLASSIFICATION_LABELS, GOVT_HIRING_TRACKS } from "@/lib/constants";
import { useState, useEffect } from "react";

const CATEGORY_COLORS: Record<string, string> = {
  job_ready: "#16a34a",
  requires_training: "#d97706",
  manual_verification: "#2563eb",
  poor_quality: "#6b7280",
  suspected_duplicate: "#dc2626",
};

interface ReviewQueueItem {
  candidateId: number;
  candidateName: string;
  phone: string;
  trade: string;
  district: string;
  category: string;
  avgScore: number;
  reasoning: string;
  priority: "high" | "medium" | "low";
  interviewId?: number;
  completedAt?: string | null;
}

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const [reviewQueue, setReviewQueue] = useState<ReviewQueueItem[]>([]);
  const [reviewLoading, setReviewLoading] = useState(true);

  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: byTrade } = useGetStatsByTrade();
  const { data: byDistrict } = useGetStatsByDistrict();
  const { data: activity } = useGetRecentActivity({ limit: 8 });

  // Fetch review queue
  useEffect(() => {
    const fetchReviewQueue = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_BASE_URL ?? "";
        const res = await fetch(`${apiBase}/api/stats/review-queue?limit=10`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setReviewQueue(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to fetch review queue", err);
      } finally {
        setReviewLoading(false);
      }
    };
    fetchReviewQueue();
  }, []);

  const classificationData = stats
    ? [
        { name: "Job Ready", value: stats.jobReadyCount, key: "job_ready" },
        { name: "Training", value: stats.requiresTrainingCount, key: "requires_training" },
        { name: "Manual", value: stats.manualVerificationCount, key: "manual_verification" },
        { name: "Poor", value: stats.poorQualityCount, key: "poor_quality" },
        { name: "Duplicate", value: stats.suspectedDuplicateCount, key: "suspected_duplicate" },
      ]
    : [];

  function timeAgo(ts: string) {
    const diff = Date.now() - new Date(ts).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-0.5">AI for Bharat: Kannada-first Karnataka workforce assessment</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        {GOVT_HIRING_TRACKS.map((track) => (
          <div key={track.id} className="rounded-xl border border-card-border bg-card p-4 shadow-sm">
            <p className="text-sm font-semibold text-foreground">{track.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{track.period}</p>
            <p className="mt-2 text-xs text-foreground/80">{track.aiUse}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        <p className="text-xs font-semibold uppercase tracking-normal text-primary">AI coverage beyond Gemini API</p>
        <p className="mt-2 text-sm text-foreground">{AI_FEATURES.join(" • ")}</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Candidates", value: stats?.totalCandidates ?? 0, color: "text-foreground" },
          { label: "Interviews Done", value: stats?.completedInterviews ?? 0, color: "text-blue-600" },
          { label: "Job Ready", value: stats?.jobReadyCount ?? 0, color: "text-green-600" },
          { label: "Pending Review", value: stats?.pendingReviewCount ?? 0, color: "text-amber-600" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-card-border rounded-xl p-4 shadow-sm">
            <p className="text-xs text-muted-foreground font-medium mb-1">{s.label}</p>
            {statsLoading ? (
              <div className="h-8 bg-muted rounded animate-pulse w-16" />
            ) : (
              <p className={`text-3xl font-bold ${s.color}`}>{s.value.toLocaleString()}</p>
            )}
          </div>
        ))}
      </div>

      {/* Flagged cases — manual verification, poor quality, suspected duplicate */}
      <div className="bg-card border border-card-border rounded-xl p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Review queue</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Flagged interviews awaiting officer action (district, skill, and language filters on the Candidates page)
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/admin/candidates")}
            className="text-xs font-medium text-primary hover:underline"
          >
            Open all candidates →
          </button>
        </div>
        {reviewLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : reviewQueue.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">No flagged cases in the queue</p>
        ) : (
          <ul className="divide-y divide-border rounded-lg border border-border overflow-hidden">
            {reviewQueue.map((item) => {
              const cls = CLASSIFICATION_LABELS[item.category];
              const pri =
                item.priority === "high"
                  ? "bg-red-100 text-red-800 border-red-200"
                  : item.priority === "medium"
                    ? "bg-amber-100 text-amber-900 border-amber-200"
                    : "bg-slate-100 text-slate-700 border-slate-200";
              return (
                <li key={`${item.candidateId}-${item.interviewId ?? item.completedAt}`}>
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/candidates/${item.candidateId}`)}
                    className="w-full text-left px-4 py-3 hover:bg-muted/40 transition-colors flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-foreground truncate">{item.candidateName}</span>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${pri}`}>
                          {item.priority} priority
                        </span>
                        {cls && (
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${cls.bg} ${cls.color}`}>
                            {cls.label}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {item.trade} · {item.district} · {item.phone}
                      </p>
                      <p className="text-xs text-foreground/80 mt-1 line-clamp-2">{item.reasoning}</p>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end gap-2 flex-shrink-0">
                      <span className="text-sm font-bold text-foreground tabular-nums">{item.avgScore.toFixed(1)}</span>
                      <span className="text-[10px] text-muted-foreground">avg / 10</span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Classification breakdown */}
        <div className="bg-card border border-card-border rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground mb-4">Classification Breakdown</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={classificationData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(value, _name, props) => [value, CLASSIFICATION_LABELS[(props.payload as { key: string }).key]?.label ?? ""]}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {classificationData.map((entry) => (
                  <Cell key={entry.key} fill={CATEGORY_COLORS[entry.key]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* By trade */}
        <div className="bg-card border border-card-border rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground mb-4">Candidates by Trade</h2>
          {byTrade && byTrade.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={byTrade} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                <XAxis dataKey="trade" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v, n) => [v, n === "count" ? "Candidates" : "Avg Score"]} />
                <Bar dataKey="count" fill="hsl(27 100% 50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">No data yet</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent activity */}
        <div className="bg-card border border-card-border rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground mb-4">Recent Activity</h2>
          {activity && activity.length > 0 ? (
            <div className="space-y-3">
              {activity.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    a.type === "interview_completed" ? "bg-green-500" :
                    a.type === "candidate_registered" ? "bg-blue-500" : "bg-amber-500"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{a.candidateName}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.trade} •{" "}
                      {a.type === "interview_completed" ? `Interview completed — ${a.classification ? CLASSIFICATION_LABELS[a.classification]?.label : "pending"}` :
                       a.type === "candidate_registered" ? "Registered" :
                       `Action: ${a.action}`}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{timeAgo(a.timestamp)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No recent activity</p>
          )}
        </div>

        {/* By district */}
        <div className="bg-card border border-card-border rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground mb-4">Top Districts</h2>
          {byDistrict && byDistrict.length > 0 ? (
            <div className="space-y-2">
              {byDistrict.slice(0, 8).map((d) => (
                <div key={d.district} className="flex items-center gap-2">
                  <p className="text-sm text-foreground flex-1 min-w-0 truncate">{d.district}</p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${Math.min(100, (d.count / (byDistrict[0]?.count || 1)) * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground w-6 text-right">{d.count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No data yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
