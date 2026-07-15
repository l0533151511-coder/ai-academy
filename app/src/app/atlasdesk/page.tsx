import { Sparkles } from "lucide-react";
import { SupportChat } from "@/components/atlasdesk/support-chat";
import { ATLASDESK_VERSION_LABEL } from "@/lib/atlasdesk/config";

export const metadata = {
  title: "AtlasDesk — פרויקט האקדמיה",
  description: "מוצר ה-AI המתמשך שנבנה לאורך האקדמיה — צ׳אט תמיכה עם כלים, RAG, סוכן ומערכת רב-סוכנית.",
};

export default function AtlasDeskPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-6 text-center">
        <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted">
          <Sparkles size={14} className="text-primary" /> {ATLASDESK_VERSION_LABEL}
        </span>
        <h1 className="text-3xl font-extrabold">AtlasDesk</h1>
        <p className="mt-2 text-muted">
          זהו הפרויקט המסחרי שאתה בונה לאורך האקדמיה — מודול אחר מודול. השיחה נשמרת אצלך בין
          רענוני דף. לחץ &quot;כלים מחוברים&quot; ונסה לשאול על פנייה (AD-1042 / AD-2087 / AD-3311)
          כדי לראות Tool Calling אמיתי בפעולה, ו&quot;מצב מפתח&quot; לראות טוקנים/עלות/יומן כלים.
        </p>
      </div>
      <SupportChat />
    </div>
  );
}
