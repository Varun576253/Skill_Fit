import { useState } from "react";
import { useLocation } from "wouter";
import { LANGUAGES, WELCOME_TEXT } from "@/lib/constants";
import { setState, getState } from "@/lib/store";

export default function Landing() {
  const [, navigate] = useLocation();
  const current = getState();
  const [lang, setLang] = useState<"kn" | "hi" | "en">(current.language || "kn");

  const text = WELCOME_TEXT[lang];

  function handleStart() {
    setState({ language: lang });
    navigate("/register");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      {/* Government Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-4 shadow-md">
          <span className="text-2xl font-bold text-white">KA</span>
        </div>
        <div className="text-center">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">
            Government of Karnataka
          </p>
          <h1 className="text-2xl font-bold text-foreground">AI SkillFit</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Video assessment for workforce fitment
          </p>
          <p className="text-xs text-muted-foreground/90 mt-2 max-w-[280px] leading-snug">
            Directorate of Electronic Delivery of Citizen Services (EDCS), Government of Karnataka
          </p>
        </div>
      </div>

      {/* Language Selection */}
      <div className="w-full max-w-sm bg-card border border-card-border rounded-xl shadow-sm p-6">
        <p className="text-sm font-medium text-muted-foreground mb-4 text-center">
          Select your language / ಭಾಷೆ ಆಯ್ಕೆ ಮಾಡಿ / भाषा चुनें
        </p>
        <div className="flex gap-3 mb-6">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              data-testid={`lang-${l.code}`}
              onClick={() => setLang(l.code)}
              className={`flex-1 py-3 px-2 rounded-lg border-2 text-center transition-all font-medium text-sm
                ${lang === l.code
                  ? "border-primary bg-accent text-primary"
                  : "border-border bg-background text-foreground hover:border-primary/40"
                }`}
            >
              <div className="text-base">{l.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{l.name}</div>
            </button>
          ))}
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-foreground mb-2">{text.heading}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{text.sub}</p>
        </div>

        {/* Process steps */}
        <div className="space-y-3 mb-6">
          {[
            { step: "1", label: lang === "kn" ? "ನಿಮ್ಮ ವಿವರ ನೀಡಿ" : lang === "hi" ? "विवरण दें" : "Enter your details" },
            { step: "2", label: lang === "kn" ? "ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರ ನೀಡಿ" : lang === "hi" ? "प्रश्नों के उत्तर दें" : "Answer interview questions" },
            { step: "3", label: lang === "kn" ? "ಫಲಿತಾಂಶ ಪಡೆಯಿರಿ" : lang === "hi" ? "परिणाम प्राप्त करें" : "Receive your assessment" },
          ].map((item) => (
            <div key={item.step} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                {item.step}
              </div>
              <p className="text-sm text-foreground">{item.label}</p>
            </div>
          ))}
        </div>

        <button
          data-testid="btn-start"
          onClick={handleStart}
          className="w-full bg-primary text-white font-semibold py-4 rounded-lg text-base hover:bg-primary/90 transition-colors shadow-sm"
        >
          {text.start}
        </button>
      </div>

      <p className="text-xs text-muted-foreground mt-6 text-center max-w-xs">
        Your data is secure and used only for employment assessment purposes.
      </p>
    </div>
  );
}
