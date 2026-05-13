import { useState } from "react";
import { useLocation } from "wouter";
import { useListCandidates, getListCandidatesQueryKey } from "@workspace/api-client-react";
import { CLASSIFICATION_LABELS, TRADES, KARNATAKA_DISTRICTS, LANGUAGES } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminCandidates() {
  const [, navigate] = useLocation();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [trade, setTrade] = useState("all");
  const [district, setDistrict] = useState("all");
  const [language, setLanguage] = useState("all");
  const [classification, setClassification] = useState("all");

  const params = {
    page,
    limit: 20,
    ...(search ? { search } : {}),
    ...(trade !== "all" ? { trade } : {}),
    ...(district !== "all" ? { district } : {}),
    ...(language !== "all" ? { language } : {}),
    ...(classification !== "all" ? { classification } : {}),
  };

  const { data, isLoading } = useListCandidates(params, {
    query: { queryKey: getListCandidatesQueryKey(params) },
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Candidates</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          {data ? `${data.total} total candidates` : "Loading..."}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-card border border-card-border rounded-xl p-4 mb-5 shadow-sm">
        <div className="flex flex-wrap gap-3">
          <Input
            data-testid="input-search"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="h-9 w-48"
          />
          <Select value={trade} onValueChange={(v) => { setTrade(v); setPage(1); }}>
            <SelectTrigger data-testid="filter-trade" className="h-9 w-36">
              <SelectValue placeholder="Trade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Trades</SelectItem>
              {TRADES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={classification} onValueChange={(v) => { setClassification(v); setPage(1); }}>
            <SelectTrigger data-testid="filter-classification" className="h-9 w-44">
              <SelectValue placeholder="Classification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classifications</SelectItem>
              {Object.entries(CLASSIFICATION_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={language} onValueChange={(v) => { setLanguage(v); setPage(1); }}>
            <SelectTrigger data-testid="filter-language" className="h-9 w-32">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              {LANGUAGES.map((l) => <SelectItem key={l.code} value={l.code}>{l.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={district} onValueChange={(v) => { setDistrict(v); setPage(1); }}>
            <SelectTrigger data-testid="filter-district" className="h-9 w-40">
              <SelectValue placeholder="District" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Districts</SelectItem>
              {KARNATAKA_DISTRICTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-card-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Name</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Trade</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">District</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Language</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Classification</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Score</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-muted rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : data?.candidates?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground text-sm">
                    No candidates found
                  </td>
                </tr>
              ) : (
                data?.candidates?.map((c) => {
                  const cls = c.classification ? CLASSIFICATION_LABELS[c.classification] : null;
                  return (
                    <tr
                      key={c.id}
                      data-testid={`row-candidate-${c.id}`}
                      onClick={() => navigate(`/admin/candidates/${c.id}`)}
                      className="hover:bg-muted/30 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-foreground">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.phone}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">{c.trade}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{c.district}</td>
                      <td className="px-4 py-3 text-sm text-foreground uppercase">{c.language}</td>
                      <td className="px-4 py-3">
                        {cls ? (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cls.bg} ${cls.color}`}>
                            {cls.label}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            {c.interviewStatus === "in_progress" ? "In progress" : "Not started"}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {c.avgScore != null ? c.avgScore.toFixed(1) : "—"}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {new Date(c.createdAt).toLocaleDateString("en-IN")}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.total > data.limit && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Showing {(page - 1) * data.limit + 1}–{Math.min(page * data.limit, data.total)} of {data.total}
            </p>
            <div className="flex gap-2">
              <button
                data-testid="btn-prev"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-xs rounded-lg border border-border hover:bg-muted disabled:opacity-40 transition-colors"
              >
                Previous
              </button>
              <button
                data-testid="btn-next"
                onClick={() => setPage((p) => p + 1)}
                disabled={page * data.limit >= data.total}
                className="px-3 py-1.5 text-xs rounded-lg border border-border hover:bg-muted disabled:opacity-40 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
