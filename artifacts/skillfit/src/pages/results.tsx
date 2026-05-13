import { useLocation } from "wouter";
import { getState, clearState } from "@/lib/store";
import { RESULT_TEXT, CLASSIFICATION_LABELS } from "@/lib/constants";

const ICONS: Record<string, string> = {
  job_ready: "✓",
  requires_training: "★",
  manual_verification: "◎",
  poor_quality: "◈",
  suspected_duplicate: "⚠",
};

export default function Results() {
  const [, navigate] = useLocation();
  const state = getState();
  const lang = state.language || "en";
  const category = state.classification || "manual_verification";
  const avgScore = state.avgScore;

  const textMap = RESULT_TEXT[category]?.[lang] || RESULT_TEXT[category]?.["en"] || { heading: "Assessment Complete", message: "Your result has been recorded." };
  const classInfo = CLASSIFICATION_LABELS[category] || { label: category, color: "text-muted-foreground", bg: "bg-muted" };

  function handleDone() {
    clearState();
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        {/* Result card */}
        <div className="bg-card border border-card-border rounded-2xl shadow-md overflow-hidden mb-6">
          {/* Top banner */}
          <div className="bg-primary px-6 py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
              <span className="text-3xl text-white">{ICONS[category] || "✓"}</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">{textMap.heading}</h1>
            <p className="text-sm text-white/80">
              {lang === "kn" ? "ಮೌಲ್ಯಮಾಪನ ಪೂರ್ಣವಾಗಿದೆ" : "Assessment Complete"}
            </p>
          </div>

          <div className="p-6">
            {/* Classification badge */}
            <div className={`inline-flex items-center px-3 py-1.5 rounded-full border text-sm font-semibold mb-4 ${classInfo.bg} ${classInfo.color}`}>
              {classInfo.label}
            </div>

            {/* Score */}
            {avgScore !== null && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-muted-foreground">
                    {lang === "kn" ? "ಒಟ್ಟಾರೆ ಅಂಕ" : "Overall Score"}
                  </span>
                  <span className="text-sm font-bold text-foreground">{avgScore.toFixed(1)} / 10</span>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-1000"
                    style={{ width: `${(avgScore / 10) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Message */}
            <p className="text-sm text-foreground leading-relaxed mb-4">{textMap.message}</p>

            {/* Candidate info */}
            <div className="bg-muted rounded-lg p-3 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">
                  {lang === "kn" ? "ಹೆಸರು" : "Name"}
                </span>
                <span className="font-medium text-foreground">{state.candidateName}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">
                  {lang === "kn" ? "ವೃತ್ತಿ" : "Trade"}
                </span>
                <span className="font-medium text-foreground">{state.trade}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">
                  {lang === "kn" ? "ಜಿಲ್ಲೆ" : "District"}
                </span>
                <span className="font-medium text-foreground">{state.district}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="bg-accent rounded-xl p-4 mb-6">
          <p className="text-xs text-muted-foreground leading-relaxed">
            {lang === "kn"
              ? "ನಿಮ್ಮ ಮಾಹಿತಿಯನ್ನು ಸಂಬಂಧಿತ ಅಧಿಕಾರಿಗಳು ಪರಿಶೀಲಿಸುತ್ತಾರೆ. ಯಾವುದೇ ಸಂದರ್ಭದಲ್ಲೂ ಅರ್ಜಿ ತಿರಸ್ಕರಿಸಲ್ಪಡುವುದಿಲ್ಲ."
              : "Your information will be reviewed by government officers. No application is ever automatically rejected."}
          </p>
        </div>

        <button
          data-testid="btn-done"
          onClick={handleDone}
          className="w-full bg-primary text-white font-semibold py-4 rounded-xl text-base hover:bg-primary/90 transition-colors shadow-sm"
        >
          {lang === "kn" ? "ಮುಗಿಸಿ" : "Done"}
        </button>
      </div>
    </div>
  );
}
