export const KARNATAKA_DISTRICTS = [
  "Bengaluru Urban", "Bengaluru Rural", "Mysuru", "Mandya", "Hassan",
  "Tumakuru", "Kolar", "Ramanagara", "Shivamogga", "Ballari",
  "Davanagere", "Dharwad", "Belagavi", "Vijayapura", "Kalaburagi",
  "Yadgir", "Bidar", "Raichur", "Koppal", "Dakshina Kannada",
];

export const TRADES = [
  "Junior Powerman / Lineman Helper",
  "Police Constable Support Staff",
  "Electrician",
  "Welder",
  "Mason / Construction Helper",
  "Driver / Vehicle Assistant",
  "Plumber",
  "Machine Operator",
];

export const GOVT_HIRING_TRACKS = [
  {
    id: "escom-powerman",
    title: "Karnataka ESCOM / KPTCL field recruitment",
    titleKn: "ಕರ್ನಾಟಕ ESCOM / KPTCL ಕ್ಷೇತ್ರ ನೇಮಕಾತಿ",
    period: "Demo focus: recent 3-5 year blue-collar hiring pattern",
    roles: ["Junior Powerman / Lineman Helper", "Electrician", "Driver / Vehicle Assistant"],
    aiUse: "Kannada voice interview, safety-skill scoring, Aadhaar/demo autofill, training recommendation",
  },
  {
    id: "ksp-constable",
    title: "Karnataka State Police constable and support recruitment",
    titleKn: "ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ ಕಾನ್ಸ್ಟೇಬಲ್ ಮತ್ತು ಸಹಾಯಕ ನೇಮಕಾತಿ",
    period: "Demo focus: recent 3-5 year mass recruitment pattern",
    roles: ["Police Constable Support Staff", "Driver / Vehicle Assistant", "General Semi-Skilled Helper"],
    aiUse: "Kannada screening, integrity checks, physical readiness prompts, officer chat follow-up",
  },
];

export const AI_FEATURES = [
  "Aadhaar-assisted profile autofill with demo fallback",
  "Kannada-first speech recognition and browser TTS",
  "AI interviewer question selection by trade and difficulty",
  "AI transcript cleanup through voice/video transcription",
  "Gemini scoring for relevance, clarity, confidence, and reasoning",
  "Face visibility and liveness-style integrity checks",
  "Duplicate-risk signals using phone, device, and face embedding hooks",
  "Officer review queue with priority reasoning",
  "Candidate chat draft assistant for Kannada follow-up",
  "Training recommendation instead of auto rejection",
];

export const KARNATAKA_DISTRICTS_I18N: Record<string, string[]> = {
  en: KARNATAKA_DISTRICTS,
  kn: [
    "ಬೆಂಗಳೂರು ನಗರ", "ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ", "ಮೈಸೂರು", "ಮಂಡ್ಯ", "ಹಾಸನ",
    "ತುಮಕೂರು", "ಕೋಲಾರ", "ರಾಮನಗರ", "ಶಿವಮೊಗ್ಗ", "ಬಳ್ಳಾರಿ",
    "ದಾವಣಗೆರೆ", "ಧಾರವಾಡ", "ಬೆಳಗಾವಿ", "ವಿಜಯಪುರ", "ಕಲಬುರಗಿ",
    "ಯಾದಗಿರಿ", "ಬೀದರ್", "ರಾಯಚೂರು", "ಕೊಪ್ಪಳ", "ದಕ್ಷಿಣ ಕನ್ನಡ",
  ],
};

export const TRADES_I18N: Record<string, string[]> = {
  en: TRADES,
  kn: [
    "ಜೂನಿಯರ್ ಪವರ್‌ಮ್ಯಾನ್ / ಲೈನ್‌ಮ್ಯಾನ್ ಸಹಾಯಕ",
    "ಪೊಲೀಸ್ ಕಾನ್ಸ್ಟೇಬಲ್ ಸಹಾಯಕ ಸಿಬ್ಬಂದಿ",
    "ವಿದ್ಯುತ್ ತಂತ್ರಜ್ಞ",
    "ಬೆಸುಗೆಗಾರ",
    "ಮೇಸ್ತ್ರಿ / ಕಟ್ಟಡ ಸಹಾಯಕ",
    "ಚಾಲಕ / ವಾಹನ ಸಹಾಯಕ",
    "ಪ್ಲಂಬರ್",
    "ಯಂತ್ರ ಚಾಲಕ",
  ],
};

