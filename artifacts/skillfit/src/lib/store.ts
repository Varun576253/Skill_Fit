// Simple state management via React Context + sessionStorage
// No external state library needed

export interface InterviewState {
  candidateId: number | null;
  candidateName: string;
  aadhaarNumber: string;
  language: "kn" | "en";
  trade: string;
  district: string;
  phone: string;
  profilePhoto: string;
  skills: string;
  workHistory: string;
  contacts: string;
  interviewId: number | null;
  classification: string | null;
  avgScore: number | null;
}

const STORAGE_KEY = "skillfit_state";

export function getState(): InterviewState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as InterviewState;
  } catch {}
  return {
    candidateId: null,
    candidateName: "",
    aadhaarNumber: "",
    language: "kn",
    trade: "",
    district: "",
    phone: "",
    profilePhoto: "",
    skills: "",
    workHistory: "",
    contacts: "",
    interviewId: null,
    classification: null,
    avgScore: null,
  };
}

export function setState(partial: Partial<InterviewState>) {
  const current = getState();
  const next = { ...current, ...partial };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function clearState() {
  sessionStorage.removeItem(STORAGE_KEY);
}
