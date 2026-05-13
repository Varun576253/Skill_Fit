import { useRoute, useLocation } from "wouter";
import { useGetCandidate, getGetCandidateQueryKey } from "@workspace/api-client-react";
import { useState } from "react";

const DRAFTS = [
  {
    title: "Re-interview",
    kn: "ನಮಸ್ಕಾರ, ನಿಮ್ಮ ವಿಡಿಯೋ/ಆಡಿಯೋ ಸ್ಪಷ್ಟವಾಗಿರಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಹೊಸ ಸಂದರ್ಶನ ಲಿಂಕ್ ಬಳಸಿ ಮತ್ತೆ ಉತ್ತರಿಸಿ.",
    en: "Hello, your video/audio was unclear. Please use the new interview link and answer again.",
  },
  {
    title: "Training",
    kn: "ನಿಮ್ಮ ಉತ್ತರಗಳ ಆಧಾರದ ಮೇಲೆ ಚಿಕ್ಕ ತರಬೇತಿ ಸಹಾಯಕವಾಗಬಹುದು. ಅಧಿಕಾರಿಗಳು ಮುಂದಿನ ಹಂತವನ್ನು ತಿಳಿಸುತ್ತಾರೆ.",
    en: "Based on your responses, a short training step may help. Officers will share the next step.",
  },
  {
    title: "Shortlist",
    kn: "ಅಭಿನಂದನೆಗಳು. ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಮುಂದಿನ ಪರಿಶೀಲನೆಗೆ ಶಾರ್ಟ್‌ಲಿಸ್ಟ್ ಆಗಿದೆ.",
    en: "Congratulations. Your profile has been shortlisted for the next review step.",
  },
];

export default function CandidateChat() {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/admin/candidates/:id/chat");
  const id = parseInt(params?.id ?? "0", 10);
  const { data: candidate } = useGetCandidate(id, {
    query: { queryKey: getGetCandidateQueryKey(id) },
  });
  const [message, setMessage] = useState(DRAFTS[0].kn);
  const [sent, setSent] = useState(false);

  return (
    <div className="p-6 max-w-4xl">
      <button
        onClick={() => navigate(`/admin/candidates/${id}`)}
        className="mb-5 text-sm text-muted-foreground hover:text-foreground"
      >
        Back to candidate
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Candidate Chat</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Kannada-first officer follow-up for {candidate?.name ?? "candidate"}.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-xl border border-card-border bg-card p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-foreground">AI draft assistant</h2>
          <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
            Pick a government-style draft. The officer can edit it before sending. This is a demo chat link; production can connect WhatsApp/SMS.
          </p>
          <div className="space-y-2">
            {DRAFTS.map((draft) => (
              <button
                key={draft.title}
                type="button"
                onClick={() => setMessage(candidate?.language === "en" ? draft.en : draft.kn)}
                className="w-full rounded-lg border border-border bg-background p-3 text-left hover:bg-muted/50"
              >
                <p className="text-sm font-semibold text-foreground">{draft.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{draft.kn}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-card-border bg-card p-5 shadow-sm">
          <div className="mb-4 rounded-lg bg-muted p-3">
            <p className="text-xs text-muted-foreground">To</p>
            <p className="text-sm font-semibold text-foreground">
              {candidate?.name ?? "Candidate"} {candidate?.phone ? `• ${candidate.phone}` : ""}
            </p>
          </div>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="h-44 w-full resize-none rounded-lg border border-input bg-background p-3 text-sm outline-none focus:border-primary"
          />
          {sent && (
            <div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3 text-xs font-medium text-green-700">
              Demo message queued. Connect WhatsApp credentials to send in production.
            </div>
          )}
          <button
            type="button"
            onClick={() => setSent(true)}
            className="mt-4 w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary/90"
          >
            Queue demo message
          </button>
        </section>
      </div>
    </div>
  );
}