export const LANGUAGES = [
  { code: "kn" as const, label: "ಕನ್ನಡ", name: "Kannada first" },
  { code: "en" as const, label: "English", name: "English" },
];

export const LANG_LABELS: Record<string, string> = {
  kn: "Kannada",
  en: "English",
};

export const CLASSIFICATION_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  job_ready: { label: "Job Ready", color: "text-green-700", bg: "bg-green-50 border-green-200" },
  requires_training: { label: "Requires Training", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  manual_verification: { label: "Manual Verification", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  poor_quality: { label: "Poor Quality", color: "text-gray-600", bg: "bg-gray-50 border-gray-200" },
  suspected_duplicate: { label: "Suspected Duplicate", color: "text-red-700", bg: "bg-red-50 border-red-200" },
};

export const SPEECH_LANG_MAP: Record<string, string> = {
  kn: "kn-IN",
  en: "en-IN",
};

export const WELCOME_TEXT: Record<string, { heading: string; sub: string; start: string }> = {
  kn: {
    heading: "ಕನ್ನಡ AI ಉದ್ಯೋಗ ಸಹಾಯ",
    sub: "ಆಧಾರ್‌ನಿಂದ ಮಾಹಿತಿ ಬರಲಿ. ಕಡಿಮೆ ಟೈಪ್ ಮಾಡಿ, ಧ್ವನಿಯಲ್ಲಿ ಉತ್ತರಿಸಿ.",
    start: "ಆರಂಭಿಸಿ",
  },
  en: {
    heading: "Kannada-first AI hiring",
    sub: "Aadhaar/demo autofill, voice interview, and officer review for blue-collar government roles.",
    start: "Start demo",
  },
};

export const RESULT_TEXT: Record<string, Record<string, { heading: string; message: string }>> = {
  job_ready: {
    kn: { heading: "ಉದ್ಯೋಗಕ್ಕೆ ಸಿದ್ಧ", message: "ನಿಮ್ಮ ಉತ್ತರಗಳು ಬಲವಾಗಿವೆ. ಅಧಿಕಾರಿಗಳು ಮುಂದಿನ ಹಂತಕ್ಕಾಗಿ ಸಂಪರ್ಕಿಸುತ್ತಾರೆ." },
    en: { heading: "Job ready", message: "Your responses are strong. Officers will contact you for the next step." },
  },
  requires_training: {
    kn: { heading: "ತರಬೇತಿ ಶಿಫಾರಸು", message: "ನಿಮಗೆ ಸ್ವಲ್ಪ ತರಬೇತಿ ಸಹಾಯವಾಗಬಹುದು. ಅರ್ಜಿ ತಿರಸ್ಕಾರವಾಗುವುದಿಲ್ಲ." },
    en: { heading: "Training recommended", message: "Some training may help. This is not an automatic rejection." },
  },
  manual_verification: {
    kn: { heading: "ಅಧಿಕಾರಿ ಪರಿಶೀಲನೆ", message: "ನಿಮ್ಮ ಅರ್ಜಿಯನ್ನು ಅಧಿಕಾರಿಗಳು ಪರಿಶೀಲಿಸುತ್ತಾರೆ." },
    en: { heading: "Officer review", message: "Your application will be reviewed by officers." },
  },
  poor_quality: {
    kn: { heading: "ಮರು ಸಂದರ್ಶನ ಬೇಕು", message: "ಆಡಿಯೋ ಅಥವಾ ವಿಡಿಯೋ ಸ್ಪಷ್ಟವಾಗಿರಲಿಲ್ಲ. ಅಧಿಕಾರಿಗಳು ಮತ್ತೆ ಸಂದರ್ಶನ ಕಳುಹಿಸಬಹುದು." },
    en: { heading: "Re-interview needed", message: "Audio or video was unclear. Officers may send another interview link." },
  },
  suspected_duplicate: {
    kn: { heading: "ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ", message: "ಗುರುತು ಪರಿಶೀಲನೆಗಾಗಿ ಅಧಿಕಾರಿಗಳು ನೋಡುತ್ತಾರೆ." },
    en: { heading: "Under verification", message: "Officers will review identity signals before the next step." },
  },
};
