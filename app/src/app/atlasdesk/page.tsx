import { Sparkles } from "lucide-react";
import { SupportChat } from "@/components/atlasdesk/support-chat";
import { ATLASDESK_VERSION_LABEL } from "@/lib/atlasdesk/config";

export const metadata = { title: "AtlasDesk — פרויקט האקדמיה" };

export default function AtlasDeskPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-6 text-center">
        <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted">
          <Sparkles size={14} className="text-primary" /> {ATLASDESK_VERSION_LABEL}
        </span>
        <h1 className="text-3xl font-extrabold">AtlasDesk</h1>
        <p className="mt-2 text-muted">
          זהו הפרויקט המסחרי שאתה בונה לאורך האקדמיה — מודול אחר מודול. גרסה זו כוללת רק את מנוע
          השיחה הבסיסי (Prompt Engineering). לחץ &quot;מצב מפתח&quot; כדי לראות טוקנים ועלות אמיתיים
          לכל הודעה.
        </p>
      </div>
      <SupportChat />
    </div>
  );
}
