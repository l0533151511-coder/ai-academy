"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, X, BookOpen } from "lucide-react";
import { TRACKS } from "@/lib/curriculum/data";

interface SearchResult {
  href: string;
  lessonTitle: string;
  moduleTitle: string;
  trackTitle: string;
}

// אותיות סופיות (ך/ם/ן/ף/ץ) שונות יוניקודית מהצורה הרגילה — בלי נירמול הן לא יתאימו בחיפוש
// (למשל "טוקן" עם ן סופית לא ימצא "טוקניזציה" עם נ רגילה, למרות שזו אותה מילה מבחינת המשתמש).
function normalizeForSearch(text: string): string {
  return text
    .toLowerCase()
    .replace(/ך/g, "כ") // ך -> כ
    .replace(/ם/g, "מ") // ם -> מ
    .replace(/ן/g, "נ") // ן -> נ
    .replace(/ף/g, "פ") // ף -> פ
    .replace(/ץ/g, "צ"); // ץ -> צ
}

/** אינדקס חיפוש גלובלי — נבנה פעם אחת מתוכנית הלימודים, לשימוש בכל האתר. */
const SEARCH_INDEX: SearchResult[] = TRACKS.flatMap((track) =>
  track.modules.flatMap((module) =>
    module.lessons.map((lesson) => ({
      href: `/tracks/${track.slug}/${module.slug}/${lesson.slug}`,
      lessonTitle: lesson.title,
      moduleTitle: module.title,
      trackTitle: track.title,
    }))
  )
);

export function GlobalSearch() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  React.useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 10);
    else setQuery("");
  }, [open]);

  const results = React.useMemo(() => {
    if (!query.trim()) return [];
    const q = normalizeForSearch(query);
    return SEARCH_INDEX.filter(
      (r) =>
        normalizeForSearch(r.lessonTitle).includes(q) ||
        normalizeForSearch(r.moduleTitle).includes(q) ||
        normalizeForSearch(r.trackTitle).includes(q)
    ).slice(0, 20);
  }, [query]);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted transition hover:bg-background"
        aria-label="חיפוש גלובלי"
      >
        <Search size={15} />
        <span className="hidden sm:inline">חיפוש...</span>
        <kbd className="hidden rounded border border-border px-1.5 py-0.5 text-xs sm:inline">
          Ctrl+K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-24"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="חיפוש"
          >
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <Search size={18} className="text-muted" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="חפש שיעור, מודול, או מסלול..."
                aria-label="חיפוש"
                className="flex-1 bg-transparent outline-none"
              />
              <button onClick={() => setOpen(false)} aria-label="סגור חיפוש">
                <X size={16} className="text-muted" />
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto p-2" role="listbox" aria-label="תוצאות חיפוש" aria-live="polite">
              {query.trim() && results.length === 0 && (
                <p className="p-4 text-center text-sm text-muted">לא נמצאו תוצאות</p>
              )}
              {results.map((r) => (
                <button
                  key={r.href}
                  onClick={() => go(r.href)}
                  role="option"
                  aria-selected={false}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-right text-sm hover:bg-background"
                >
                  <BookOpen size={15} className="shrink-0 text-primary" />
                  <span className="flex-1">
                    <span className="block font-medium">{r.lessonTitle}</span>
                    <span className="block text-xs text-muted">
                      {r.trackTitle} / {r.moduleTitle}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
